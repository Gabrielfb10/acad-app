import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Exercise, Workout, WorkoutExercise
from schemas import (
    ExerciseResponse,
    WeightUpdate,
    WorkoutCreate,
    WorkoutExerciseAdd,
    WorkoutResponse,
)
from seed import seed_exercises


# ──────────────────────────────────
# Lifecycle
# ──────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Cria tabelas e executa seed no startup."""
    Base.metadata.create_all(bind=engine)
    from database import SessionLocal
    db = SessionLocal()
    try:
        seed_exercises(db)
    finally:
        db.close()
    yield


# ──────────────────────────────────
# App
# ──────────────────────────────────

app = FastAPI(
    title="AcadApp API",
    description="API para gerenciamento de treinos de academia",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────
# Exercises
# ──────────────────────────────────

@app.get("/api/exercises", response_model=list[ExerciseResponse])
def list_exercises(db: Session = Depends(get_db)):
    """Retorna todos os exercícios."""
    return db.query(Exercise).order_by(Exercise.name).all()


@app.put("/api/exercises/{exercise_id}/weight", response_model=ExerciseResponse)
def update_exercise_weight(
    exercise_id: int,
    payload: WeightUpdate,
    db: Session = Depends(get_db),
):
    """Atualiza a carga de um exercício."""
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    exercise.weight = payload.weight
    db.commit()
    db.refresh(exercise)
    return exercise


# ──────────────────────────────────
# Workouts
# ──────────────────────────────────

@app.get("/api/workouts", response_model=list[WorkoutResponse])
def list_workouts(db: Session = Depends(get_db)):
    """Retorna todos os treinos com seus exercícios."""
    workouts = db.query(Workout).order_by(Workout.created_at.desc()).all()
    results = []
    for workout in workouts:
        exercises = []
        for assoc in workout.exercise_associations:
            exercises.append({
                "exercise_id": assoc.exercise_id,
                "order_index": assoc.order_index,
                "exercise": assoc.exercise,
            })
        results.append({
            "id": workout.id,
            "title": workout.title,
            "created_at": workout.created_at,
            "exercises": exercises,
        })
    return results


@app.post("/api/workouts", response_model=WorkoutResponse, status_code=201)
def create_workout(payload: WorkoutCreate, db: Session = Depends(get_db)):
    """Cria um novo treino."""
    workout = Workout(title=payload.title)
    db.add(workout)
    db.commit()
    db.refresh(workout)
    return {
        "id": workout.id,
        "title": workout.title,
        "created_at": workout.created_at,
        "exercises": [],
    }


@app.delete("/api/workouts/{workout_id}", status_code=204)
def delete_workout(workout_id: int, db: Session = Depends(get_db)):
    """Deleta um treino e suas associações."""
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    db.delete(workout)
    db.commit()


# ──────────────────────────────────
# Workout Exercises
# ──────────────────────────────────

@app.post("/api/workouts/{workout_id}/exercises", status_code=201)
def add_exercise_to_workout(
    workout_id: int,
    payload: WorkoutExerciseAdd,
    db: Session = Depends(get_db),
):
    """Adiciona um exercício a um treino."""
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Treino não encontrado")

    exercise = db.query(Exercise).filter(Exercise.id == payload.exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")

    # Verifica duplicata
    existing = (
        db.query(WorkoutExercise)
        .filter(
            WorkoutExercise.workout_id == workout_id,
            WorkoutExercise.exercise_id == payload.exercise_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Exercício já está neste treino")

    # Calcula próximo order_index
    max_order = (
        db.query(WorkoutExercise.order_index)
        .filter(WorkoutExercise.workout_id == workout_id)
        .order_by(WorkoutExercise.order_index.desc())
        .first()
    )
    next_order = (max_order[0] + 1) if max_order else 0

    assoc = WorkoutExercise(
        workout_id=workout_id,
        exercise_id=payload.exercise_id,
        order_index=next_order,
    )
    db.add(assoc)
    db.commit()

    return {"message": "Exercício adicionado ao treino", "order_index": next_order}


@app.delete("/api/workouts/{workout_id}/exercises/{exercise_id}", status_code=204)
def remove_exercise_from_workout(
    workout_id: int,
    exercise_id: int,
    db: Session = Depends(get_db),
):
    """Remove um exercício de um treino."""
    assoc = (
        db.query(WorkoutExercise)
        .filter(
            WorkoutExercise.workout_id == workout_id,
            WorkoutExercise.exercise_id == exercise_id,
        )
        .first()
    )
    if not assoc:
        raise HTTPException(
            status_code=404, detail="Exercício não encontrado neste treino"
        )
    db.delete(assoc)
    db.commit()


# ──────────────────────────────────
# Static Files (Servir React Build)
# ──────────────────────────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
frontend_dist = os.path.normpath(os.path.join(BASE_DIR, "..", "frontend", "dist"))

if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")

