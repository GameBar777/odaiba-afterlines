// AI生成の背景イラスト（架空の場所のイメージ。実在施設の写真ではありません）。docs/RIGHTS.md 参照。
// 読み込みに失敗した場合は自作SVG（art.ts）がそのまま表示される。
const BASE = ['morning_home', 'odaiba_morning', 'promenade', 'mall_food', 'family_call', 'shop', 'mall_window', 'quake', 'quake_indoor', 'elevator', 'beach_quake', 'beach_after', 'mall_damage', 'smoke', 'injured', 'child', 'phone_sns', 'family_away', 'crowd', 'facility', 'night_shelter', 'liquefaction', 'walk_night', 'aid', 'dawn', 'reunion', 'shelter_life', 'rebuild', 'letter', 'memorial'];
const ALIAS: Record<string, string> = { phone_171: 'phone_sns' };
const VARIANTS = ['rebuild', 'crowd', 'shelter_life', 'reunion', 'aid', 'family_away', 'facility', 'promenade'];
export type Tod = 'day' | 'eve' | 'night' | 'late';
/** 分（0–1439）から時間帯を返す。16:00–18:30 夕方 / 18:30–05:30 夜（isNight と同じ）/ 00:00–04:00 深夜 */
export function todOf(mm: number): Tod {
  mm = ((mm % 1440) + 1440) % 1440;
  if (mm < 4 * 60) return 'late';
  if (mm >= 18 * 60 + 30 || mm < 5 * 60 + 30) return 'night';
  if (mm >= 16 * 60) return 'eve';
  return 'day';
}
export function bgFile(bg: string, tod: Tod = 'day'): string | null {
  const k = ALIAS[bg] ?? bg;
  if (k === 'night_shelter' && tod === 'late') return 'night_shelter_late';
  if (VARIANTS.includes(k) && tod !== 'day') return `${k}_${tod === 'late' ? 'night' : tod}`;
  return BASE.includes(k) ? k : null;
}
export function bgSrc(bg: string, tod: Tod = 'day'): string | null {
  const f = bgFile(bg, tod); return f ? `${import.meta.env.BASE_URL}bg/${f}.webp` : null;
}
export const BG_FILES = [...BASE, ...VARIANTS.flatMap(v => [`${v}_eve`, `${v}_night`]), 'night_shelter_late'];
