const API_BASE = window.location.port === "5173"
  ? "http://localhost:8000/api"
  : "/api";

/**
 * Wrapper para fetch com tratamento de erros.
 */
async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Erro ${response.status}`);
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

// ──────────────────────────────────
// Exercises
// ──────────────────────────────────

export async function fetchExercises() {
  return request("/exercises");
}

export async function updateExerciseWeight(exerciseId, weight) {
  return request(`/exercises/${exerciseId}/weight`, {
    method: "PUT",
    body: JSON.stringify({ weight }),
  });
}

// ──────────────────────────────────
// Workouts
// ──────────────────────────────────

export async function fetchWorkouts() {
  return request("/workouts");
}

export async function createWorkout(title) {
  return request("/workouts", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function deleteWorkout(workoutId) {
  return request(`/workouts/${workoutId}`, {
    method: "DELETE",
  });
}

// ──────────────────────────────────
// Workout Exercises
// ──────────────────────────────────

export async function addExerciseToWorkout(workoutId, exerciseId) {
  return request(`/workouts/${workoutId}/exercises`, {
    method: "POST",
    body: JSON.stringify({ exercise_id: exerciseId }),
  });
}

export async function removeExerciseFromWorkout(workoutId, exerciseId) {
  return request(`/workouts/${workoutId}/exercises/${exerciseId}`, {
    method: "DELETE",
  });
}
