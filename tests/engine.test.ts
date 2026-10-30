import { describe, it, expect } from 'vitest';
import { newGame, start, choose, proceed, visibleChoices, scene, resolveEnding, afterPieces } from '../src/engine/engine';
import { next } from '../src/engine/rng';
import { DB } from '../src/data';
import { play } from './play';
import type { PresetId } from '../src/engine/types';

const presets: PresetId[] = ['worker', 'student', 'parent'];
const settingsList = [{}, { time: 'night', prep: 'none' }, { time: 'holiday', prep: 'full', health: 'asthma' }];

describe('data integrity', () => {
  it('all scene links, knowledge, info, photos resolve', () => {
    const k = new Set(DB.knowledge.map(x => x.id)); const inf = new Set(DB.info.map(x => x.id)); const src = new Set(DB.sources.map(x => x.id));
    for (const sc of Object.values(DB.scenes)) {
      for (const c of sc.choices ?? []) expect(DB.scenes[c.next], `${sc.id}->${c.next}`).toBeTruthy();
      if (sc.next) expect(DB.scenes[sc.next], `${sc.id}->${sc.next}`).toBeTruthy();
      for (const a of sc.alt ?? []) expect(DB.scenes[a.goto]).toBeTruthy();
      for (const i of sc.info ?? []) expect(inf.has(i), i).toBe(true);
      for (const l of sc.lesson ?? []) expect(k.has(l), l).toBe(true);
      if (!sc.choices?.length && !sc.next && !sc.alt?.length) expect(sc.id).toBe('END');
    }
    for (const kk of DB.knowledge) for (const so of kk.sources) expect(src.has(so), so).toBe(true);
  });
  it('disclaimer-relevant: every fictional official info is labeled', () => {
    for (const i of DB.info.filter(i => i.source === 'official-fiction')) expect(i.from).toContain('ゲーム内架空情報');
  });
});

describe('random play', () => {
  const seen = new Set<string>();
  it('600 random games reach an ending without dead-ends, deterministic', () => {
    for (const p of presets) for (const st of settingsList) for (let i = 0; i < 67; i++) {
      const seed = 1000 + i * 7919; const a = play(p, seed, st); const b = play(p, seed, st);
      expect(a.ending.id).toBe(b.ending.id); expect(a.s.hp).toBe(b.s.hp);
      if (a.s.dead) { expect(a.ending.kind).toBe('death'); expect(a.s.history.some(h => h.scene === 'death')).toBe(true); expect(afterPieces(a.s).length).toBeGreaterThan(0); }
      seen.add(a.ending.id);
    }
    console.log('endings seen:', [...seen].sort().join(','));
    expect(seen.size).toBeGreaterThanOrEqual(5);
  });
});
