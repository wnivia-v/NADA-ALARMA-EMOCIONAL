import type { GratitudeEntry } from '../types';

interface Props {
  entries: GratitudeEntry[];
}

export function GratitudeJournal({ entries }: Props) {
  return (
    <section className="panel">
      <h2>Diario de gratitud</h2>
      <p className="hint">Cada vez que apagas la alarma escribiendo algo, queda registrado aquí.</p>
      {entries.length === 0 && <p className="empty">Todavía no hay entradas.</p>}
      <ul className="journal-list">
        {entries
          .slice()
          .reverse()
          .map((entry) => (
            <li key={entry.id}>
              <time>{new Date(entry.date).toLocaleString()}</time>
              <p>{entry.text}</p>
            </li>
          ))}
      </ul>
    </section>
  );
}
