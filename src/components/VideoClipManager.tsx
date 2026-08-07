import { useState } from 'react';
import type { VideoClip } from '../types';
import { extractYouTubeId } from '../utils';

interface Props {
  clips: VideoClip[];
  onAdd: (clip: Omit<VideoClip, 'id'>) => void;
  onRemove: (id: string) => void;
}

export function VideoClipManager({ clips, onAdd, onRemove }: Props) {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const youtubeId = extractYouTubeId(url);
    if (!youtubeId) {
      setError('No reconozco ese link. Pega un link de YouTube o YouTube Music (youtube.com/watch?v=..., youtu.be/..., music.youtube.com/watch?v=...).');
      return;
    }
    onAdd({ url: url.trim(), label: label.trim() || 'Escena motivadora', youtubeId });
    setUrl('');
    setLabel('');
    setError('');
  };

  return (
    <section className="panel">
      <h2>Escenas de YouTube</h2>
      <p className="hint">
        Pega el link de la escena de película, video de YouTube Music, o cualquier clip que te dé
        energía. Se incrusta con el reproductor oficial de YouTube (nada se descarga ni se
        redistribuye). Aparece durante la alarma y en el reto del vigía anti-scroll.
      </p>
      <form className="affirmation-form" onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre (opcional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button type="submit" className="primary">Agregar</button>
      </form>
      {error && <p className="error-text">{error}</p>}

      <ul className="clip-list">
        {clips.length === 0 && <li className="empty">Todavía no agregaste ninguna escena.</li>}
        {clips.map((clip) => (
          <li key={clip.id} className="clip-item">
            <img
              src={`https://img.youtube.com/vi/${clip.youtubeId}/hqdefault.jpg`}
              alt={clip.label}
            />
            <span>{clip.label}</span>
            <button onClick={() => onRemove(clip.id)} className="danger small">Quitar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
