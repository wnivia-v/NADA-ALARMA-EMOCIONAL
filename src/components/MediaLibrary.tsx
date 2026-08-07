import { useRef } from 'react';
import type { MediaItem } from '../types';

interface Props {
  media: MediaItem[];
  onAdd: (items: MediaItem[]) => void;
  onRemove: (id: string) => void;
}

export function MediaLibrary({ media, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const items: MediaItem[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: file.type.startsWith('video') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    onAdd(items);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <section className="panel">
      <h2>Fotos y videos que te suben el ánimo</h2>
      <p className="hint">
        Se guardan solo en esta sesión del navegador (no se suben a ningún servidor).
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
      />
      <ul className="media-grid">
        {media.map((item) => (
          <li key={item.id} className="media-item">
            {item.type === 'image' ? (
              <img src={item.url} alt={item.name} />
            ) : (
              <video src={item.url} muted loop autoPlay playsInline />
            )}
            <button onClick={() => onRemove(item.id)} className="danger small">Quitar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
