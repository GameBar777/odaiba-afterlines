import { DB } from '../src/data';
import { writeFileSync } from 'node:fs';
const sc = Object.values(DB.scenes);
const used = { know: new Set<string>(), info: new Set<string>() };
for (const s of sc) { for (const e of [s.onEnter, ...(s.choices ?? []).map(c => c.effects)]) { const k = e?.know; for (const x of k === undefined ? [] : Array.isArray(k) ? k : [k]) used.know.add(x); } for (const l of s.lesson ?? []) used.know.add(l); for (const i of s.info ?? []) used.info.add(i); }
const c = {
  scenes: sc.length, choices: sc.reduce((a, s) => a + (s.choices?.length ?? 0), 0), npcs: DB.npcs.length, npcRules: DB.npcRules.length,
  knowledge: DB.knowledge.length, knowledgeReferencedByScenes: used.know.size, knowledgeNeedsReview: DB.knowledge.filter(k => k.status === '要監修').length,
  sources: DB.sources.length, info: DB.info.length, infoReferenced: used.info.size, endings: DB.endings.length, afterPieces: DB.after.length,
  locs: DB.locs.length, locsFictional: DB.locs.filter(l => !l.real).length, items: Object.keys(DB.items).length, injuries: Object.keys(DB.injuries).length, photos: Object.keys(DB.photos).length,
  dialogueLines: sc.reduce((a, s) => a + s.lines.length, 0),
};
console.log(c); writeFileSync('docs/counts.json', JSON.stringify(c, null, 2));
