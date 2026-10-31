import type { State } from '../engine/types';
import { SAVE_VERSION } from '../engine/engine';
const KEY = 'odaiba-afterlines.save';
const PREF = 'odaiba-afterlines.prefs';
const PLAYS = 'odaiba-afterlines.plays';
export interface SaveFile { app: 'odaiba-afterlines'; v: number; savedAt: string; state: State }
export interface Prefs { volume: number; muted: boolean; ads: boolean; textSpeed: 'normal' | 'instant'; seenDisclaimer: boolean; portraits: boolean }
export const defaultPrefs: Prefs = { volume: 0.5, muted: true, ads: false, textSpeed: 'normal', seenDisclaimer: false, portraits: true };

export function migrate(raw: unknown): SaveFile | null {
  if (!raw || typeof raw !== 'object') return null;
  const f = raw as Partial<SaveFile>;
  if (f.app !== 'odaiba-afterlines' || !f.state || typeof f.v !== 'number') return null;
  if (f.v > SAVE_VERSION) return null; // newer save from future version
  const st = f.state as State;
  // v1 is current; future migrations go here (if (f.v < 2) {...})
  st.timeline ??= []; st.photos ??= []; st.info ??= []; st.helped ??= [];
  return { app: 'odaiba-afterlines', v: SAVE_VERSION, savedAt: f.savedAt ?? new Date().toISOString(), state: st };
}
export function save(s: State) { const f: SaveFile = { app: 'odaiba-afterlines', v: SAVE_VERSION, savedAt: new Date().toISOString(), state: s }; localStorage.setItem(KEY, JSON.stringify(f)); }
export function load(): SaveFile | null { try { return migrate(JSON.parse(localStorage.getItem(KEY) ?? 'null')); } catch { return null; } }
export function clearSave() { localStorage.removeItem(KEY); }
export function exportText(): string { return localStorage.getItem(KEY) ?? ''; }
export function importText(t: string): SaveFile | null { try { const f = migrate(JSON.parse(t)); if (f) localStorage.setItem(KEY, JSON.stringify(f)); return f; } catch { return null; } }
export function prefs(): Prefs { try { return { ...defaultPrefs, ...JSON.parse(localStorage.getItem(PREF) ?? '{}') }; } catch { return { ...defaultPrefs }; } }
export function setPrefs(p: Prefs) { localStorage.setItem(PREF, JSON.stringify(p)); }
export interface PlayRecord { at: string; preset: string; ending: string; title: string; dead: boolean; t: number }
export function plays(): PlayRecord[] { try { return JSON.parse(localStorage.getItem(PLAYS) ?? '[]'); } catch { return []; } }
export function addPlay(r: PlayRecord) { const p = plays(); p.unshift(r); localStorage.setItem(PLAYS, JSON.stringify(p.slice(0, 50))); }
