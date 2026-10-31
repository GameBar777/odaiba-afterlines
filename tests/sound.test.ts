import { describe, it, expect } from 'vitest';
import { moodFor, MOODS } from '../src/platform/sound';
import { defaultPrefs } from '../src/platform/save';
describe('bgm', () => {
  it('4 tracks, muted by default', () => { expect(Object.keys(MOODS).length).toBe(4); expect(defaultPrefs.muted).toBe(true); });
  it('mood by chapter/time', () => {
    expect(moodFor(0, false, false)).toBe('daily'); expect(moodFor(1, false, true)).toBe('unease');
    expect(moodFor(2, true, true)).toBe('night'); expect(moodFor(5, false, true)).toBe('rebuild');
  });
});
