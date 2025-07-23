const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const ENDPOINTS = {
  sudoku : (level) => `${API_BASE}/api/sudoku?level=${level}`,
  leaderboard : (level) => `${API_BASE}/api/leaderboard?level=${level}`,
  postScore : `${API_BASE}/api/leaderboard`
}