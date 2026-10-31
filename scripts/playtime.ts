// プレイ時間の推定。ランダム選択で各プリセットN回プレイし、表示された本文・選択肢・結果文・情報投稿・章末知識の文字数を数える。
// 読書速度: 日本語 450字/分（400〜500字/分の中央）。選択1回あたり思考時間 10秒、シーン送り1回 1.5秒、章末の学び画面は本文を読む前提。
// 注意: ランダム選択は早死にルートも含むため、「生存ルート平均」も別に出す。実際のプレイヤーは寄り道・図鑑閲覧でさらに長くなる。
import { newGame, start, choose, proceed, visibleChoices, scene } from '../src/engine/engine';
import { next } from '../src/engine/rng';
import { DB } from '../src/data';
const CPM = 450, CHOICE_SEC = 10, ADV_SEC = 1.5, N = Number(process.env.N || 1500);
const vars = (p: string, t: string) => t.replace(/\{(\w+)\}/g, (_, k) => (DB.presets as any)[p].vars[k] ?? k);
const out: Record<string, any> = {};
for (const p of ['worker', 'student', 'parent'] as const) {
  let all = 0, surv = 0, nsurv = 0, maxM = 0; const perCh: Record<number, number> = {}; const reach: Record<number, number> = {};
  for (let i = 1; i <= N; i++) {
    const s = newGame(p, {}, i * 104729); start(s); let r = i * 104729; let chars = 0, sec = 0; let guard = 0; const seen = new Set<number>();
    while (s.scene !== 'END') {
      if (++guard > 500) break;
      const sc = scene(s); let c = 0;
      for (const [, t] of sc.lines) c += vars(p, t).length;
      for (const id of sc.info || []) { const x = (DB.info as any[]).find(y => y.id === id); if (x) c += x.text.length; }
      if (sc.chapterEnd) for (const k of sc.lesson || []) { const x = DB.knowledge.find(y => y.id === k); if (x) c += x.body.length + x.title.length; }
      const cs = visibleChoices(s);
      if (cs.length) {
        for (const x of cs) c += x.label.length;
        const [u, m] = next(r); r = m; const ch = cs[Math.floor(u * cs.length)];
        if (ch.result) c += vars(p, ch.result).length;
        sec += CHOICE_SEC; choose(s, ch.id);
      } else { sec += ADV_SEC; proceed(s); }
      seen.add(sc.chapter); chars += c; perCh[sc.chapter] = (perCh[sc.chapter] || 0) + c;
    }
    for (const k of seen) reach[k] = (reach[k] || 0) + 1;
    const min = chars / CPM + sec / 60; all += min; if (!(s as any).dead) { surv += min; nsurv++; } maxM = Math.max(maxM, min);
  }
  out[p] = { avgMin: +(all / N).toFixed(1), survivorAvgMin: +(surv / Math.max(1, nsurv)).toFixed(1), maxMin: +maxM.toFixed(1),
    charsPerChapterAvg: Object.fromEntries(Object.entries(perCh).map(([k, v]) => [k, Math.round(v / N)])),
    charsPerChapterReached: Object.fromEntries(Object.entries(perCh).map(([k, v]) => [k, Math.round(v / (reach[+k] || 1))])) };
}
console.log(JSON.stringify(out, null, 1));
