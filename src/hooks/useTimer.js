import { useState, useEffect, useRef } from 'react';
import { FOCUS_PRESETS, IDENTITY_MODES } from '../constants/index.js';

export function useTimer(defaultMinutes, onFinish) {
  const [mode,          setMode]          = useState('focus');
  const [running,       setRunning]       = useState(false);
  const [remaining,     setRemaining]     = useState(defaultMinutes * 60);
  const [focusMinutes,  setFocusMinutes]  = useState(defaultMinutes);
  const [identityMode,  setIdentityMode]  = useState(IDENTITY_MODES[0]);
  const [pausedThisSession, setPausedThisSession] = useState(false);
  const [pauseCount,    setPauseCount]    = useState(0);
  const [lootPending,   setLootPending]   = useState(false);

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const totalSec = (mode === 'focus' ? focusMinutes : 5) * 60;
  const elapsedFocusSec = mode === 'focus' ? Math.max(0, totalSec - remaining) : 0;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev > 1) return prev - 1;
        const currentMode = modeRef.current;
        onFinish(currentMode, focusMinutes, identityMode);
        if (currentMode === 'focus') {
          setLootPending(p => p || true);
        }
        const next = currentMode === 'focus' ? 'break' : 'focus';
        setMode(next);
        setRunning(false);
        setPausedThisSession(false);
        setPauseCount(0);
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
      if (r) {
        setPausedThisSession(true);
        setPauseCount(c => c + 1);
      }
      return !r;
    });
  }

  function reset() {
    setRunning(false);
    setRemaining(focusMinutes * 60);
    setMode('focus');
    setPausedThisSession(false);
    setPauseCount(0);
  }

  function forceFinish() {
    const currentMode = modeRef.current;
    onFinish(currentMode, focusMinutes, identityMode);
    const next = currentMode === 'focus' ? 'break' : 'focus';
    setMode(next);
    setRunning(false);
    setPausedThisSession(false);
    setPauseCount(0);
    setRemaining((next === 'focus' ? focusMinutes : 5) * 60);
  }

  function clearLoot() { setLootPending(false); }

  function startChaosSession(minutes) {
    const mins = minutes || focusMinutes;
    setFocusMinutes(mins);
    setRemaining(mins * 60);
    setMode('focus');
    setRunning(true);
    setPausedThisSession(false);
    setPauseCount(0);
  }

  return {
    mode, running, remaining, totalSec,
    focusMinutes, identityMode,
    pausedThisSession, pauseCount, elapsedFocusSec,
    lootPending, clearLoot,
    setIdentityMode,
    toggleRunning, reset, forceFinish,
    adjustFocus, selectPreset,
    startChaosSession,
  };
}
