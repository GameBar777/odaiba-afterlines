// AI生成の立ち絵（架空の人物。実在人物の肖像ではありません）。docs/RIGHTS.md 参照。
const NAMES: [string, string][] = [
  ['湊', 'minato'], ['千夏の母', ''], ['千夏', 'chinatsu'], ['陽菜', 'hina'], ['葵', 'aoi'], ['蓮', 'ren'], ['ふみ', 'fumi'],
  ['拓海', 'takumi'], ['健司', 'kenji'], ['美咲', 'misaki'], ['律', 'ritsu'], ['ひかり', 'hikari'], ['田辺', 'tanabe'], ['エミリー', 'emily'],
];
export function portraitKey(who: string): string | null {
  for (const [n, k] of NAMES) if (who.includes(n)) return k || null;
  return null;
}
/** ch1–3 は不安顔、それ以外は通常 */
export function portraitSrc(who: string, chapter: number): string | null {
  const k = portraitKey(who); if (!k) return null;
  const mood = chapter >= 1 && chapter <= 3 ? 'worried' : 'neutral';
  return `${import.meta.env.BASE_URL}portraits/${k}_${mood}.webp`;
}
export const PORTRAIT_KEYS = ['minato', 'chinatsu', 'hina', 'aoi', 'ren', 'fumi', 'takumi', 'kenji', 'misaki', 'ritsu', 'hikari', 'tanabe', 'emily'];
