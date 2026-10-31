import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { artKeys } from '../src/ui/art';
import { bgFile, BG_FILES, todOf } from '../src/ui/bg';
describe('backgrounds', () => {
  it('every art key resolves to an existing webp for all times of day', () => {
    for (const k of artKeys) for (const t of ['day', 'eve', 'night', 'late'] as const) {
      const f = bgFile(k, t); expect(f, k).toBeTruthy(); expect(existsSync(`public/bg/${f}.webp`), `${k}/${t}`).toBe(true);
    }
  });
  it('all listed files exist (47)', () => { expect(BG_FILES.length).toBe(47); for (const f of BG_FILES) expect(existsSync(`public/bg/${f}.webp`), f).toBe(true); });
  it('time of day', () => { expect(todOf(10 * 60)).toBe('day'); expect(todOf(17 * 60)).toBe('eve'); expect(todOf(20 * 60)).toBe('night'); expect(todOf(2 * 60)).toBe('late'); });
});
