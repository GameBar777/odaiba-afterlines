// Gentle WebAudio cues only. No jump-scares: quake rumble fades in over 1.2s, low volume, and is muted by default.
let ctx: AudioContext | null = null;
let vol = 0.5, muted = true;
export function setSound(v: number, m: boolean) { vol = v; muted = m; }
function ac() { if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); return ctx; }
export function cue(kind: 'tap' | 'rumble' | 'chime') {
  if (muted || vol <= 0) return;
  try {
    const a = ac(); const g = a.createGain(); g.connect(a.destination); const now = a.currentTime;
    if (kind === 'rumble') {
      const buf = a.createBuffer(1, a.sampleRate * 3, a.sampleRate); const d = buf.getChannelData(0); let last = 0;
      for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3; }
      const src = a.createBufferSource(); src.buffer = buf; const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 120;
      src.connect(f); f.connect(g); g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.35 * vol, now + 1.2); g.gain.linearRampToValueAtTime(0, now + 3); src.start();
    } else {
      const o = a.createOscillator(); o.type = 'sine'; o.frequency.value = kind === 'tap' ? 660 : 880; o.connect(g);
      g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.08 * vol, now + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'tap' ? 0.12 : 0.6)); o.start(); o.stop(now + 0.7);
    }
  } catch { /* audio unsupported */ }
}
