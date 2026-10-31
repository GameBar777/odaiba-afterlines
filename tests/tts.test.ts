import { it, expect } from 'vitest';
import { speakText } from '../src/platform/tts';
import { defaultPrefs } from '../src/platform/save';
it('tts off by default, text prep', () => { expect(defaultPrefs.tts).toBe(false); expect(speakText([['湊', '「大丈夫……」'], ['', '海が光る。']])).toBe('湊。大丈夫、\n海が光る。'); });
