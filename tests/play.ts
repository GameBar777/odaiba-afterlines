import { newGame, start, choose, proceed, visibleChoices, scene, resolveEnding } from '../src/engine/engine';
import { next } from '../src/engine/rng';
import type { PresetId } from '../src/engine/types';
export function play(preset: PresetId, seed: number, settings: Record<string, string> = {}) {
  const s = newGame(preset, settings, seed); start(s); let r = seed; let steps = 0;
  while (s.scene !== 'END') {
    if (++steps > 400) throw new Error('too long at ' + s.scene);
    const cs = visibleChoices(s);
    if (cs.length) { const [x, n] = next(r); r = n; choose(s, cs[Math.floor(x * cs.length)].id); }
    else { if (!scene(s).next) throw new Error('dead end at ' + s.scene); proceed(s); }
  }
  return { s, ending: resolveEnding(s) };
}
