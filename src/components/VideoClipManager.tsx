import { useState } from 'react';
import type { VideoClip } from '../types';
import { isTikTokUrl, parseVideoUrl } from '../utils';

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
    const trimmedUrl = url.trim();
    const parsed = parseVideoUrl(trimmedUrl);
    setSubmitting(true);
    setError('');

    if (parsed) {
      const thumbnail =
        parsed.provider === 'youtube'
          ? `https://img.youtube.com/vi/${parsed.externalId}/hqdefault.jpg`
          : await fetchTikTokThumbnail(trimmedUrl);
      onAdd({
        url: trimmedUrl,
        label: label.trim() || 'Escena motivadora',
        provider: parsed.provider,
        externalId: parsed.externalId,
        thumbnail,
      });
      setUrl('');
      setLabel('');
      setSubmitting(false);
      return;
    }

    // Links cortos de TikTok (vm.tiktok.com, vt.tiktok.com) no traen el ID
    // en la URL — se resuelven pidiéndole a TikTok su oEmbed con el link
    // corto tal cual; su servidor sigue el redirect por nosotros.
    if (isTikTokUrl(trimmedUrl)) {
      try {
        const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(trimmedUrl)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.embed_product_id) {
            onAdd({
              url: trimmedUrl,
              label: label.trim() || data.title || 'Escena motivadora',
              provider: 'tiktok',
              externalId: data.embed_product_id,
              thumbnail: data.thumbnail_url,
            });
            setUrl('');
            setLabel('');
            setSubmitting(false);
            return;
          }
        }
        setError(
          'No pude resolver ese link corto de TikTok. Revisa tu conexión, o ábrelo en el navegador y pega la URL completa que te queda (tiktok.com/@usuario/video/...).',
        );
      } catch {
        setError(
          'No pude conectar con TikTok para resolver el link corto. Revisa tu conexión, o ábrelo en el navegador y pega la URL completa que te queda (tiktok.com/@usuario/video/...).',
        );
      }
      setSubmitting(false);
      return;
    }

    setError(
      'No reconozco ese link. Pega un link de YouTube (youtube.com/watch?v=..., youtu.be/...) o TikTok (tiktok.com/..., vm.tiktok.com/...).',
    );
    setSubmitting(false);
  };

  return (
    <section className="panel">
      <h2>Escenas de YouTube y TikTok</h2>
      <p className="hint">
        Pega el link de la escena, video o clip que te dé energía — sirven tanto los links largos
        como los cortos para compartir (vm.tiktok.com). Se incrusta con el reproductor oficial de
        cada plataforma (nada se descarga ni se redistribuye). Aparece durante la alarma y en el
        reto del vigía anti-scroll.
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

async function fetchTikTokThumbnail(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    return data.thumbnail_url;
  } catch {
    return undefined;
  }
}
