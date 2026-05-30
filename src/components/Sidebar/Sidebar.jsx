const NAV = [
  { id: 'home',     icon: '⌂', label: 'Home'     },
  { id: 'focus',    icon: '◉', label: 'Focus'    },
  { id: 'thoughts', icon: '☁', label: 'Thoughts' },
  { id: 'todo',     icon: '☑', label: 'To-Do'    },
  { id: 'quests',   icon: '⚔', label: 'Quests'   },
  { id: 'projects', icon: '▣', label: 'Projects' },
  { id: 'profile',  icon: '◆', label: 'Profile'  },
  { id: 'cosmos',   icon: '∞', label: 'Cosmos'   },
];

const OVERLAYS = [
  { id: 'forge',    icon: '✦', label: 'Forge', kind: 'overlay' },
  { id: 'brainmap', icon: '◎', label: 'Map',   kind: 'overlay' },
];

export default function Sidebar({ activeView, onNav, onForge, onBrainMap, onHelp, focusLocked, todoPendingCount }) {
  function handleOverlay(id) {
    if (id === 'forge')    onForge();
    if (id === 'brainmap') onBrainMap();
  }

  return (
    <nav className={`sidebar${focusLocked ? ' focus-locked' : ''}`}>
      <div className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`sidebar-item${activeView === item.id ? ' active' : ''}`}
            onClick={() => onNav(item.id)}
            title={item.label}
          >
            <span className="sidebar-icon" style={{ position: 'relative' }}>
              {item.icon}
              {item.id === 'todo' && todoPendingCount > 0 && (
                <span className="todo-badge">{todoPendingCount > 9 ? '9+' : todoPendingCount}</span>
              )}
            </span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-overlays">
        {OVERLAYS.map(item => (
          <button
            key={item.id}
            className={`sidebar-item overlay${item.kind === 'nav' && activeView === item.id ? ' active' : ''}`}
            onClick={() => item.kind === 'nav' ? onNav(item.id) : handleOverlay(item.id)}
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-help">
        <button className="sidebar-item overlay" onClick={onHelp} title="Help / Tutorial">
          <span className="sidebar-icon">?</span>
          <span className="sidebar-label">Help</span>
        </button>
      </div>
    </nav>
  );
}
