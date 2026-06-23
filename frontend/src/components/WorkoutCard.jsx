import { useState, useRef, useCallback } from 'react';
import { removeExerciseFromWorkout, deleteWorkout, updateExerciseWeight } from '../api/api';
import './WorkoutCard.css';

function WorkoutExerciseItem({ assoc, onRemove, onUpdate }) {
  const { exercise } = assoc;
  const [weight, setWeight] = useState(String(exercise.weight || ''));
  const [saved, setSaved] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef(null);

  const handleWeightChange = useCallback((e) => {
    const value = e.target.value;
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;

    setWeight(value);
    setSaved(false);
    setShowSaved(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const numValue = parseFloat(value) || 0;
      try {
        await updateExerciseWeight(exercise.id, numValue);
        setSaved(true);
        setShowSaved(true);
        onUpdate();
        setTimeout(() => {
          setSaved(false);
          setShowSaved(false);
        }, 1500);
      } catch (err) {
        console.error('Erro ao salvar carga:', err);
      }
    }, 500);
  }, [exercise.id, onUpdate]);

  const currentWeight = parseFloat(weight) || 0;

  return (
    <div className={`workout-exercise-card ${isOpen ? 'open' : ''}`}>
      <div 
        className="workout-exercise-header"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
      >
        <div className="workout-exercise-header-left">
          <span className="workout-exercise-name">{exercise.name}</span>
        </div>
        <div className="workout-exercise-header-right">
          <span className={`weight-badge ${currentWeight > 0 ? 'has-weight' : ''}`}>
            {currentWeight > 0 ? `${currentWeight} kg` : '—'}
          </span>
          <button
            className="remove-exercise-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(exercise.id);
            }}
            title="Remover exercício"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <svg className={`workout-chevron ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      
      <div className="workout-exercise-body">
        <div className="exercise-grid">
          <div className="exercise-stat">
            <span className="stat-label">Séries</span>
            <span className="stat-value">{exercise.default_sets}</span>
          </div>
          <div className="exercise-stat">
            <span className="stat-label">Repetições</span>
            <span className="stat-value">{exercise.default_reps}</span>
          </div>
          <div className="exercise-stat">
            <span className="stat-label">Intervalo</span>
            <span className="stat-value">{exercise.default_rest}s</span>
          </div>
          <div className="exercise-stat editable">
            <span className="stat-label">Carga</span>
            <div className="weight-input-wrapper">
              <input
                type="text"
                inputMode="decimal"
                className={`weight-input ${saved ? 'saved' : ''}`}
                value={weight}
                onChange={handleWeightChange}
                onClick={(e) => e.stopPropagation()}
                placeholder="0"
              />
              <span className="weight-unit">kg</span>
            </div>
            <span className={`save-indicator ${showSaved ? 'visible' : ''}`}>
              ✓ Salvo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkoutCard({ workout, index, onUpdate, onOpenAddExercise }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      className={`workout-card ${isOpen ? 'open' : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
      id={`workout-card-${workout.id}`}
    >
      <div 
        className="workout-card-header" 
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
      >
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
            onClick={(e) => {
              e.stopPropagation();
              onOpenAddExercise(workout.id);
            }}
            title="Adicionar exercício"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            className="workout-action-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(!confirmDelete);
            }}
            title="Excluir treino"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          <svg className={`workout-chevron ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="workout-card-body-wrapper">
        <div className="workout-card-body">
          {workout.exercises.length > 0 ? (
            <div className="workout-exercise-list">
              {workout.exercises.map((assoc) => (
                <WorkoutExerciseItem
                  key={assoc.exercise_id}
                  assoc={assoc}
                  onRemove={handleRemoveExercise}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="workout-card-empty">
              Nenhum exercício adicionado ainda
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <div className="delete-confirm-overlay">
          <span className="delete-confirm-text">Excluir este treino?</span>
          <div className="delete-confirm-actions">
            <button
              className="confirm-btn cancel"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(false);
              }}
            >
              Cancelar
            </button>
            <button
              className="confirm-btn danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWorkout();
              }}
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
