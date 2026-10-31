// Gentle WebAudio cues only. No jump-scares: quake rumble fades in over 1.2s, low volume, and is muted by default.
let ctx: AudioContext | null = null;
let vol = 0.5, muted = true;
export function setSound(v: number, m: boolean) { vol = v; muted = m; if (m) stopBgm(0.5); else if (cur) cur.gain.gain.value = 0.05 * v; }
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

// ---- BGM: 自作のWebAudio合成（音源ファイルなし）。4曲・2秒クロスフェード。警報音やサイレンに似た音は使わない。
export type Mood = 'daily' | 'unease' | 'night' | 'rebuild';
export const MOODS: Record<Mood, { name: string; root: number; scale: number[]; step: number; wave: OscillatorType; pad: number[] }> = {
  daily: { name: '日常', root: 60, scale: [0, 2, 4, 7, 9, 12], step: 0.5, wave: 'triangle', pad: [0, 4, 7] },
  unease: { name: '不安', root: 57, scale: [0, 3, 5, 7, 10], step: 0.9, wave: 'sine', pad: [0, 3, 7] },
  night: { name: '夜', root: 53, scale: [0, 3, 7, 10, 14], step: 1.2, wave: 'sine', pad: [0, 7, 15] },
  rebuild: { name: '再建', root: 62, scale: [0, 2, 4, 7, 9, 11, 14], step: 0.6, wave: 'triangle', pad: [0, 4, 9] },
};
export function moodFor(chapter: number, night: boolean, quakeHappened: boolean): Mood {
  if (chapter >= 4) return night ? 'night' : 'rebuild';
  if (night) return 'night';
  return quakeHappened && chapter >= 1 ? 'unease' : 'daily';
}
let bgmOn = true, cur: { mood: Mood; gain: GainNode; timer: number; pads: OscillatorNode[] } | null = null;
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
export function setBgm(on: boolean) { bgmOn = on; if (!on || muted) stopBgm(); }
export function stopBgm(fade = 1.5) {
  if (!cur || !ctx) return; const c = cur; cur = null; const now = ctx.currentTime;
  c.gain.gain.cancelScheduledValues(now); c.gain.gain.setValueAtTime(c.gain.gain.value, now); c.gain.gain.linearRampToValueAtTime(0, now + fade);
  clearInterval(c.timer); setTimeout(() => c.pads.forEach(p => { try { p.stop(); } catch { /* */ } }), fade * 1000 + 100);
}
export function playBgm(mood: Mood) {
  if (muted || !bgmOn || vol <= 0) { stopBgm(); return; }
  if (cur?.mood === mood) return;
  try {
    const a = ac(); if (a.state === 'suspended') void a.resume();
    stopBgm(2); const M = MOODS[mood]; const g = a.createGain(); g.connect(a.destination); const now = a.currentTime;
    g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.05 * vol, now + 2);
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.connect(g);
    const pads = M.pad.map(iv => { const o = a.createOscillator(); o.type = 'sine'; o.frequency.value = hz(M.root - 12 + iv); const pg = a.createGain(); pg.gain.value = 0.25; o.connect(pg); pg.connect(lp); o.start(); return o; });
    let i = 0; const seq = [0, 2, 1, 3, 2, 4, 1, 0];
    const timer = window.setInterval(() => {
      if (!ctx) return; const t = ctx.currentTime; const n = M.scale[seq[i++ % seq.length] % M.scale.length];
      if (i % 5 === 0) return; // 間（休符）
      const o = ctx.createOscillator(); o.type = M.wave; o.frequency.value = hz(M.root + n); const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.0001, t); ng.gain.exponentialRampToValueAtTime(0.35, t + 0.05); ng.gain.exponentialRampToValueAtTime(0.0001, t + M.step * 1.8);
      o.connect(ng); ng.connect(lp); o.start(t); o.stop(t + M.step * 2);
    }, M.step * 1000);
    cur = { mood, gain: g, timer, pads };
  } catch { /* audio unsupported */ }
}
export function currentMood(): Mood | null { return cur?.mood ?? null; }
