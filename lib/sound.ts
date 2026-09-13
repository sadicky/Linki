/**
 * Synthétiseur audio Web Audio API pour les notifications en direct (commandes entrantes)
 * Fonctionne sans dépendance à des fichiers audio externes mp3/wav.
 */
export function playOrderNotificationSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Première note (carillon)
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(587.33, now, 0.3); // Ré 5
    playTone(880.0, now + 0.15, 0.4); // La 5
    playTone(1174.66, now + 0.3, 0.6); // Ré 6 (ding vibrant)
  } catch {
    // Silently ignore if audio context is blocked by user gesture policy
  }
}
