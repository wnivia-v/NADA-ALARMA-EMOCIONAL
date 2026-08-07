import { useEffect, useMemo, useRef, useState } from 'react';
import type { Alarm, MediaItem } from '../types';

interface Props {
  alarm: Alarm;
  media: MediaItem[];
  affirmations: string[];
  onDismiss: (gratitudeText: string) => void;
  onSnooze: () => void;
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export function ActivationScreen({ alarm, media, affirmations, onDismiss, onSnooze }: Props) {
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [gratitudeText, setGratitudeText] = useState('');
  const spokenIndexRef = useRef(-1);

  const backgroundMedia = useMemo(() => {
    if (media.length === 0) return null;
    return media[Math.floor(Math.random() * media.length)];
  }, [media]);

  const currentAffirmation = affirmations[affirmationIndex % affirmations.length] ??
    'Hoy tienes todo lo que necesitas para levantarte con energía.';

  useEffect(() => {
    if (affirmations.length === 0) return;
    if (spokenIndexRef.current !== affirmationIndex) {
      spokenIndexRef.current = affirmationIndex;
      speak(currentAffirmation);
    }
    const rotate = setInterval(() => {
      setAffirmationIndex((i) => (i + 1) % Math.max(affirmations.length, 1));
    }, 8000);
    return () => clearInterval(rotate);
  }, [affirmationIndex, affirmations, currentAffirmation]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const canDismiss = gratitudeText.trim().length > 0;

  const handleDismiss = () => {
    if (!canDismiss) return;
    window.speechSynthesis?.cancel();
    onDismiss(gratitudeText.trim());
  };

  return (
    <div className="activation-screen">
      {backgroundMedia && backgroundMedia.type === 'image' && (
        <img className="activation-media" src={backgroundMedia.url} alt="" />
      )}
      {backgroundMedia && backgroundMedia.type === 'video' && (
        <video className="activation-media" src={backgroundMedia.url} autoPlay muted loop playsInline />
      )}
      <div className="activation-overlay">
        <p className="activation-time">{alarm.time}</p>
        <h1>{alarm.label}</h1>
        <p className="activation-affirmation">{currentAffirmation}</p>

        <div className="gratitude-challenge">
          <label htmlFor="gratitude-input">
            Para apagar la alarma, escribe algo por lo que hoy estás agradecido:
          </label>
          <textarea
            id="gratitude-input"
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
            placeholder="Hoy estoy agradecido por..."
            rows={3}
            autoFocus
          />
        </div>

        <div className="activation-actions">
          <button onClick={onSnooze} className="secondary">Posponer 5 min</button>
          <button onClick={handleDismiss} className="primary" disabled={!canDismiss}>
            Estoy listo, apagar
          </button>
        </div>
      </div>
    </div>
  );
}
