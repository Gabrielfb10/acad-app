import { useState, useEffect, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import ExerciseList from './components/ExerciseList';
import WorkoutList from './components/WorkoutList';
import NewWorkoutModal from './components/NewWorkoutModal';
import AddExerciseModal from './components/AddExerciseModal';
import UserSelection from './components/UserSelection';
import { fetchExercises, fetchWorkouts } from './api/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('currentUser'));
  const [activeTab, setActiveTab] = useState('exercises');
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const [addExerciseWorkoutId, setAddExerciseWorkoutId] = useState(null);

  // ──────────────────────────────────
  // Data fetching
  // ──────────────────────────────────

  const loadExercises = useCallback(async () => {
    try {
      const data = await fetchExercises();
      setExercises(data);
    } catch (err) {
      console.error('Erro ao carregar exercícios:', err);
    }
  }, []);

  const loadWorkouts = useCallback(async () => {
    try {
      const data = await fetchWorkouts();
      setWorkouts(data);
    } catch (err) {
      console.error('Erro ao carregar treinos:', err);
    }
  }, []);

  const loadAll = useCallback(async () => {
    if (!currentUser) return; // Só carrega se tiver usuário
    setLoading(true);
    await Promise.all([loadExercises(), loadWorkouts()]);
    setLoading(false);
  }, [currentUser, loadExercises, loadWorkouts]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSelectUser = (user) => {
    localStorage.setItem('currentUser', user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setExercises([]);
    setWorkouts([]);
  };

  // ──────────────────────────────────
  // Handlers
  // ──────────────────────────────────

  const handleWeightUpdate = (exerciseId, newWeight) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId ? { ...ex, weight: newWeight } : ex
      )
    );
  };

  const handleWorkoutCreated = () => {
    loadWorkouts();
  };

  const handleWorkoutUpdate = () => {
    loadWorkouts();
  };

  const handleOpenAddExercise = (workoutId) => {
    setAddExerciseWorkoutId(workoutId);
  };

  const handleExerciseAdded = () => {
    loadWorkouts();
  };

  // Get current workout's exercise IDs for the add modal
  const currentWorkoutExerciseIds = addExerciseWorkoutId
    ? (workouts.find((w) => w.id === addExerciseWorkoutId)?.exercises || []).map(
        (e) => e.exercise_id
      )
    : [];

  // ──────────────────────────────────
  // Loading state
  // ──────────────────────────────────

  if (!currentUser) {
    return <UserSelection onSelectUser={handleSelectUser} />;
  }

  if (loading) {
    return (
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ef4444, #f97316)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 32px rgba(239, 68, 68, 0.3)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M6.5 6.5h11M6.5 17.5h11M3 11h3.5M17.5 11H21M5.5 6.5v5M5.5 11v6.5M18.5 6.5v5M18.5 11v6.5" />
              <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
          </div>
          <p style={{
            color: '#a1a1aa',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}>
            Carregando treinos do {currentUser}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app-container">
        <header className="app-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '16px',
          borderRadius: '0 0 16px 16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {currentUser}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sair
          </button>
        </header>

        {activeTab === 'exercises' ? (
          <ExerciseList
            exercises={exercises}
            onWeightUpdate={handleWeightUpdate}
          />
        ) : (
          <WorkoutList
            workouts={workouts}
            onUpdate={handleWorkoutUpdate}
            onOpenNewWorkout={() => setShowNewWorkout(true)}
            onOpenAddExercise={handleOpenAddExercise}
          />
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <NewWorkoutModal
        isOpen={showNewWorkout}
        onClose={() => setShowNewWorkout(false)}
        onCreated={handleWorkoutCreated}
      />

      <AddExerciseModal
        isOpen={addExerciseWorkoutId !== null}
        workoutId={addExerciseWorkoutId}
        exercises={exercises}
        currentExerciseIds={currentWorkoutExerciseIds}
        onClose={() => setAddExerciseWorkoutId(null)}
        onAdded={handleExerciseAdded}
      />
    </>
  );
}
