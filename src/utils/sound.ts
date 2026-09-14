class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playFlip() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Ignore audio failure
    }
  }

  playMatch() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Pleasant high arpeggio chord (E5 -> G#5 -> B5 -> E6)
      const notes = [659.25, 830.61, 987.77, 1318.51];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + index * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.06 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.06);
        osc.stop(ctx.currentTime + index * 0.06 + 0.3);
      });
    } catch {
      // Ignore audio failure
    }
  }

  playMismatch() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // Ignore audio failure
    }
  }

  playWin() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Victory fanfare
      const melody = [
        { freq: 523.25, time: 0, dur: 0.12 },     // C5
        { freq: 659.25, time: 0.12, dur: 0.12 },  // E5
        { freq: 783.99, time: 0.24, dur: 0.12 },  // G5
        { freq: 1046.50, time: 0.36, dur: 0.35 }, // C6
      ];

      melody.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0.18, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + dur + 0.05);
      });
    } catch {
      // Ignore audio failure
    }
  }
}

export const soundEffects = new SoundEffects();
