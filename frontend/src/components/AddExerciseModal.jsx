import { useState, useMemo } from 'react';
import { addExerciseToWorkout } from '../api/api';
import './AddExerciseModal.css';
import './NewWorkoutModal.css';

export default function AddExerciseModal({
  isOpen,
  workoutId,
  exercises,
  currentExerciseIds,
  onClose,
  onAdded,
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return exercises;
    const term = search.toLowerCase();
    return exercises.filter((ex) => ex.name.toLowerCase().includes(term));
  }, [exercises, search]);

  if (!isOpen) return null;

  const toggleSelect = (exerciseId) => {
    if (currentExerciseIds.includes(exerciseId)) return;
    setSelected((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      for (const exerciseId of selected) {
        await addExerciseToWorkout(workoutId, exerciseId);
      }
      setSelected([]);
      setSearch('');
      onAdded();
      onClose();
    } catch (err) {
      console.error('Erro ao adicionar exercícios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelected([]);
      setSearch('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelected([]);
    setSearch('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} id="add-exercise-modal">
      <div className="modal-content">
        <div className="modal-handle">
          <div className="modal-handle-bar" />
        </div>

        <div className="modal-header">
          <h2 className="modal-title">Adicionar Exercícios</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="add-exercise-search-wrapper">
            <svg className="exercise-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="add-exercise-search"
              placeholder="Buscar exercício..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="add-exercise-search"
            />
          </div>

          <div className="exercise-select-list">
            {filtered.map((exercise) => {
              const isAlready = currentExerciseIds.includes(exercise.id);
              const isSelected = selected.includes(exercise.id);

              return (
                <div
                  key={exercise.id}
                  className={`exercise-select-item ${isAlready ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleSelect(exercise.id)}
                >
                  <div className="exercise-checkbox">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="exercise-select-name">{exercise.name}</span>
                  {isAlready && (
                    <span className="exercise-already-tag">Já adicionado</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          {selected.length > 0 && (
            <span className="selected-count">
              {selected.length} selecionado{selected.length > 1 ? 's' : ''}
            </span>
          )}
          <button
            className="modal-btn secondary"
            onClick={handleClose}
            style={{ flex: selected.length > 0 ? 'none' : '1' }}
          >
            Cancelar
          </button>
          <button
            className="modal-btn primary"
            onClick={handleAdd}
            disabled={selected.length === 0 || loading}
          >
            {loading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
