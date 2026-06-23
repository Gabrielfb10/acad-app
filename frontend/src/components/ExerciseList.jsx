import { useState, useMemo } from 'react';
import ExerciseAccordion from './ExerciseAccordion';
import './ExerciseList.css';

export default function ExerciseList({ exercises, onWeightUpdate }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return exercises;
    const term = search.toLowerCase();
    return exercises.filter((ex) => ex.name.toLowerCase().includes(term));
  }, [exercises, search]);

  return (
    <div className="page-content" id="exercises-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Exercícios</h1>
          <p className="page-subtitle">Gerencie seus exercícios e cargas</p>
        </div>
        <span className="page-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {exercises.length}
        </span>
      </div>

      <div className="exercise-search-wrapper">
        <svg className="exercise-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="exercise-search"
          placeholder="Buscar exercício..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="exercise-search"
        />
      </div>

      <div className="exercise-list">
        {filtered.length > 0 ? (
          filtered.map((exercise, i) => (
            <ExerciseAccordion
              key={exercise.id}
              exercise={exercise}
              index={i}
              onWeightUpdate={onWeightUpdate}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3>Nenhum exercício encontrado</h3>
            <p>Tente buscar com outro termo</p>
          </div>
        )}
      </div>
    </div>
  );
}
