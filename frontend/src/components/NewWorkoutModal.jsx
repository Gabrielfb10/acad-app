import { useState } from 'react';
import { createWorkout } from '../api/api';
import './NewWorkoutModal.css';

export default function NewWorkoutModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createWorkout(title.trim());
      setTitle('');
      onCreated();
      onClose();
    } catch (err) {
      console.error('Erro ao criar treino:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} id="new-workout-modal">
      <div className="modal-content">
        <div className="modal-handle">
          <div className="modal-handle-bar" />
        </div>

        <div className="modal-header">
          <h2 className="modal-title">Novo Treino</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <input
              type="text"
              className="new-workout-input"
              placeholder='Ex: "Treino A - Peito e Tríceps"'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              maxLength={60}
              id="new-workout-name-input"
            />
            <p className="workout-name-hint">
              Dê um nome descritivo para identificar seu treino
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal-btn primary"
              disabled={!title.trim() || loading}
            >
              {loading ? 'Criando...' : 'Criar Treino'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
