import type { Cond, Effect, State, Scene, PresetId, Ending, HazardKind } from './types';
import { next } from './rng';
import { DB } from '../data';

export const SAVE_VERSION = 1;
const arr = <T,>(x: T | T[] | undefined): T[] => (x === undefined ? [] : Array.isArray(x) ? x : [x]);
const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

export interface Feedback { kind: 'good' | 'bad' | 'info' | 'warn'; text: string }

export function quakeClock(s: State): number { // minutes of day when quake hits
  const k = s.settings.time as string;
  return k === 'night' ? 19 * 60 + 40 : k === 'holiday' ? 13 * 60 + 5 : 15 * 60 + 12;
}
export function clockLabel(s: State, t = s.t): string {
  const m = quakeClock(s) + t; const day = Math.floor(m / 1440); const mm = ((m % 1440) + 1440) % 1440;
  const hh = String(Math.floor(mm / 60)).padStart(2, '0'); const mi = String(mm % 60).padStart(2, '0');
  return (day > 0 ? `${day}日後 ` : '') + `${hh}:${mi}`;
}
export function isNight(s: State): boolean { const mm = (((quakeClock(s) + s.t) % 1440) + 1440) % 1440; return mm >= 18 * 60 + 30 || mm < 5 * 60 + 30; }

export function newGame(preset: PresetId, settings: Record<string, string | boolean> = {}, seed = 20261031): State {
  const p = DB.presets[preset];
  const st: Record<string, string | boolean> = { time: 'day', prep: 'some', health: 'normal', ...settings };
  const s: State = {
    v: SAVE_VERSION, seed, rng: seed, preset, name: (settings.name as string) || p.me, settings: st,
    scene: DB.start, chapter: 0, t: -300,
    hp: 100, stamina: st.health === 'asthma' ? 80 : 100, water: 80, mental: 70, battery: st.prep === 'full' ? 85 : st.prep === 'none' ? 35 : 60,
    injuries: [], items: [...p.items], flags: [`preset_${preset}`, `time_${st.time}`, `health_${st.health}`, `prep_${st.prep}`], know: [], photos: [], info: [],
    loc: p.startLoc, route: [p.startLoc], npcs: {}, msgs: [], helped: [], report: [], history: [], timeline: [],
  };
  if (st.prep === 'full') s.items.push('battery_pack', 'whistle', 'water_bottle', 'mask', 'light', 'snack', 'cash');
  if (st.prep === 'some') s.items.push('water_bottle', 'cash');
  if (st.health === 'asthma') s.items.push('inhaler');
  for (const n of DB.npcs) if (!n.preset || n.preset.includes(preset)) s.npcs[n.id] = { alive: true, loc: n.startLoc, trust: 50, hp: 100, injured: false, flags: [] };
  return s;
}

export function check(c: Cond | undefined, s: State): boolean {
  if (!c) return true;
  if (c.flag && !arr(c.flag).every(f => s.flags.includes(f))) return false;
  if (c.anyFlag && !c.anyFlag.some(f => s.flags.includes(f))) return false;
  if (c.notFlag && arr(c.notFlag).some(f => s.flags.includes(f))) return false;
  if (c.item && !s.items.includes(c.item)) return false;
  if (c.noItem && s.items.includes(c.noItem)) return false;
  if (c.preset && !arr(c.preset).includes(s.preset)) return false;
  if (c.minHp !== undefined && s.hp < c.minHp) return false;
  if (c.maxHp !== undefined && s.hp > c.maxHp) return false;
  if (c.minBattery !== undefined && s.battery < c.minBattery) return false;
  if (c.maxBattery !== undefined && s.battery > c.maxBattery) return false;
  if (c.npcAlive && !s.npcs[c.npcAlive]?.alive) return false;
  if (c.npcDead && s.npcs[c.npcDead]?.alive !== false) return false;
  if (c.npcAt && s.npcs[c.npcAt[0]]?.loc !== c.npcAt[1]) return false;
  if (c.npcNotAt && s.npcs[c.npcNotAt[0]]?.loc === c.npcNotAt[1]) return false;
  if (c.minTrust && (s.npcs[c.minTrust[0]]?.trust ?? 0) < c.minTrust[1]) return false;
  if (c.loc && s.loc !== c.loc) return false;
  if (c.tMin !== undefined && s.t < c.tMin) return false;
  if (c.tMax !== undefined && s.t > c.tMax) return false;
  if (c.dead !== undefined && !!s.dead !== c.dead) return false;
  if (c.setting && s.settings[c.setting[0]] !== c.setting[1]) return false;
  return true;
}

