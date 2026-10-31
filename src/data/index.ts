import type { Scene } from '../engine/types';
import { presets, items, injuries, hazardInjury, reportCats, npcs, npcRules, locs, edges } from './base';
import { knowledge } from './knowledge';
import { sources } from './sources';
import { ch0, ch1, ch2 } from './scenes1';
import { ch3, ch4, ch5 } from './scenes2';
import { ch4z } from './scenes4z';
import { ch5z } from './scenes5z';
import { ch3z } from './scenes3z';
import { ch0x, ch1x, ch2x } from './scenes0x';
import { ch3x, ch3y, ch4x, ch5x } from './scenes3';
import { info, photos, endings, after } from './misc';
const scenes: Record<string, Scene> = {};
for (const sc of [...ch0, ...ch0x, ...ch1, ...ch1x, ...ch2, ...ch2x, ...ch3, ...ch3x, ...ch3y, ...ch3z, ...ch4, ...ch4x, ...ch4z, ...ch5, ...ch5x, ...ch5z]) { if (scenes[sc.id]) throw new Error('dup scene ' + sc.id); scenes[sc.id] = sc; }
export const DB = { presets, items, injuries, hazardInjury, reportCats, npcs, npcRules, locs, edges, knowledge, sources, info, photos, endings, after, scenes, start: 'c0_open' };
