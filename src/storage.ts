import type { Alarm, FocusLogEntry, FocusSettings, GratitudeEntry } from './types';

const ALARMS_KEY = 'nada.alarms';
const AFFIRMATIONS_KEY = 'nada.affirmations';
const GRATITUDE_KEY = 'nada.gratitude';
const FOCUS_LOG_KEY = 'nada.focusLog';
const FOCUS_SETTINGS_KEY = 'nada.focusSettings';
const INCLUDE_MOVIES_KEY = 'nada.includeMovieQuotes';

export const DEFAULT_FOCUS_SETTINGS: FocusSettings = { enabled: true, thresholdMinutes: 15 };

export const DEFAULT_AFFIRMATIONS = [
  'Tengo todo lo que necesito para tener un gran día.',
  'No tengo por qué quejarme, estoy mejor que muchas personas en este momento.',
  'Cada mañana es una oportunidad que no todos tienen.',
  'Mi energía de hoy es un regalo, voy a usarla bien.',
  'Estoy sano, estoy aquí, y eso ya es suficiente para levantarme con ganas.',
];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadAlarms(): Alarm[] {
  return readJSON<Alarm[]>(ALARMS_KEY, []);
}

export function saveAlarms(alarms: Alarm[]): void {
  writeJSON(ALARMS_KEY, alarms);
}

export function loadAffirmations(): string[] {
  return readJSON<string[]>(AFFIRMATIONS_KEY, DEFAULT_AFFIRMATIONS);
}

export function saveAffirmations(affirmations: string[]): void {
  writeJSON(AFFIRMATIONS_KEY, affirmations);
}

export function loadGratitude(): GratitudeEntry[] {
  return readJSON<GratitudeEntry[]>(GRATITUDE_KEY, []);
}

export function saveGratitude(entries: GratitudeEntry[]): void {
  writeJSON(GRATITUDE_KEY, entries);
}

export function loadFocusLog(): FocusLogEntry[] {
  return readJSON<FocusLogEntry[]>(FOCUS_LOG_KEY, []);
}

export function saveFocusLog(entries: FocusLogEntry[]): void {
  writeJSON(FOCUS_LOG_KEY, entries);
}

export function loadFocusSettings(): FocusSettings {
  return readJSON<FocusSettings>(FOCUS_SETTINGS_KEY, DEFAULT_FOCUS_SETTINGS);
}

export function saveFocusSettings(settings: FocusSettings): void {
  writeJSON(FOCUS_SETTINGS_KEY, settings);
}

export function loadIncludeMovieQuotes(): boolean {
  return readJSON<boolean>(INCLUDE_MOVIES_KEY, true);
}

export function saveIncludeMovieQuotes(value: boolean): void {
  writeJSON(INCLUDE_MOVIES_KEY, value);
}
