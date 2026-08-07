import { useState } from 'react';

interface Props {
  affirmations: string[];
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
  includeMovieQuotes: boolean;
  onToggleMovieQuotes: (value: boolean) => void;
}

export function AffirmationManager({
  affirmations,
  onAdd,
  onRemove,
  includeMovieQuotes,
  onToggleMovieQuotes,
}: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <section className="panel">
      <h2>Frases que la IA te va a decir</h2>
      <p className="hint">
        Ejemplo del "superpoder": recordarte que ya tienes todo lo que necesitas y que no hay
        razón para quejarte.
      </p>
      <form className="affirmation-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribe una frase motivacional nueva"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="primary">Agregar</button>
      </form>
      <label className="switch-row">
        <input
          type="checkbox"
          checked={includeMovieQuotes}
          onChange={(e) => onToggleMovieQuotes(e.target.checked)}
        />
        Incluir frases de películas (Rocky, The Pursuit of Happyness, Gladiator...)
      </label>
      <ul className="affirmation-list">
        {affirmations.map((a, i) => (
          <li key={i}>
            <span>{a}</span>
            <button onClick={() => onRemove(i)} className="danger small">Quitar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
