// Original procedural SVG scene illustrations (made for this project; no third-party assets). See RIGHTS.md.
type P = { sky: [string, string]; sea?: string; motif: string; city?: boolean; caption: string; night?: boolean; smoke?: boolean; crack?: boolean };
const A: Record<string, P> = {
  morning_home: { sky: ['#fde9c9', '#f7c59f'], motif: '🏠', caption: '朝の家', city: true },
  odaiba_morning: { sky: ['#bfe3ff', '#e9f6ff'], sea: '#5aa9d6', motif: '🎡', caption: 'お台場の朝', city: true },
  promenade: { sky: ['#a9dcff', '#e9f6ff'], sea: '#4e9cc9', motif: '🌊', caption: '海沿いの遊歩道' },
  mall_food: { sky: ['#ffe7c2', '#fff4e3'], motif: '🍜', caption: 'フードコート' },
  family_call: { sky: ['#ffe0e9', '#fff3f6'], motif: '📱', caption: 'ビデオ通話' },
  shop: { sky: ['#e6f0ff', '#f6f9ff'], motif: '🛍', caption: 'モール' },
  mall_window: { sky: ['#cfe8ff', '#eef6ff'], sea: '#5aa9d6', motif: '🪟', caption: 'ガラス張りの窓辺' },
  quake: { sky: ['#5b6170', '#2c303a'], motif: '⚠', caption: '揺れ', crack: true },
  quake_indoor: { sky: ['#6b6157', '#3a332c'], motif: '💡', caption: '屋内の揺れ', crack: true },
  elevator: { sky: ['#4a4f5a', '#2a2d33'], motif: '🛗', caption: 'エレベーター' },
  beach_quake: { sky: ['#7d8899', '#454c59'], sea: '#3f6f8f', motif: '🏖', caption: '海辺の揺れ', crack: true },
  beach_after: { sky: ['#8a96a6', '#c9cfd8'], sea: '#3f6f8f', motif: '🌫', caption: '海辺' },
  mall_damage: { sky: ['#8b8378', '#c9c0b3'], motif: '🧱', caption: '崩れた天井材', crack: true },
  smoke: { sky: ['#5d5550', '#9a8f86'], motif: '🔥', caption: '煙', smoke: true },
  injured: { sky: ['#d9d3cc', '#f3efe9'], motif: '🩹', caption: '応急手当て' },
  child: { sky: ['#e7e1f7', '#f7f4ff'], motif: '🧒', caption: 'ひとりの子ども' },
  phone_sns: { sky: ['#2a3550', '#4b5a80'], motif: '💬', caption: 'SNS', night: true },
  phone_171: { sky: ['#283046', '#4a5578'], motif: '☎', caption: '災害用伝言ダイヤル', night: true },
  family_away: { sky: ['#9fb2c8', '#dfe7f0'], motif: '🧭', caption: '離れた家族', city: true },
  crowd: { sky: ['#b8a68f', '#e8dccb'], motif: '👥', caption: '人の波', city: true },
  facility: { sky: ['#c7d6cf', '#eef4f1'], motif: '🏢', caption: '一時滞在施設（架空）' },
  night_shelter: { sky: ['#1c2235', '#363f5c'], motif: '🌙', caption: '夜の施設', night: true },
  liquefaction: { sky: ['#a99b80', '#d8cdb6'], motif: '🕳', caption: '液状化', crack: true, city: true },
  walk_night: { sky: ['#141a2c', '#2e3654'], motif: '🔦', caption: '停電の夜道', night: true, city: true },
  aid: { sky: ['#dfe9f3', '#f6fafd'], motif: '⛑', caption: '救護所（架空）' },
  dawn: { sky: ['#f6b98a', '#fde5c8'], sea: '#7aa9c9', motif: '🌅', caption: '夜明け', city: true },
  reunion: { sky: ['#ffd9b3', '#fff1e0'], motif: '🤝', caption: '再会' },
  shelter_life: { sky: ['#d6d0c4', '#f1ede5'], motif: '🏫', caption: '避難所の生活' },
  rebuild: { sky: ['#cfe3d0', '#f1f8f1'], motif: '🧰', caption: '片付けと再建', city: true },
  letter: { sky: ['#f4ead8', '#fffaf0'], motif: '✉', caption: '手紙' },
  memorial: { sky: ['#9aa3b0', '#d5d9df'], motif: '🕊', caption: 'その後' },
};
export function sceneArt(bg: string): string {
  const p = A[bg] ?? { sky: ['#ccd', '#eef'], motif: '・', caption: bg };
  let city = '';
  if (p.city) { let x = 0; let i = 0; while (x < 400) { const w = 18 + ((i * 37) % 30); const h = 30 + ((i * 53) % 70); city += `<rect x="${x}" y="${170 - h}" width="${w}" height="${h}" fill="${p.night ? '#0d1220' : '#00000022'}"/>`; if (p.night && i % 3 === 0) city += `<rect x="${x + 5}" y="${180 - h}" width="3" height="3" fill="#f6d77a88"/>`; x += w + 4; i++; } }
  const sea = p.sea ? `<rect y="150" width="400" height="70" fill="${p.sea}"/><path d="M0 160 Q50 152 100 160 T200 160 T300 160 T400 160" stroke="#ffffff66" fill="none"/>` : `<rect y="170" width="400" height="50" fill="#00000018"/>`;
  const smoke = p.smoke ? `<g opacity=".55"><circle cx="120" cy="90" r="50" fill="#444"/><circle cx="190" cy="70" r="60" fill="#555"/><circle cx="270" cy="95" r="45" fill="#4a4a4a"/></g>` : '';
  const crack = p.crack ? `<path d="M210 220 L200 190 L215 170 L195 140 L205 120" stroke="#1118" stroke-width="2.5" fill="none"/>` : '';
  const stars = p.night ? Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 71) % 400}" cy="${(i * 29) % 80 + 8}" r="1" fill="#fff8"/>`).join('') : '';
  return `<svg viewBox="0 0 400 220" role="img" aria-label="${p.caption}（イラスト）" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g_${bg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient></defs><rect width="400" height="220" fill="url(#g_${bg})"/>${stars}${smoke}${city}${sea}${crack}<text x="200" y="128" font-size="64" text-anchor="middle">${p.motif}</text></svg>`;
}
export const artKeys = Object.keys(A);
