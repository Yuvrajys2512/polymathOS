import { useState, useEffect, useRef } from 'react';
import { FOCUS_PRESETS, IDENTITY_MODES } from '../constants/index.js';

export function useTimer(defaultMinutes, onFinish) {
  const [mode,          setMode]          = useState('focus');
  const [running,       setRunning]       = useState(false);
  const [remaining,     setRemaining]     = useState(defaultMinutes * 60);
  const [focusMinutes,  setFocusMinutes]  = useState(defaultMinutes);
  const [identityMode,  setIdentityMode]  = useState(IDENTITY_MODES[0]);
  const [pausedThisSession, setPausedThisSession] = useState(false);
  const [lootPending,   setLootPending]   = useState(false);

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const totalSec = (mode === 'focus' ? focusMinutes : 5) * 60;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev > 1) return prev - 1;
        const currentMode = modeRef.current;
        onFinish(currentMode, focusMinutes, identityMode);
        // Natural finish — award loot if no pauses during focus
        if (currentMode === 'focus') {
          setLootPending(p => p || true);
        }
        const next = currentMode === 'focus' ? 'break' : 'focus';
        setMode(next);
        setRunning(false);
        setPausedThisSession(false);
        return (next === 'focus' ? focusMinutes : 5) * 60;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, focusMinutes, identityMode, onFinish]);

  function adjustFocus(delta) {
    const next = Math.max(5, Math.min(90, focusMinutes + delta));
    setFocusMinutes(next);
    if (!running) setRemaining(next * 60);
  }

  function selectPreset(mins) {
    setFocusMinutes(mins);
    if (!running) setRemaining(mins * 60);
  }

  function toggleRunning() {
    setRunning(r => {
      if (r) setPausedThisSession(true); // user is pausing
      return !r;
    });
  }

  function reset() {
    setRunning(false);
    setRemaining(focusMinutes * 60);
    setMode('focus');
    setPausedThisSession(false);
  }

  function forceFinish() {
    const currentMode = modeRef.current;
    onFinish(currentMode, focusMinutes, identityMode);
    const next = currentMode === 'focus' ? 'break' : 'focus';
    setMode(next);
    setRunning(false);
    setPausedThisSession(false);
    setRemaining((next === 'focus' ? focusMinutes : 5) * 60);
    // No loot on force-finish — they skipped it
  }

  function clearLoot() { setLootPending(false); }

  function startChaosSession(minutes) {
    const mins = minutes || focusMinutes;
    setFocusMinutes(mins);
    setRemaining(mins * 60);
    setMode('focus');
    setRunning(true);
    setPausedThisSession(false);
  }

  return {
    mode, running, remaining, totalSec,
    focusMinutes, identityMode,
    pausedThisSession, lootPending, clearLoot,
    setIdentityMode,
    toggleRunning, reset, forceFinish,
    adjustFocus, selectPreset,
    startChaosSession,
  };
}
