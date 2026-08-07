import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusLogEntry, FocusSettings } from '../types';
import { loadFocusLog, loadFocusSettings, saveFocusLog, saveFocusSettings } from '../storage';
import { createId } from '../utils';

export function useFocusWatchdog() {
  const [settings, setSettings] = useState<FocusSettings>(() => loadFocusSettings());
  const [log, setLog] = useState<FocusLogEntry[]>(() => loadFocusLog());
  const [pendingAwayMinutes, setPendingAwayMinutes] = useState<number | null>(null);
  const hiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    saveFocusSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveFocusLog(log);
  }, [log]);

  useEffect(() => {
    if (!settings.enabled) return;

    const handleVisibility = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
        return;
      }
      if (hiddenAtRef.current === null) return;
      const awayMinutes = Math.round((Date.now() - hiddenAtRef.current) / 60_000);
      hiddenAtRef.current = null;
      if (awayMinutes >= settings.thresholdMinutes) {
        setPendingAwayMinutes(awayMinutes);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [settings.enabled, settings.thresholdMinutes]);

  const updateSettings = useCallback((patch: Partial<FocusSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resolveCheckIn = useCallback(
    (wasScrolling: boolean, task: string) => {
      if (pendingAwayMinutes === null) return;
      setLog((prev) => [
        ...prev,
        {
          id: createId(),
          detectedAt: new Date().toISOString(),
          awayMinutes: pendingAwayMinutes,
          wasScrolling,
          task,
        },
      ]);
      setPendingAwayMinutes(null);
    },
    [pendingAwayMinutes],
  );

  const simulateReturn = useCallback(() => {
    setPendingAwayMinutes(settings.thresholdMinutes);
  }, [settings.thresholdMinutes]);

  return { settings, updateSettings, log, pendingAwayMinutes, resolveCheckIn, simulateReturn };
}
