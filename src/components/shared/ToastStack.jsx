export default function ToastStack({ toasts, dismiss }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.tid} className="ach-toast" onClick={() => dismiss(t.tid)}>
          <span className="toast-icon">{t.icon}</span>
          <div>
            <div className="toast-eyebrow">Achievement Unlocked</div>
            <div className="toast-title">{t.title}</div>
            <div className="toast-desc">{t.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
