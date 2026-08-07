import type { VoiceLocale } from '../types';

export const VOICE_LOCALES: { value: VoiceLocale; label: string }[] = [
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'es-419', label: 'Español (Latinoamérica)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'en-US', label: 'English (US)' },
];

export function speak(text: string, locale: VoiceLocale) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}
