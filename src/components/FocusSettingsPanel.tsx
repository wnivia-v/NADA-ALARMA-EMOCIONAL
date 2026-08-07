import type { FocusLogEntry, FocusSettings } from '../types';
import { isAiAvailable } from '../services/groq';

interface Props {
  settings: FocusSettings;
  onChangeSettings: (patch: Partial<FocusSettings>) => void;
  log: FocusLogEntry[];
  onSimulate: () => void;
}

export function FocusSettingsPanel({ settings, onChangeSettings, log, onSimulate }: Props) {
  return (
    <section className="panel">
      <h2>Vigía anti-scroll</h2>
      <p className="hint">
        Una web no puede ver qué app usas fuera de ella. Lo que sí detecta: cuánto tiempo llevas
        fuera de <em>esta</em> pestaña/app. Si vuelves después de {settings.thresholdMinutes}+
        minutos, te pregunta si fue scroll en redes y te reta a convertir esa energía en una
        tarea. {isAiAvailable()
          ? 'El empujón lo genera IA (Groq, tier gratuito).'
          : 'Configura VITE_GROQ_API_KEY para que el empujón lo genere IA; por ahora usa solo frases de películas.'}
      </p>

      <label className="switch-row">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => onChangeSettings({ enabled: e.target.checked })}
        />
        Activar vigía
      </label>

      <label className="threshold-row">
        Avisar después de
        <input
          type="number"
          min={1}
          max={180}
          value={settings.thresholdMinutes}
          onChange={(e) =>
            onChangeSettings({ thresholdMinutes: Math.max(1, Number(e.target.value) || 1) })
          }
        />
        minutos fuera de la app
      </label>

      <button className="secondary" onClick={onSimulate}>
        Probar la pantalla ahora
      </button>

      <h3>Historial</h3>
      {log.length === 0 && <p className="empty">Todavía no hay registros.</p>}
      <ul className="journal-list">
        {log
          .slice()
          .reverse()
          .map((entry) => (
            <li key={entry.id}>
              <time>{new Date(entry.detectedAt).toLocaleString()}</time>
              <p>
                {entry.wasScrolling
                  ? `Scroll (${entry.awayMinutes} min) → ${entry.task}`
                  : `Fuera de la app ${entry.awayMinutes} min (no fue scroll)`}
              </p>
            </li>
          ))}
      </ul>
    </section>
  );
}
