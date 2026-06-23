import { useState, useRef, useCallback } from 'react';
import { updateExerciseWeight } from '../api/api';
import './ExerciseAccordion.css';

export default function ExerciseAccordion({ exercise, index, onWeightUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState(String(exercise.weight || ''));
  const [saved, setSaved] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const debounceRef = useRef(null);

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
        </div>
      </div>
    </div>
  );
}
