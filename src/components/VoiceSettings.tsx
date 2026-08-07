import type { VoiceLocale } from '../types';
import { VOICE_LOCALES } from '../services/speech';

interface Props {
  locale: VoiceLocale;
  onChange: (locale: VoiceLocale) => void;
}

export function VoiceSettings({ locale, onChange }: Props) {
  return (
    <section className="panel">
      <h2>Voz</h2>
      <p className="hint">
        Elige el idioma y acento con el que la app te lee las frases en voz alta. Usa las voces
        instaladas en tu navegador/dispositivo, así que la disponibilidad exacta puede variar.
      </p>
      <select value={locale} onChange={(e) => onChange(e.target.value as VoiceLocale)}>
        {VOICE_LOCALES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </section>
  );
}
