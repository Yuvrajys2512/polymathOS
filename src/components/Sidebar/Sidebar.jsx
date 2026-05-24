const NAV = [
  { id: 'home',      icon: '⌂', label: 'Home'     },
  { id: 'focus',     icon: '◉', label: 'Focus'    },
  { id: 'thoughts',  icon: '☁', label: 'Thoughts' },
  { id: 'quests',    icon: '⚔', label: 'Quests'   },
  { id: 'character', icon: '◆', label: 'Profile'  },
];

const OVERLAYS = [
  { id: 'forge',    icon: '✦', label: 'Forge'    },
  { id: 'brainmap', icon: '◎', label: 'Map'      },
];

export default function Sidebar({ activeView, onNav, onForge, onBrainMap, onTodo, todoOpen, focusLocked, todoPendingCount }) {
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
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-divider" />

      {/* Todo drawer button */}
      <button
        className={`sidebar-item todo-sidebar-btn${todoOpen ? ' active' : ''}`}
        onClick={onTodo}
        title="Daily To-Do"
      >
        <span className="sidebar-icon" style={{ position: 'relative' }}>
          ☑
          {todoPendingCount > 0 && (
            <span className="todo-badge">{todoPendingCount > 9 ? '9+' : todoPendingCount}</span>
          )}
        </span>
        <span className="sidebar-label">To-Do</span>
      </button>

      <div className="sidebar-divider" />

      <div className="sidebar-overlays">
        {OVERLAYS.map(item => (
          <button
            key={item.id}
            className="sidebar-item overlay"
            onClick={() => handleOverlay(item.id)}
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
