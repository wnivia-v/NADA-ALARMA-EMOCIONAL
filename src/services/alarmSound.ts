// Sirena de alarma sintetizada con Web Audio API (no es un archivo de audio
// externo, no hay nada que licenciar). Los navegadores bloquean el audio
// que arranca sin gesto del usuario, así que `primeAudio()` se llama desde
// cualquier click dentro de la app (ver App.tsx) para "desbloquear" el
// AudioContext antes de que la alarma realmente necesite sonar.

let audioContext: AudioContext | null = null;
let activeNodes: { stop: () => void } | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  return audioContext;
}

export function primeAudio(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

export function startAlarmSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  stopAlarmSound();

  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);

  let beeping = true;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const beep = () => {
    if (!beeping) return;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 880;
    osc.connect(gain);

    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.4);

    timeoutId = setTimeout(beep, 600);
  };

  beep();

  activeNodes = {
    stop: () => {
      beeping = false;
      if (timeoutId) clearTimeout(timeoutId);
      gain.disconnect();
    },
  };
}

export function stopAlarmSound(): void {
  if (activeNodes) {
    activeNodes.stop();
    activeNodes = null;
  }
}

export function vibrate(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Vibration API no disponible (ej. iOS Safari) — se ignora.
  }
}

export function stopVibration(): void {
  try {
    navigator.vibrate?.(0);
  } catch {
    // ignore
  }
}
