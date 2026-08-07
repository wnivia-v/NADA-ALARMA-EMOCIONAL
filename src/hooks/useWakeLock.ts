import { useEffect, useRef } from 'react';

/**
 * Pide al navegador que no apague la pantalla mientras `active` sea true
 * (por ejemplo, mientras hay al menos una alarma activada). Solo funciona
 * mientras la pestaña está en primer plano; si el usuario bloquea el
 * teléfono manualmente, el wake lock se libera (limitación del navegador,
 * no de esta app — ver README).
 */
export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;

    let cancelled = false;

    const requestLock = async () => {
      try {
        const lock = await navigator.wakeLock.request('screen');
        if (cancelled) {
          lock.release().catch(() => {});
          return;
        }
        lockRef.current = lock;
      } catch {
        // El navegador puede rechazar el wake lock (pestaña oculta, batería
        // baja, etc.) — no es un error fatal, simplemente no se logra.
      }
    };

    requestLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !lockRef.current) {
        requestLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      lockRef.current?.release().catch(() => {});
      lockRef.current = null;
    };
  }, [active]);
}