function roll(s: State): number { const [r, n] = next(s.rng); s.rng = n; return r; }

/** Hazard damage is causal: base level × modifiers derived from state (shoes, head protection, stamina, night, injuries, knowledge). */
export function hazardMultiplier(s: State, kind: HazardKind): { m: number; why: string[] } {
  let m = 1; const why: string[] = [];
  const has = (i: string) => s.items.includes(i); const f = (x: string) => s.flags.includes(x);
  if ((kind === 'glass' || kind === 'liquefaction' || kind === 'collapse') && !has('sneakers')) { m *= 1.4; why.push('歩きやすい靴がない'); }
  if ((kind === 'fall' || kind === 'collapse' || kind === 'glass') && f('head_protected')) { m *= 0.5; why.push('頭を守っていた'); }
  if (kind === 'fire' && has('mask')) { m *= 0.8; why.push('口元を覆えた'); }
  if ((kind === 'exhaustion' || kind === 'liquefaction' || kind === 'traffic' || kind === 'water') && isNight(s)) { m *= has('light') || s.battery > 10 ? 1.15 : 1.6; why.push(has('light') ? '夜間（ライトあり）' : '夜間で足元が見えない'); }
  if (s.stamina < 25) { m *= 1.4; why.push('疲労が限界に近い'); }
  if (s.water < 20) { m *= 1.25; why.push('脱水気味'); }
  if (s.injuries.length) { m *= 1 + 0.2 * s.injuries.length; why.push('すでに負傷している'); }
  return { m, why };
}

