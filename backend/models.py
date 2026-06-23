from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database import Base


class Exercise(Base):
    """Modelo de Exercício."""
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    default_sets = Column(Integer, default=3)
    default_reps = Column(Integer, default=15)
    default_rest = Column(Integer, default=50)
    weight = Column(Float, default=0.0)

    # Relacionamento com workouts via tabela associativa
    workout_associations = relationship(
        "WorkoutExercise", back_populates="exercise", cascade="all, delete-orphan"
    )


class Workout(Base):
    """Modelo de Treino."""
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relacionamento com exercícios via tabela associativa
    exercise_associations = relationship(
        "WorkoutExercise", back_populates="workout", cascade="all, delete-orphan",
        order_by="WorkoutExercise.order_index"
    )


class WorkoutExercise(Base):
    """Tabela de associação Workout <-> Exercise."""
    __tablename__ = "workout_exercises"

    workout_id = Column(Integer, ForeignKey("workouts.id", ondelete="CASCADE"), primary_key=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id", ondelete="CASCADE"), primary_key=True)
    order_index = Column(Integer, default=0)

    workout = relationship("Workout", back_populates="exercise_associations")
    exercise = relationship("Exercise", back_populates="workout_associations")
