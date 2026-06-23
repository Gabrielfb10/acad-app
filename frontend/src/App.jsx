import { useState, useEffect, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import ExerciseList from './components/ExerciseList';
import WorkoutList from './components/WorkoutList';
import NewWorkoutModal from './components/NewWorkoutModal';
import AddExerciseModal from './components/AddExerciseModal';
import { fetchExercises, fetchWorkouts } from './api/api';

export default function App() {
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
    setLoading(true);
    await Promise.all([loadExercises(), loadWorkouts()]);
    setLoading(false);
  }, [loadExercises, loadWorkouts]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

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
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app-container">
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
