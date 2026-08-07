import { useState } from 'react';
import { randomMovieQuote } from '../data/movieQuotes';
import { generatePepTalk, isAiAvailable } from '../services/groq';

interface Props {
  awayMinutes: number;
  onResolve: (wasScrolling: boolean, task: string) => void;
}

export function FocusCheckIn({ awayMinutes, onResolve }: Props) {
  const [stage, setStage] = useState<'ask' | 'challenge'>('ask');
  const [task, setTask] = useState('');
  const [pepTalk, setPepTalk] = useState<string | null>(null);
  const [pepTalkLoading, setPepTalkLoading] = useState(false);
  const [quote] = useState(() => randomMovieQuote());

  const startChallenge = () => {
    setStage('challenge');
    if (!isAiAvailable()) return;
    setPepTalkLoading(true);
    generatePepTalk(awayMinutes, '').then((text) => {
      setPepTalk(text);
      setPepTalkLoading(false);
    });
  };

  const handleConfirmTask = () => {
    if (!task.trim()) return;
    onResolve(true, task.trim());
  };

  return (
    <div className="activation-screen">
      <div className="activation-overlay">
        {stage === 'ask' && (
          <>
            <p className="activation-time">{awayMinutes} min</p>
            <h1>¿Estuviste en redes sociales?</h1>
            <p className="activation-affirmation">
              Llevas {awayMinutes} minutos fuera de la app. Si fue scroll en TikTok, Instagram o
              algo así, vamos a convertir esa energía en algo productivo.
            </p>
            <div className="activation-actions">
              <button className="secondary" onClick={() => onResolve(false, '')}>
                No, estaba en otra cosa
              </button>
              <button className="primary" onClick={startChallenge}>
                Sí, fue scroll
              </button>
            </div>
          </>
        )}

        {stage === 'challenge' && (
          <>
            <p className="movie-attribution">
              {quote.movie} — {quote.character}
            </p>
            <p className="activation-affirmation">&ldquo;{quote.quote}&rdquo;</p>
            {pepTalkLoading && <p className="hint">Preparando tu empujón personalizado...</p>}
            {pepTalk && <p className="pep-talk">{pepTalk}</p>}

            <div className="gratitude-challenge">
              <label htmlFor="focus-task">
                ¿Qué vas a hacer ahora en vez de seguir con el scroll?
              </label>
              <textarea
                id="focus-task"
                rows={2}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Ej: terminar el informe, estudiar 25 minutos..."
                autoFocus
              />
            </div>

            <div className="activation-actions">
              <button className="primary" onClick={handleConfirmTask} disabled={!task.trim()}>
                Voy con todo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
