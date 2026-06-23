import './BottomNav.css';

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav" id="bottom-nav">
      {/* SVG Gradient Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>

      <div className="bottom-nav-inner">
        <button
          className={`nav-tab ${activeTab === 'exercises' ? 'active' : ''}`}
          onClick={() => onTabChange('exercises')}
          id="tab-exercises"
          aria-label="Exercícios"
        >
          <span className="nav-tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 6.5h11M6.5 17.5h11M3 11h3.5M17.5 11H21M5.5 6.5v5M5.5 11v6.5M18.5 6.5v5M18.5 11v6.5M3 11h0M21 11h0" />
              <rect x="2" y="9.5" width="2.5" height="5" rx="0.5" />
              <rect x="19.5" y="9.5" width="2.5" height="5" rx="0.5" />
              <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
          </span>
          <span className="nav-tab-label">Exercícios</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => onTabChange('workouts')}
          id="tab-workouts"
          aria-label="Treinos"
        >
          <span className="nav-tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h6" />
            </svg>
          </span>
          <span className="nav-tab-label">Treinos</span>
        </button>
      </div>
    </nav>
  );
}
