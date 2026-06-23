import { useState } from 'react';
import { removeExerciseFromWorkout, deleteWorkout } from '../api/api';
import './WorkoutCard.css';

export default function WorkoutCard({ workout, index, onUpdate, onOpenAddExercise }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRemoveExercise = async (exerciseId) => {
    try {
      await removeExerciseFromWorkout(workout.id, exerciseId);
      onUpdate();
    } catch (err) {
      console.error('Erro ao remover exercício:', err);
    }
  };

  const handleDeleteWorkout = async () => {
    setLoading(true);
    try {
      await deleteWorkout(workout.id);
      onUpdate();
    } catch (err) {
      console.error('Erro ao deletar treino:', err);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className="workout-card"
      style={{ animationDelay: `${index * 60}ms` }}
      id={`workout-card-${workout.id}`}
    >
      <div className="workout-card-header">
        <div className="workout-card-info">
          <h3 className="workout-card-title">{workout.title}</h3>
          <div className="workout-card-meta">
            <span className="workout-card-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(workout.created_at)}
            </span>
            <span className="workout-card-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
              {workout.exercises.length} exercícios
            </span>
          </div>
        </div>

        <div className="workout-card-actions">
          <button
            className="workout-action-btn add"
            onClick={() => onOpenAddExercise(workout.id)}
            title="Adicionar exercício"
            id={`add-exercise-btn-${workout.id}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            className="workout-action-btn delete"
            onClick={() => setConfirmDelete(!confirmDelete)}
            title="Excluir treino"
            id={`delete-workout-btn-${workout.id}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="workout-card-body">
        {workout.exercises.length > 0 ? (
          <ul className="workout-exercise-list">
            {workout.exercises.map((assoc) => (
              <li
                className="workout-exercise-item"
                key={assoc.exercise_id}
              >
                <div className="workout-exercise-left">
                  <span className="exercise-order-dot" />
                  <span className="workout-exercise-name">
                    {assoc.exercise.name}
                  </span>
                </div>
                {assoc.exercise.weight > 0 && (
                  <span className="workout-exercise-weight">
                    {assoc.exercise.weight} kg
                  </span>
                )}
                <button
                  className="remove-exercise-btn"
                  onClick={() => handleRemoveExercise(assoc.exercise_id)}
                  title="Remover exercício"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="workout-card-empty">
            Nenhum exercício adicionado ainda
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="delete-confirm-overlay">
          <span className="delete-confirm-text">Excluir este treino?</span>
          <div className="delete-confirm-actions">
            <button
              className="confirm-btn cancel"
              onClick={() => setConfirmDelete(false)}
            >
              Cancelar
            </button>
            <button
              className="confirm-btn danger"
              onClick={handleDeleteWorkout}
              disabled={loading}
            >
              {loading ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
