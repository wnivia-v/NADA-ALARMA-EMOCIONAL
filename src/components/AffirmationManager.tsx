import { useState } from 'react';

interface Props {
  affirmations: string[];
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
}

export function AffirmationManager({ affirmations, onAdd, onRemove }: Props) {
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
