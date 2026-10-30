// ---- Core data types. Engine is generic; all content lives in src/data. ----
export type PresetId = 'worker' | 'student' | 'parent';
export type HazardKind = 'glass' | 'fall' | 'fire' | 'crowd' | 'liquefaction' | 'water' | 'exhaustion' | 'collapse' | 'traffic';

export interface Cond {
  flag?: string | string[];      // all must be set
  anyFlag?: string[];             // at least one
  notFlag?: string | string[];    // none set
  item?: string; noItem?: string;
  preset?: PresetId | PresetId[];
  minHp?: number; maxHp?: number;
  minBattery?: number; maxBattery?: number;
  npcAlive?: string; npcDead?: string;
  npcAt?: [string, string];
  npcNotAt?: [string, string];
  minTrust?: [string, number];
  loc?: string; tMin?: number; tMax?: number;
  setting?: [string, string | boolean];
  dead?: boolean;
}

export interface NpcEffect { id: string; trust?: number; alive?: boolean; loc?: string; hp?: number; flag?: string; injured?: boolean; }
export interface MsgEffect { to: string; text: string; channel: 'sms' | 'sns' | '171' | 'web171' | 'call' | 'note'; }
export interface ReportEffect { cat: ReportCat; score: number; note: string; }
export type ReportCat = 'safety' | 'evac' | 'info' | 'contact' | 'items' | 'stay' | 'aid' | 'care';

export interface Effect {
  hp?: number; stamina?: number; water?: number; mental?: number; battery?: number;
  time?: number;                      // minutes advanced
  flag?: string | string[]; unflag?: string | string[];
  item?: string | string[]; useItem?: string | string[];
  injury?: string; heal?: string;     // ids in injuries data
  know?: string | string[];           // knowledge entry ids unlocked
  loc?: string;
  npc?: NpcEffect | NpcEffect[];
  msg?: MsgEffect;
  photo?: string;                     // photo id taken
  risk?: { kind: HazardKind; level: number; label: string };
  report?: ReportEffect | ReportEffect[];
  helped?: string;                    // npc id helped (for chain + after-story)
}

export interface Choice {
  id: string; label: string; icon?: string; hint?: string;
  if?: Cond; effects?: Effect; next: string; result?: string; tags?: string[];
}

export interface InfoPost {
  id: string; source: 'official-fiction' | 'sns' | 'witness' | 'facility' | 'family';
  from: string; at: string; text: string; reliability: 1 | 2 | 3 | 4 | 5; truth: boolean; note?: string;
}

export interface Scene {
  id: string; chapter: number; bg: string; title?: string;
  if?: Cond;
  lines: Array<[string, string]>;    // [speaker ('' = narration), text]
  onEnter?: Effect;
  choices?: Choice[];
  next?: string;                      // auto-next when no choices
  fx?: 'quake' | 'aftershock' | 'dark' | 'rain' | 'dawn';
  info?: string[];                    // info post ids unlocked
  photoShow?: string;                 // show a photo card
  chapterEnd?: boolean;               // shows lesson screen after
  lesson?: string[];                  // knowledge ids for chapter lesson
  setT?: number;                      // set clock (minutes from quake)
  alt?: Array<{ if: Cond; goto: string }>; // redirect on enter
}

export interface Npc {
  id: string; name: string; role: string; age: number; startLoc: string;
  personality: string; values: string; fear: string; secret: string; goal: string; past: string;
  knowledge: number; health: string; family: string; job: string;
  preset?: PresetId[];
}

export interface NpcRule {
  id: string; npc: string; if: Cond; tAt: number;
  set: Omit<NpcEffect, 'id'>;
  log: string;          // shown in "その頃" timeline
}

export interface Knowledge {
  id: string; cat: string; title: string; body: string;
  level: '確立' | '研究途上' | 'シナリオ仮定';
  status: '出典確認済(専門家未監修)' | '要監修';
  sources: string[];    // source ids
}

export interface Source { id: string; publisher: string; title: string; date: string; url: string; checked: string; used: string; }

export interface Ending {
  id: string; title: string; kind: 'survive' | 'loss' | 'death' | 'rebuild';
  if: Cond; text: string[];
}

export interface AfterPiece { id: string; if: Cond; who: string; text: string; photo?: string; }

export interface Loc { id: string; name: string; x: number; y: number; real: boolean; note: string; }
export interface Edge { a: string; b: string; minutes: number; closedIf?: Cond; risk?: Cond; note: string; }

export interface State {
  v: number; seed: number; preset: PresetId; name: string;
  settings: Record<string, string | boolean>;
  scene: string; chapter: number; t: number;
  hp: number; stamina: number; water: number; mental: number; battery: number;
  injuries: string[]; items: string[]; flags: string[]; know: string[]; photos: string[]; info: string[];
  loc: string; route: string[];
  npcs: Record<string, { alive: boolean; loc: string; trust: number; hp: number; injured: boolean; flags: string[] }>;
  msgs: Array<MsgEffect & { t: number; delivered: boolean }>;
  helped: string[];
  report: Array<ReportEffect & { t: number }>;
  history: Array<{ scene: string; choice: string; t: number }>;
  timeline: Array<{ t: number; text: string }>;
  dead?: { cause: string; t: number; loc: string };
  ending?: string;
  rng: number;
}
