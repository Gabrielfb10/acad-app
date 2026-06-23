import { useState, useRef, useCallback } from 'react';
import { updateExerciseWeight, updateExerciseDetails } from '../api/api';
import './ExerciseAccordion.css';

export default function ExerciseAccordion({ exercise, index, onWeightUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState(String(exercise.weight || ''));
  const [saved, setSaved] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const debounceRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    sets: exercise.default_sets,
    reps: exercise.default_reps,
    rest: exercise.default_rest,
  });
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  const handleWeightChange = useCallback((e) => {
    const value = e.target.value;

    // Permite apenas números e ponto
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;

    setWeight(value);
    setSaved(false);
    setShowSaved(false);

    // Debounce de 500ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const numValue = parseFloat(value) || 0;
      try {
        await updateExerciseWeight(exercise.id, numValue);
        setSaved(true);
        setShowSaved(true);
        if (onWeightUpdate) onWeightUpdate(exercise.id, numValue);
        setTimeout(() => {
          setSaved(false);
          setShowSaved(false);
        }, 1500);
      } catch (err) {
        console.error('Erro ao salvar carga:', err);
      }
    }, 500);
  }, [exercise.id, onWeightUpdate]);

  const handleSaveDetails = async () => {
    setIsSavingDetails(true);
    try {
      await updateExerciseDetails(exercise.id, {
        default_sets: parseInt(editForm.sets) || 0,
        default_reps: parseInt(editForm.reps) || 0,
        default_rest: parseInt(editForm.rest) || 0,
      });
      setIsEditing(false);
      // Opcional: chamar uma função onUpdate se for necessário atualizar a lista do componente pai
      // Mas como a lista localiza as mudanças pela prop `exercise` que não vai re-renderizar sem onUpdate,
      // podemos apenas manter as mudanças no estado local ou confiar no pai. 
      // Por simplicidade, vamos manter a UI exibindo o `editForm`.
      exercise.default_sets = editForm.sets;
      exercise.default_reps = editForm.reps;
      exercise.default_rest = editForm.rest;
    } catch (err) {
      console.error('Erro ao salvar detalhes:', err);
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      sets: exercise.default_sets,
      reps: exercise.default_reps,
      rest: exercise.default_rest,
    });
    setIsEditing(false);
  };

  const currentWeight = parseFloat(weight) || 0;

  return (
    <div
      className={`accordion-item ${isOpen ? 'open' : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
      id={`exercise-accordion-${exercise.id}`}
    >
      <div
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
      >
        <div className="accordion-header-left">
          <span className="accordion-order">{index + 1}</span>
          <span className="accordion-name">{exercise.name}</span>
        </div>
        <div className="accordion-header-right">
          <span className={`weight-badge ${currentWeight > 0 ? 'has-weight' : ''}`}>
            {currentWeight > 0 ? `${currentWeight} kg` : '—'}
          </span>
          <svg className="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="accordion-body">
        <div className="accordion-content">
          <div className="exercise-grid">
            <div className={`exercise-stat ${isEditing ? 'editing' : ''}`}>
              <span className="stat-label">Séries</span>
              {isEditing ? (
                <input 
                  type="number" 
                  className="edit-input" 
                  value={editForm.sets} 
                  onChange={(e) => setEditForm({...editForm, sets: e.target.value})}
                />
              ) : (
                <span className="stat-value">{exercise.default_sets}</span>
              )}
            </div>
            <div className={`exercise-stat ${isEditing ? 'editing' : ''}`}>
              <span className="stat-label">Repetições</span>
              {isEditing ? (
                <input 
                  type="number" 
                  className="edit-input" 
                  value={editForm.reps} 
                  onChange={(e) => setEditForm({...editForm, reps: e.target.value})}
                />
              ) : (
                <span className="stat-value">{exercise.default_reps}</span>
              )}
            </div>
            <div className={`exercise-stat ${isEditing ? 'editing' : ''}`}>
              <span className="stat-label">Intervalo</span>
              {isEditing ? (
                <div className="edit-input-wrapper">
                  <input 
                    type="number" 
                    className="edit-input" 
                    value={editForm.rest} 
                    onChange={(e) => setEditForm({...editForm, rest: e.target.value})}
                  />
                  <span className="edit-unit">s</span>
                </div>
              ) : (
                <span className="stat-value">{exercise.default_rest}s</span>
              )}
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
                  id={`weight-input-${exercise.id}`}
                  aria-label={`Carga do exercício ${exercise.name}`}
                />
                <span className="weight-unit">kg</span>
              </div>
              <span className={`save-indicator ${showSaved ? 'visible' : ''}`}>
                ✓ Salvo
              </span>
            </div>
          </div>
          
          <div className="exercise-actions">
            {isEditing ? (
              <>
                <button className="exercise-action-btn cancel" onClick={handleCancelEdit}>Cancelar</button>
                <button className="exercise-action-btn save" onClick={handleSaveDetails} disabled={isSavingDetails}>
                  {isSavingDetails ? 'Salvando...' : 'Salvar Detalhes'}
                </button>
              </>
            ) : (
              <button className="exercise-action-btn edit" onClick={() => setIsEditing(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Editar Informações
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
