// 3プリセット×4000回のランダムプレイで、エンディング分布・死亡数・未到達シーン・未取得知識を集計する。
import { newGame, start, choose, proceed, visibleChoices, scene, resolveEnding } from '../src/engine/engine';
import { next } from '../src/engine/rng';
import { DB } from '../src/data';
const seen = new Set<string>(); const ends: Record<string, number> = {}; let dead = 0; const kn = new Set<string>();
for (const p of ['worker', 'student', 'parent'] as const) for (let i = 1; i <= 4000; i++) {
  const s = newGame(p, {}, i * 7919); start(s); let r = i * 7919; let n = 0;
  while (s.scene !== 'END') {
    seen.add(s.scene); if (++n > 400) throw new Error('loop ' + s.scene);
    const cs = visibleChoices(s);
    if (cs.length) { const [x, m] = next(r); r = m; choose(s, cs[Math.floor(x * cs.length)].id); } else proceed(s);
  }
  const e = resolveEnding(s); ends[e.id] = (ends[e.id] || 0) + 1; if ((s as any).dead) dead++; for (const k of s.know) kn.add(k);
}
console.log(ends, 'dead', dead);
console.log('unvisited(router含む)', Object.keys(DB.scenes).filter(x => !seen.has(x)));
console.log('unknown', DB.knowledge.map(x => x.id).filter(x => !kn.has(x)));
