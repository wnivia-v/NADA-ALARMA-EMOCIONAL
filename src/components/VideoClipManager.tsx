import { useState } from 'react';
import type { VideoClip } from '../types';
import { parseVideoUrl } from '../utils';

interface Props {
  clips: VideoClip[];
  onAdd: (clip: Omit<VideoClip, 'id'>) => void;
  onRemove: (id: string) => void;
}

export function VideoClipManager({ clips, onAdd, onRemove }: Props) {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseVideoUrl(url);
    if (!parsed) {
      setError(
        'No reconozco ese link. Pega un link completo de YouTube (youtube.com/watch?v=..., youtu.be/...) o TikTok (tiktok.com/@usuario/video/...). Los links cortos de TikTok (vt.tiktok.com) no funcionan, usa el link completo.',
      );
      return;
    }

    setSubmitting(true);
    let thumbnail: string | undefined;
    let finalLabel = label.trim();

    if (parsed.provider === 'youtube') {
      thumbnail = `https://img.youtube.com/vi/${parsed.externalId}/hqdefault.jpg`;
    } else {
      try {
        const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url.trim())}`);
        if (res.ok) {
          const data = await res.json();
          thumbnail = data.thumbnail_url;
          if (!finalLabel) finalLabel = data.title || '';
        }
      } catch {
        // Sin thumbnail/preview si TikTok no responde; el clip se agrega igual.
      }
    }

    onAdd({
      url: url.trim(),
      label: finalLabel || 'Escena motivadora',
      provider: parsed.provider,
      externalId: parsed.externalId,
      thumbnail,
    });
    setUrl('');
    setLabel('');
    setError('');
    setSubmitting(false);
  };

  return (
    <section className="panel">
      <h2>Escenas de YouTube y TikTok</h2>
      <p className="hint">
        Pega el link de la escena, video o clip que te dé energía. Se incrusta con el reproductor
        oficial de cada plataforma (nada se descarga ni se redistribuye). Aparece durante la
        alarma y en el reto del vigía anti-scroll.
      </p>
      <form className="affirmation-form" onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Link de YouTube o TikTok"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre (opcional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Agregando...' : 'Agregar'}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}

      <ul className="clip-list">
        {clips.length === 0 && <li className="empty">Todavía no agregaste ninguna escena.</li>}
        {clips.map((clip) => (
          <li key={clip.id} className="clip-item">
            {clip.thumbnail ? (
              <img src={clip.thumbnail} alt={clip.label} />
            ) : (
              <span className="clip-badge">{clip.provider === 'tiktok' ? 'TikTok' : 'YouTube'}</span>
            )}
            <span>{clip.label}</span>
            <button onClick={() => onRemove(clip.id)} className="danger small">Quitar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
