export default function StreakHeatmap({ thoughts }) {
  const DAYS = 30;
  const today = new Date();
  const dayCounts = {};
  thoughts.forEach(t => {
    const d = t.createdAt?.split('T')[0];
    if (d) dayCounts[d] = (dayCounts[d] || 0) + 1;
  });
  const cells = Array.from({ length: DAYS }, (_, i) => {
    const d  = new Date(today.getTime() - (DAYS - 1 - i) * 86400000);
    const ds = d.toISOString().split('T')[0];
    return { date: ds, count: dayCounts[ds] || 0 };
  });
  function cellBg(count) {
    if (count === 0) return 'rgba(255,255,255,0.04)';
    if (count <= 2)  return 'rgba(0,217,177,0.22)';
    if (count <= 5)  return 'rgba(0,217,177,0.45)';
    if (count <= 9)  return 'rgba(0,217,177,0.65)';
    return 'rgba(0,217,177,0.88)';
  }
  const activeDays = Object.keys(dayCounts).length;
  return (
    <div className="heatmap-bar">
      <div className="heatmap-head">
        <h2>Activity — Last 30 Days</h2>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
          {activeDays} active · {thoughts.length} total captures
        </span>
      </div>
      <div className="heatmap-grid">
        {cells.map(c => (
          <div key={c.date} className="heatmap-cell"
            style={{ background: cellBg(c.count) }}
            title={`${c.date}: ${c.count} capture${c.count !== 1 ? 's' : ''}`} />
        ))}
      </div>
    </div>
  );
}
