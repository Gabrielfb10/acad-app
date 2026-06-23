from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# ──────────────────────────────────
# Exercise Schemas
# ──────────────────────────────────

class ExerciseBase(BaseModel):
    name: str
    default_sets: int = 3
    default_reps: int = 15
    default_rest: int = 50
    weight: float = 0.0


class ExerciseResponse(ExerciseBase):
    id: int

    class Config:
        from_attributes = True


class WeightUpdate(BaseModel):
    weight: float

class ExerciseUpdate(BaseModel):
    default_sets: int
    default_reps: int
    default_rest: int


# ──────────────────────────────────
# Workout Schemas
# ──────────────────────────────────

class WorkoutCreate(BaseModel):
    title: str


class WorkoutExerciseAdd(BaseModel):
    exercise_id: int


class WorkoutExerciseResponse(BaseModel):
    exercise_id: int
    order_index: int
    exercise: ExerciseResponse

    class Config:
        from_attributes = True


class WorkoutResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    exercises: list[WorkoutExerciseResponse] = []

    class Config:
        from_attributes = True
