import { useEffect, useMemo, useRef, useState } from 'react';
import type { Alarm, MediaItem, VideoClip, VoiceLocale } from '../types';
import { speak } from '../services/speech';
import { startAlarmSound, stopAlarmSound, stopVibration, vibrate } from '../services/alarmSound';
import { MediaClipEmbed } from './MediaClipEmbed';

interface Props {
  alarm: Alarm;
  media: MediaItem[];
  videoClips: VideoClip[];
  affirmations: string[];
  voiceLocale: VoiceLocale;
  onDismiss: (gratitudeText: string) => void;
  onSnooze: () => void;
}

export function ActivationScreen({
  alarm,
  media,
  videoClips,
  affirmations,
  voiceLocale,
  onDismiss,
  onSnooze,
}: Props) {
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [gratitudeText, setGratitudeText] = useState('');
  const spokenIndexRef = useRef(-1);

  const backgroundMedia = useMemo(() => {
    if (media.length === 0) return null;
    return media[Math.floor(Math.random() * media.length)];
  }, [media]);

  const videoClip = useMemo(() => {
    if (videoClips.length === 0) return null;
    return videoClips[Math.floor(Math.random() * videoClips.length)];
  }, [videoClips]);

  const currentAffirmation = affirmations[affirmationIndex % affirmations.length] ??
    'Hoy tienes todo lo que necesitas para levantarte con energía.';

  useEffect(() => {
    if (affirmations.length === 0) return;
    if (spokenIndexRef.current !== affirmationIndex) {
      spokenIndexRef.current = affirmationIndex;
      speak(currentAffirmation, voiceLocale);
    }
    const rotate = setInterval(() => {
      setAffirmationIndex((i) => (i + 1) % Math.max(affirmations.length, 1));
    }, 8000);
    return () => clearInterval(rotate);
  }, [affirmationIndex, affirmations, currentAffirmation, voiceLocale]);

  useEffect(() => {
    startAlarmSound();
    vibrate([500, 300, 500, 300, 500]);
    return () => {
      window.speechSynthesis?.cancel();
      stopAlarmSound();
      stopVibration();
    };
  }, []);

  const canDismiss = gratitudeText.trim().length > 0;

  const handleDismiss = () => {
    if (!canDismiss) return;
    window.speechSynthesis?.cancel();
    stopAlarmSound();
    stopVibration();
    onDismiss(gratitudeText.trim());
  };

  const handleSnooze = () => {
    window.speechSynthesis?.cancel();
    stopAlarmSound();
    stopVibration();
    onSnooze();
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

        {videoClip && <MediaClipEmbed clip={videoClip} />}

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
          <button onClick={handleSnooze} className="secondary">Posponer 5 min</button>
          <button onClick={handleDismiss} className="primary" disabled={!canDismiss}>
            Estoy listo, apagar
          </button>
        </div>
      </div>
    </div>
  );
}
