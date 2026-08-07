import { useMemo, useState } from 'react';
import { useAlarmClock } from './hooks/useAlarmClock';
import { useFocusWatchdog } from './hooks/useFocusWatchdog';
import { AlarmManager } from './components/AlarmManager';
import { MediaLibrary } from './components/MediaLibrary';
import { AffirmationManager } from './components/AffirmationManager';
import { GratitudeJournal } from './components/GratitudeJournal';
import { ActivationScreen } from './components/ActivationScreen';
import { FocusCheckIn } from './components/FocusCheckIn';
import { FocusSettingsPanel } from './components/FocusSettingsPanel';
import { VideoClipManager } from './components/VideoClipManager';
import { VoiceSettings } from './components/VoiceSettings';
import { MOVIE_QUOTES } from './data/movieQuotes';
import type { GratitudeEntry, MediaItem, VideoClip, VoiceLocale } from './types';
import {
  loadAffirmations,
  loadGratitude,
  loadIncludeMovieQuotes,
  loadVideoClips,
  loadVoiceLocale,
  saveAffirmations,
  saveGratitude,
  saveIncludeMovieQuotes,
  saveVideoClips,
  saveVoiceLocale,
} from './storage';
import { createId } from './utils';
import './App.css';

export default function App() {
  const {
    alarms,
    addAlarm,
    deleteAlarm,
    toggleAlarm,
    activeAlarm,
    dismissActiveAlarm,
    snoozeActiveAlarm,
  } = useAlarmClock();

  const {
    settings: focusSettings,
    updateSettings: updateFocusSettings,
    log: focusLog,
    pendingAwayMinutes,
    resolveCheckIn,
    simulateReturn,
  } = useFocusWatchdog();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [affirmations, setAffirmations] = useState<string[]>(() => loadAffirmations());
  const [gratitude, setGratitude] = useState<GratitudeEntry[]>(() => loadGratitude());
  const [includeMovieQuotes, setIncludeMovieQuotes] = useState<boolean>(() => loadIncludeMovieQuotes());
  const [videoClips, setVideoClips] = useState<VideoClip[]>(() => loadVideoClips());
  const [voiceLocale, setVoiceLocale] = useState<VoiceLocale>(() => loadVoiceLocale());

  const handleToggleMovieQuotes = (value: boolean) => {
    setIncludeMovieQuotes(value);
    saveIncludeMovieQuotes(value);
  };

  const handleChangeVoiceLocale = (locale: VoiceLocale) => {
    setVoiceLocale(locale);
    saveVoiceLocale(locale);
  };

  const handleAddVideoClip = (clip: Omit<VideoClip, 'id'>) => {
    setVideoClips((prev) => {
      const next = [...prev, { ...clip, id: createId() }];
      saveVideoClips(next);
      return next;
    });
  };

  const handleRemoveVideoClip = (id: string) => {
    setVideoClips((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveVideoClips(next);
      return next;
    });
  };

  const alarmAffirmations = useMemo(() => {
    if (!includeMovieQuotes) return affirmations;
    const movieTexts = MOVIE_QUOTES.map((q) => {
      const text = voiceLocale.startsWith('es') ? q.quoteEs : q.quote;
      return `"${text}" — ${q.character}, ${q.movie}`;
    });
    return [...affirmations, ...movieTexts];
  }, [affirmations, includeMovieQuotes, voiceLocale]);

  const handleAddAffirmation = (text: string) => {
    setAffirmations((prev) => {
      const next = [...prev, text];
      saveAffirmations(next);
      return next;
    });
  };

  const handleRemoveAffirmation = (index: number) => {
    setAffirmations((prev) => {
      const next = prev.filter((_, i) => i !== index);
      saveAffirmations(next);
      return next;
    });
  };

  const handleDismiss = (gratitudeText: string) => {
    setGratitude((prev) => {
      const next = [...prev, { id: createId(), text: gratitudeText, date: new Date().toISOString() }];
      saveGratitude(next);
      return next;
    });
    dismissActiveAlarm();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>NADA Alarma Emocional</h1>
        <p>Una alarma que te recuerda tu superpoder: ya tienes todo lo que necesitas.</p>
      </header>

      <main className="app-grid">
        <AlarmManager alarms={alarms} onAdd={addAlarm} onToggle={toggleAlarm} onDelete={deleteAlarm} />
        <AffirmationManager
          affirmations={affirmations}
          onAdd={handleAddAffirmation}
          onRemove={handleRemoveAffirmation}
          includeMovieQuotes={includeMovieQuotes}
          onToggleMovieQuotes={handleToggleMovieQuotes}
        />
        <VoiceSettings locale={voiceLocale} onChange={handleChangeVoiceLocale} />
        <VideoClipManager clips={videoClips} onAdd={handleAddVideoClip} onRemove={handleRemoveVideoClip} />
        <MediaLibrary
          media={media}
          onAdd={(items) => setMedia((prev) => [...prev, ...items])}
          onRemove={(id) => setMedia((prev) => prev.filter((m) => m.id !== id))}
        />
        <GratitudeJournal entries={gratitude} />
        <FocusSettingsPanel
          settings={focusSettings}
          onChangeSettings={updateFocusSettings}
          log={focusLog}
          onSimulate={simulateReturn}
        />
      </main>

      {activeAlarm && (
        <ActivationScreen
          alarm={activeAlarm}
          media={media}
          videoClips={videoClips}
          affirmations={alarmAffirmations}
          voiceLocale={voiceLocale}
          onDismiss={handleDismiss}
          onSnooze={snoozeActiveAlarm}
        />
      )}

      {!activeAlarm && pendingAwayMinutes !== null && (
        <FocusCheckIn
          awayMinutes={pendingAwayMinutes}
          videoClips={videoClips}
          voiceLocale={voiceLocale}
          onResolve={resolveCheckIn}
        />
      )}
    </div>
  );
}
