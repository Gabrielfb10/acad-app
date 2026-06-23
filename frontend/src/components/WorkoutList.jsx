import WorkoutCard from './WorkoutCard';
import './WorkoutList.css';

export default function WorkoutList({ workouts, onUpdate, onOpenNewWorkout, onOpenAddExercise }) {
  return (
    <div className="page-content" id="workouts-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Meus Treinos</h1>
          <p className="page-subtitle">Organize suas rotinas de treino</p>
        </div>
        <span className="page-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
          {workouts.length}
        </span>
      </div>

      <button
        className="new-workout-btn"
        onClick={onOpenNewWorkout}
        id="new-workout-btn"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Novo Treino
      </button>

      <div className="workout-list-container">
        {workouts.length > 0 ? (
          workouts.map((workout, i) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              index={i}
              onUpdate={onUpdate}
              onOpenAddExercise={onOpenAddExercise}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h6" />
              </svg>
            </div>
            <h3>Nenhum treino criado</h3>
            <p>Crie seu primeiro treino tocando no botão acima</p>
          </div>
        )}
      </div>
    </div>
  );
}