export function applyEffect(s: State, e: Effect | undefined, fb: Feedback[] = []): Feedback[] {
  if (!e) return fb;
  const tick = e.time ?? 0;
  if (e.hp) s.hp = clamp(s.hp + e.hp);
  if (e.stamina) s.stamina = clamp(s.stamina + e.stamina);
  if (e.water) s.water = clamp(s.water + e.water);
  if (e.mental) s.mental = clamp(s.mental + e.mental);
  if (e.battery) s.battery = clamp(s.battery + e.battery);
  for (const f of arr(e.flag)) if (!s.flags.includes(f)) s.flags.push(f);
  for (const f of arr(e.unflag)) s.flags = s.flags.filter(x => x !== f);
  for (const i of arr(e.item)) if (!s.items.includes(i)) { s.items.push(i); fb.push({ kind: 'good', text: `入手：${DB.items[i]?.name ?? i}` }); }
  for (const i of arr(e.useItem)) if (s.items.includes(i)) { s.items = s.items.filter(x => x !== i); fb.push({ kind: 'info', text: `使用：${DB.items[i]?.name ?? i}` }); }
  if (e.injury && !s.injuries.includes(e.injury)) { s.injuries.push(e.injury); fb.push({ kind: 'bad', text: `負傷：${DB.injuries[e.injury]?.name ?? e.injury}` }); }
  if (e.heal && s.injuries.includes(e.heal)) { s.injuries = s.injuries.filter(x => x !== e.heal); s.flags.push(`treated_${e.heal}`); fb.push({ kind: 'good', text: `手当て：${DB.injuries[e.heal]?.name ?? e.heal}` }); }
  for (const k of arr(e.know)) if (!s.know.includes(k)) { s.know.push(k); fb.push({ kind: 'info', text: `📘 図鑑に追加：${DB.knowledge.find(x => x.id === k)?.title ?? k}` }); }
  if (e.loc && e.loc !== s.loc) { s.loc = e.loc; s.route.push(e.loc); }
  for (const n of arr(e.npc)) {
    const st = s.npcs[n.id]; if (!st) continue;
    if (n.trust) st.trust = clamp(st.trust + n.trust);
    if (n.alive !== undefined) st.alive = n.alive;
    if (n.loc) st.loc = n.loc;
    if (n.hp) st.hp = clamp(st.hp + n.hp);
    if (n.injured !== undefined) st.injured = n.injured;
    if (n.flag && !st.flags.includes(n.flag)) st.flags.push(n.flag);
  }
  if (e.msg) {
    // delivery is causal: 171/web171 store & forward; SMS/SNS need battery + network window; calls fail during congestion window.
    const net = s.flags.includes('net_restored') ? 2 : s.t < 0 ? 2 : s.t < 180 ? 0 : 1;
    let delivered = false;
    if (s.battery <= 0) delivered = false;
    else if (e.msg.channel === '171' || e.msg.channel === 'web171') delivered = true;
    else if (e.msg.channel === 'note') delivered = true;
    else if (e.msg.channel === 'call') delivered = net === 2;
    else delivered = net >= 1 || roll(s) < 0.35;
    s.msgs.push({ ...e.msg, t: s.t, delivered });
    if (e.msg.channel !== 'note') s.battery = clamp(s.battery - (e.msg.channel === 'call' ? 3 : 1));
    fb.push({ kind: delivered ? 'good' : 'warn', text: delivered ? `✉ 伝言を残した（${chName(e.msg.channel)}）` : `✉ 送信失敗…（${chName(e.msg.channel)}）未送信のまま端末に残った` });
    if (delivered) s.flags.push(`msg_${e.msg.to}`); else s.flags.push(`msgfail_${e.msg.to}`);
  }
  if (e.photo && !s.photos.includes(e.photo)) { s.photos.push(e.photo); s.flags.push(`photo_${e.photo}`); fb.push({ kind: 'good', text: `📷 写真：${DB.photos[e.photo]?.title ?? e.photo}` }); }
  if (e.helped && !s.helped.includes(e.helped)) { s.helped.push(e.helped); s.flags.push(`helped_${e.helped}`); }
  for (const r of arr(e.report)) s.report.push({ ...r, t: s.t });
  if (e.risk) {
    const { m, why } = hazardMultiplier(s, e.risk.kind);
    const dmg = Math.round(e.risk.level * m * (0.75 + roll(s) * 0.5));
    s.hp = clamp(s.hp - dmg);
    s.flags.push(`exposed_${e.risk.kind}`);
    if (dmg >= 1) fb.push({ kind: dmg >= 15 ? 'bad' : 'warn', text: `⚠ ${e.risk.label}（体力 -${dmg}${why.length ? '｜' + why.join('・') : ''}）` });
    if (dmg >= 18) { const inj = DB.hazardInjury[e.risk.kind]; if (inj && !s.injuries.includes(inj)) { s.injuries.push(inj); fb.push({ kind: 'bad', text: `負傷：${DB.injuries[inj].name}` }); } }
    if (s.hp <= 0) s.dead = { cause: e.risk.kind, t: s.t, loc: s.loc };
  }
  if (tick) advance(s, tick, fb);
  return fb;
}
const chName = (c: string) => ({ sms: 'メッセージ', sns: 'SNS', '171': '災害用伝言ダイヤル171', web171: 'web171', call: '電話', note: 'メモ' } as Record<string, string>)[c] ?? c;

