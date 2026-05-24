import FocusTimer from '../components/Timer/FocusTimer.jsx';

export default function FocusView({
  actDomain, setActDomain, domains, timer, sessions,
  identityModes, addIdentityMode, deleteIdentityMode,
  addDomain, deleteDomain,
  submitThought, apiKey,
}) {
  return (
    <div className="focus-view">
      <div className="view-header">
        <span className="view-title">FOCUS</span>
        <span className="view-hint">Select a mode, set your time, lock in</span>
      </div>
      <FocusTimer
        actDomain={actDomain}
        setActDomain={setActDomain}
        domains={domains}
        timer={timer}
        sessions={sessions}
        identityModes={identityModes}
        addIdentityMode={addIdentityMode}
        deleteIdentityMode={deleteIdentityMode}
        addDomain={addDomain}
        deleteDomain={deleteDomain}
        submitThought={submitThought}
        apiKey={apiKey}
      />
    </div>
  );
}
