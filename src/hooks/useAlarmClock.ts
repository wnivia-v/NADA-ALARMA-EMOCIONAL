import { useCallback, useEffect, useRef, useState } from 'react';
import type { Alarm } from '../types';
import { loadAlarms, saveAlarms } from '../storage';
import { createId } from '../utils';

function currentTimeParts(date: Date): { time: string; day: number } {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return { time: `${hh}:${mm}`, day: date.getDay() };
}

const SNOOZE_MINUTES = 5;

export function useAlarmClock() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => loadAlarms());
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);
  const lastFiredMinuteRef = useRef<string | null>(null);
  const snoozeUntilRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const { time, day } = currentTimeParts(now);
      const minuteKey = `${now.toDateString()} ${time}`;

      for (const [id, until] of snoozeUntilRef.current) {
        if (now.getTime() >= until) {
          snoozeUntilRef.current.delete(id);
          setActiveAlarmId(id);
          return;
        }
      }

      if (activeAlarmId || minuteKey === lastFiredMinuteRef.current) return;

      const due = alarms.find((a) => a.enabled && a.time === time && a.days[day]);
      if (due) {
        lastFiredMinuteRef.current = minuteKey;
        setActiveAlarmId(due.id);
      }
    };

    const interval = setInterval(tick, 5000);
    tick();
    return () => clearInterval(interval);
  }, [alarms, activeAlarmId]);

  const addAlarm = useCallback((partial: Omit<Alarm, 'id'>) => {
    setAlarms((prev) => [...prev, { ...partial, id: createId() }]);
  }, []);

  const updateAlarm = useCallback((id: string, patch: Partial<Alarm>) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  }, []);

  const dismissActiveAlarm = useCallback(() => {
    setActiveAlarmId(null);
  }, []);

  const snoozeActiveAlarm = useCallback(() => {
    if (!activeAlarmId) return;
    snoozeUntilRef.current.set(activeAlarmId, Date.now() + SNOOZE_MINUTES * 60_000);
    setActiveAlarmId(null);
  }, [activeAlarmId]);

  const activeAlarm = alarms.find((a) => a.id === activeAlarmId) ?? null;

  return {
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    activeAlarm,
    dismissActiveAlarm,
    snoozeActiveAlarm,
  };
}