/** Time passes: bodily needs, untreated injuries, phone battery, and NPC agency all progress whether or not the player acts. */
export function advance(s: State, minutes: number, fb: Feedback[] = []) {
  const from = s.t; s.t += minutes;
  if (s.t > 0) {
    const h = Math.max(0, s.t - Math.max(0, from)) / 60;
    const walking = s.flags.includes('walking');
    s.water = clamp(s.water - h * (walking ? 6 : 3));
    s.stamina = clamp(s.stamina - h * (walking ? 7 : 1.5) + (walking ? 0 : h * 1));
    s.battery = clamp(s.battery - h * (s.flags.includes('phone_saving') ? 1 : 4));
    const supplied = s.flags.includes('supplied') && !walking;
    if (supplied) { s.water = Math.max(s.water, 55); s.stamina = clamp(s.stamina + h * 2); }
    let bleed = 0;
    if (!supplied) for (const i of s.injuries) bleed += (DB.injuries[i]?.drainPerHour ?? 0);
    if (s.water <= 0) bleed += 4;
    if (bleed) { const d = Math.round(bleed * h); if (d > 0) { s.hp = clamp(s.hp - d); fb.push({ kind: 'warn', text: `時間経過で体力 -${d}（${s.water <= 0 ? '脱水' : '手当てしていない傷'}）` }); } }
    if (s.hp <= 0 && !s.dead) s.dead = { cause: s.water <= 0 ? 'dehydration' : 'untreated', t: s.t, loc: s.loc };
  }
  for (const r of DB.npcRules) {
    if (r.tAt > from && r.tAt <= s.t && check(r.if, s)) {
      const st = s.npcs[r.npc]; if (!st) continue;
      if (r.set.loc) st.loc = r.set.loc; if (r.set.alive !== undefined) st.alive = r.set.alive;
      if (r.set.injured !== undefined) st.injured = r.set.injured; if (r.set.trust) st.trust = clamp(st.trust + r.set.trust);
      if (r.set.flag) { st.flags.push(r.set.flag); s.flags.push(`${r.npc}_${r.set.flag}`); }
      s.timeline.push({ t: r.tAt, text: fill(r.log, s) });
    }
  }
  if (s.hp > 0 && s.hp < 30) fb.push({ kind: 'warn', text: '体が危険な状態です。休息・水分・手当てを優先できる選択肢を探してください。' });
}

export function fill(text: string, s: State): string {
  const p = DB.presets[s.preset];
  return text.replace(/\{(\w+)\}/g, (_, k) => k === 'me' ? s.name : (p.vars as Record<string, string>)[k] ?? `{${k}}`);
}

export function scene(s: State): Scene { const sc = DB.scenes[s.scene]; if (!sc) throw new Error('missing scene ' + s.scene); return sc; }
export function visibleChoices(s: State) { return (scene(s).choices ?? []).filter(c => check(c.if, s)); }

function enter(s: State, id: string, fb: Feedback[]) {
  let guard = 0;
  for (;;) {
    if (++guard > 50) throw new Error('alt loop at ' + id);
    const sc = DB.scenes[id]; if (!sc) throw new Error('missing scene ' + id);
    const alt = sc.alt?.find(a => check(a.if, s));
    if (alt) { id = alt.goto; continue; }
    s.scene = id; s.chapter = sc.chapter;
    if (sc.setT !== undefined && s.t < sc.setT) advance(s, sc.setT - s.t, fb);
    applyEffect(s, sc.onEnter, fb);
    for (const i of sc.info ?? []) if (!s.info.includes(i)) s.info.push(i);
    if (s.dead && !id.startsWith('after') && id !== 'death' && id !== 'END') { id = 'death'; continue; }
    return;
  }
}

export function choose(s: State, choiceId: string): Feedback[] {
  const fb: Feedback[] = []; const sc = scene(s);
  const c = visibleChoices(s).find(x => x.id === choiceId);
  if (!c) throw new Error(`choice ${choiceId} not available in ${sc.id}`);
  s.history.push({ scene: sc.id, choice: c.id, t: s.t });
  applyEffect(s, c.effects, fb);
  if (c.result) fb.unshift({ kind: 'info', text: fill(c.result, s) });
  enter(s, s.dead ? 'death' : c.next, fb);
  return fb;
}
export function proceed(s: State): Feedback[] {
  const fb: Feedback[] = []; const sc = scene(s);
  if (!sc.next) throw new Error('no next on ' + sc.id);
  s.history.push({ scene: sc.id, choice: '→', t: s.t });
  const post = sc.id === 'death' || sc.id.startsWith('after');
  enter(s, s.dead && !post ? 'death' : sc.next, fb); return fb;
}
export function start(s: State): Feedback[] { const fb: Feedback[] = []; enter(s, s.scene, fb); return fb; }

export function resolveEnding(s: State): Ending { const e = DB.endings.find(e => check(e.if, s)); if (!e) throw new Error('no ending'); s.ending = e.id; return e; }
export function afterPieces(s: State) { return DB.after.filter(a => check(a.if, s)); }

export function reportSummary(s: State) {
  const cats = DB.reportCats; const out: Record<string, { score: number; notes: string[] }> = {};
  for (const k of Object.keys(cats)) out[k] = { score: 0, notes: [] };
  for (const r of s.report) { out[r.cat].score += r.score; out[r.cat].notes.push(r.note); }
  return out;
}
