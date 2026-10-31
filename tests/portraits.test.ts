import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { portraitKey, portraitSrc, PORTRAIT_KEYS } from '../src/ui/portraits';
describe('portraits', () => {
  it('maps names', () => { expect(portraitKey('宮下 湊')).toBe('minato'); expect(portraitKey('祖母・ふみ')).toBe('fumi'); expect(portraitKey('千夏の母')).toBeNull(); expect(portraitKey('係員')).toBeNull(); });
  it('mood by chapter', () => { expect(portraitSrc('律', 2)).toMatch(/ritsu_worried/); expect(portraitSrc('律', 5)).toMatch(/ritsu_neutral/); });
  it('files exist', () => { for (const k of PORTRAIT_KEYS) for (const m of ['neutral', 'worried']) expect(existsSync(`public/portraits/${k}_${m}.webp`)).toBe(true); });
});
