export default function XpFloats({ floats }) {
  return (
    <>
      {floats.map(f => (
        <div key={f.id} className="xp-float" style={{ top: f.y, left: f.x }}>
          +{f.amt} XP
        </div>
      ))}
    </>
  );
}
