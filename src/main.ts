import './style.css';
import { DB } from './data';
import { newGame, start, choose, proceed, scene, visibleChoices, fill, clockLabel, resolveEnding, afterPieces, reportSummary, type Feedback } from './engine/engine';
import type { State, PresetId } from './engine/types';
import { save, load, clearSave, exportText, importText, prefs, setPrefs, addPlay, plays, type Prefs } from './platform/save';
import { cue, setSound } from './platform/sound';
import { sceneArt } from './ui/art';

export const DISCLAIMER = '本作は防災教育を目的としたシミュレーションゲームです。ゲーム内の地震、被害、施設状況、避難経路、人物の行動は架空のシナリオを含みます。現実の災害時は、気象庁、自治体、消防、警察などの最新の公式情報と現地の状況に従ってください。本作のプレイ結果だけで実際の安全を保証するものではありません。';
const TITLE = 'ゆれのあと、きみへ。';
const app = document.getElementById('app')!;
let S: State | null = null;
let P: Prefs = prefs();
let lastFb: Feedback[] = [];
let tab: string | null = null;
let lessonFor: number | null = null;
setSound(P.volume, P.muted);

const esc = (t: string) => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const h = (html: string) => { app.innerHTML = html; window.scrollTo(0, 0); };
const F = (t: string) => (S ? esc(fill(t, S)) : esc(t));
const on = (sel: string, fn: (el: HTMLElement) => void) => app.querySelectorAll<HTMLElement>(sel).forEach(el => el.addEventListener('click', () => { cue('tap'); fn(el); }));
const ad = (where: string) => P.ads ? `<div class="ad" data-ad="${where}">広告枠（${where}）— 審査・承認前のため表示されません</div>` : '';

function title() {
  const sv = load();
  h(`<main class="title">
    <div class="art">${sceneArt('odaiba_morning')}</div>
    <h1>${TITLE}<small>ODAIBA AFTERLINES</small></h1>
    <p class="lead">平日の午後、お台場。架空の「首都直下地震」が起きたら——あなたは、誰と、どう生きのびるか。</p>
    <section class="disc" id="disc"><h2>はじめに（必ずお読みください）</h2><p>${DISCLAIMER}</p></section>
    <div class="btns">
      <button class="primary" id="new">はじめから</button>
      ${sv ? `<button id="cont">つづきから（${esc(sv.state.name)}・${esc(clockLabel(sv.state))}）</button>` : ''}
      <button id="enc">防災知識図鑑</button><button id="hist">プレイ履歴</button><button id="set">設定</button>
    </div>
    ${ad('タイトル')}
    <p class="note">揺れの演出があります（画面の振動・暗転）。設定で弱められます。音は初期状態でミュートです。</p>
  </main>`);
  on('#new', () => setup()); on('#cont', () => { S = load()!.state; lastFb = []; play(); });
  on('#enc', () => encyclopedia(title)); on('#hist', () => history(title)); on('#set', () => settings(title));
}

function setup() {
  const pr = Object.entries(DB.presets);
  h(`<main class="setup"><h1>主人公を選ぶ</h1>
    <div class="presets">${pr.map(([id, p], i) => `<label class="preset"><input type="radio" name="preset" value="${id}" ${i === 0 ? 'checked' : ''}/><b>${esc(p.label)}</b><span>${esc(p.desc)}</span></label>`).join('')}</div>
    <label>名前（空欄ならプリセット名）<input id="name" maxlength="10" placeholder="例：みなと" /></label>
    <fieldset><legend>発生時間</legend>
      <label><input type="radio" name="time" value="day" checked/>平日 15:12</label>
      <label><input type="radio" name="time" value="night"/>平日 19:40（夜）</label>
      <label><input type="radio" name="time" value="holiday"/>休日 13:05</label></fieldset>
    <fieldset><legend>日ごろの備え</legend>
      <label><input type="radio" name="prep" value="none"/>ほとんどなし</label>
      <label><input type="radio" name="prep" value="some" checked/>少し</label>
      <label><input type="radio" name="prep" value="full"/>しっかり（モバイルバッテリー・笛・ライト等）</label></fieldset>
    <fieldset><legend>体調</legend>
      <label><input type="radio" name="health" value="normal" checked/>ふつう</label>
      <label><input type="radio" name="health" value="asthma"/>喘息の持病あり（吸入薬を持つ）</label></fieldset>
    <p class="note">地震の規模・被害・施設はすべてゲーム内の架空の想定です。</p>
    <div class="btns"><button class="primary" id="go">この設定ではじめる</button><button id="back">戻る</button></div></main>`);
  on('#back', title);
  on('#go', () => {
    const v = (n: string) => (app.querySelector(`input[name=${n}]:checked`) as HTMLInputElement).value;
    const name = (app.querySelector('#name') as HTMLInputElement).value.trim();
    const settings: Record<string, string> = { time: v('time'), prep: v('prep'), health: v('health') };
    if (name) settings.name = name;
    S = newGame(v('preset') as PresetId, settings, (Date.now() % 100000) + 1);
    lastFb = start(S); save(S); play();
  });
}

const bar = (label: string, v: number, cls = '') => `<div class="bar ${cls} ${v < 30 ? 'low' : ''}" title="${label} ${Math.round(v)}"><span>${label}</span><i style="width:${Math.max(0, Math.min(100, v))}%"></i><b>${Math.round(v)}</b></div>`;

function play() {
  const s = S!; const sc = scene(s);
  if (s.scene === 'END') return ending();
  if (lessonFor !== null) return lesson();
  const isAfter = sc.id === 'after_story';
  const cs = visibleChoices(s);
  const fbHtml = lastFb.length ? `<ul class="fb">${lastFb.map(f => `<li class="${f.kind}">${esc(f.text)}</li>`).join('')}</ul>` : '';
  const deathHtml = sc.id === 'death' && s.dead ? deathCause(s) : '';
  const afterHtml = isAfter ? afterPieces(s).map(a => `<div class="after">${a.photo ? `<div class="photo">📷 ${esc(DB.photos[a.photo]?.title ?? '')}</div>` : ''}<b>${F(a.who)}</b><p>${F(a.text)}</p></div>`).join('') : '';
  const photo = sc.photoShow && s.photos.includes(sc.photoShow) ? `<div class="photo">📷 ${esc(DB.photos[sc.photoShow].title)}<small>${esc(DB.photos[sc.photoShow].desc)}</small></div>` : '';
  const infoNew = (sc.info ?? []).map(id => DB.info.find(i => i.id === id)!).filter(Boolean);
  h(`<main class="game ${sc.fx ? 'fx-' + sc.fx : ''}">
    <header class="hud"><div class="row"><b>第${sc.chapter > 5 ? '—' : sc.chapter}章</b><span class="clock">🕒 ${esc(clockLabel(s))}</span><span class="loc">📍 ${esc(DB.locs.find(l => l.id === s.loc)?.name ?? s.loc)}</span><button id="menu" aria-label="メニュー">☰</button></div>
      <div class="bars">${bar('体力', s.hp, 'hp')}${bar('スタミナ', s.stamina)}${bar('水分', s.water)}${bar('こころ', s.mental)}${bar('電池', s.battery, 'bat')}</div>
      ${s.injuries.length ? `<div class="inj">🩹 ${s.injuries.map(i => esc(DB.injuries[i]?.name ?? i)).join('・')}</div>` : ''}</header>
    <div class="art scene">${sceneArt(sc.bg)}<span class="credit">イラスト：自作SVG</span></div>
    ${fbHtml}${deathHtml}
    <section class="lines">${sc.lines.map(([who, t]) => who ? `<p class="say"><b>${F(who)}</b>${F(t)}</p>` : `<p class="nar">${F(t)}</p>`).join('')}</section>
    ${photo}${afterHtml}
    ${infoNew.length ? `<section class="infos"><h3>📡 届いた情報</h3>${infoNew.map(infoCard).join('')}</section>` : ''}
    <nav class="choices">${cs.length ? cs.map(c => `<button class="choice" data-c="${c.id}">${c.icon ? `<span class="ic">${c.icon}</span>` : ''}${F(c.label)}${c.hint ? `<small>${F(c.hint)}</small>` : ''}</button>`).join('') : `<button class="choice primary" id="next">つづける ▶</button>`}</nav>
    <nav class="tabs">${[['map', '地図'], ['people', '人物'], ['items', '持ち物'], ['comms', '通信'], ['info', '情報'], ['know', '図鑑'], ['log', '記録']].map(([k, l]) => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}">${l}</button>`).join('')}</nav>
    ${tab ? `<section class="panel" id="panel">${panel(tab)}</section>` : ''}
  </main>`);
  if (sc.fx === 'quake' || sc.fx === 'aftershock') cue('rumble');
  on('.choice[data-c]', el => act(() => choose(s, el.dataset.c!)));
  on('#next', () => act(() => proceed(s)));
  on('[data-tab]', el => { tab = tab === el.dataset.tab ? null : el.dataset.tab!; play(); document.getElementById('panel')?.scrollIntoView({ block: 'nearest' }); });
  on('#menu', () => menu());
}
function act(fn: () => Feedback[]) {
  const s = S!; const prevSc = scene(s);
  lastFb = fn();
  if (prevSc.chapterEnd && prevSc.lesson && s.scene !== 'death') lessonFor = prevSc.chapter;
  save(s); tab = null; play();
}
function infoCard(i: (typeof DB.info)[number]) {
  const src = { 'official-fiction': '公式（ゲーム内架空情報）', sns: 'SNS', witness: '目撃証言', facility: '施設', family: '家族' }[i.source];
  return `<div class="info rel${i.reliability}"><div class="ih"><span class="src">${src}</span><span class="stars" title="信頼度の目安">信頼度 ${'★'.repeat(i.reliability)}${'☆'.repeat(5 - i.reliability)}</span></div><b>${esc(i.from)}</b>・<small>${esc(i.at)}</small><p>${esc(i.text)}</p>${i.note ? `<small class="inote">🔎 ${esc(i.note)}</small>` : ''}</div>`;
}
function deathCause(s: State) {
  const d = s.dead!; const causes: Record<string, string> = { glass: 'ガラス片による負傷', fall: '落下物', fire: '火災の煙と熱', crowd: '群衆の中での転倒', liquefaction: '液状化した地面での転倒・負傷', water: '海水と低体温', exhaustion: '疲労の限界', collapse: '崩落', traffic: '交通事故', dehydration: '脱水', untreated: '手当てされなかった傷' };
  const chain = s.report.filter(r => r.score < 0).map(r => r.note);
  return `<section class="death"><h2>死因：${esc(causes[d.cause] ?? d.cause)}</h2><p>${esc(clockLabel(s, d.t))}・${esc(DB.locs.find(l => l.id === d.loc)?.name ?? d.loc)}</p>
   <h3>そこに至るまで</h3><ul>${chain.length ? chain.map(c => `<li>${esc(c)}</li>`).join('') : '<li>大きな判断ミスがなくても、負傷・時間・環境が重なると命に関わることがある。</li>'}${s.injuries.map(i => `<li>負傷：${esc(DB.injuries[i]?.name ?? i)}（${esc(DB.injuries[i]?.desc ?? '')}）</li>`).join('')}</ul>
   <p class="note">これはゲーム内の架空の出来事です。死は偶然ではなく、状態と判断の積み重ねとして計算されています。</p></section>`;
}
function panel(k: string): string {
  const s = S!;
  if (k === 'map') {
    const L = DB.locs; const at = (id: string) => L.find(l => l.id === id)!;
    return `<h3>お台場周辺（模式図・縮尺不正確）</h3><svg viewBox="0 0 520 360" class="map">
      <rect width="520" height="360" fill="#dcecf7"/><path d="M60 110 L250 90 L360 180 L330 300 L110 350 L60 220 Z" fill="#eef2e6" stroke="#9ab"/>
      ${DB.edges.map(e => `<line x1="${at(e.a).x}" y1="${at(e.a).y}" x2="${at(e.b).x}" y2="${at(e.b).y}" stroke="#8a9" stroke-dasharray="${e.note ? '4 3' : ''}"/>`).join('')}
      ${L.map(l => `<g><circle cx="${l.x}" cy="${l.y}" r="${l.id === s.loc ? 9 : 5}" fill="${l.id === s.loc ? '#e4572e' : l.real ? '#2b6cb0' : '#a0a'}"/><text x="${l.x + 8}" y="${l.y - 6}" font-size="11">${esc(l.name.replace(/（.*?）/g, ''))}${l.real ? '' : '*'}</text></g>`).join('')}
      ${s.route.length > 1 ? `<polyline points="${s.route.map(r => `${at(r)?.x ?? 0},${at(r)?.y ?? 0}`).join(' ')}" fill="none" stroke="#e4572e" stroke-width="2" opacity=".6"/>` : ''}
    </svg><p class="note">青＝実在の地名・施設、紫＊＝架空の施設。点線＝シナリオ上の通行注意。実際の避難経路・施設状況を示すものではありません。地名の参考：© OpenStreetMap contributors（地図データは使用せず、模式的に作図）。</p>
    <ul class="edges">${DB.edges.filter(e => e.note).map(e => `<li>${esc(at(e.a).name)}↔${esc(at(e.b).name)}：${esc(e.note)}</li>`).join('')}</ul>`;
  }
  if (k === 'people') return `<h3>人物</h3><ul class="people">${DB.npcs.filter(n => s.npcs[n.id]).map(n => { const st = s.npcs[n.id]; const met = s.flags.some(f => f.includes(n.id)) || ['fam1', 'fam2', 'friend'].includes(n.id) || st.trust !== 50 || s.helped.includes(n.id); if (!met) return ''; return `<li><b>${F(n.name)}</b>（${F(n.role)}）${st.alive ? '' : ' 🕊'}${st.injured ? ' 🩹' : ''}<br><small>${F(n.personality)}</small><br><small>信頼 ${st.trust}・所在 ${esc(DB.locs.find(l => l.id === st.loc)?.name ?? st.loc)}</small></li>`; }).join('')}</ul><p class="note">他の人たちも、それぞれの判断で動いています。その全体像は、物語の最後に分かります。</p>`;
  if (k === 'items') return `<h3>持ち物</h3><ul>${s.items.map(i => `<li><b>${esc(DB.items[i]?.name ?? i)}</b> <small>${esc(DB.items[i]?.desc ?? '')}</small></li>`).join('')}</ul><h3>写真</h3><ul>${s.photos.map(p => `<li>📷 ${esc(DB.photos[p].title)}</li>`).join('') || '<li>なし</li>'}</ul>`;
  if (k === 'comms') return `<h3>通信・安否確認</h3><p>電池 ${Math.round(s.battery)}%。発災直後は電話がつながりにくく、災害用伝言ダイヤル171やweb171は伝言を預けられる。</p><ul>${s.msgs.map(m => `<li>${m.delivered ? '✅' : '⚠ 未送信'} [${esc(m.channel)}] → ${F(m.to === 'fam1' ? '{fam1}' : m.to === 'fam2' ? '{fam2}' : m.to)}：「${F(m.text)}」 <small>${esc(clockLabel(s, m.t))}</small></li>`).join('') || '<li>まだ連絡していない</li>'}</ul>`;
  if (k === 'info') return `<h3>集めた情報</h3><p class="note">「公式（ゲーム内架空情報）」も含め、本作の発表はすべて架空です。</p>${s.info.map(id => DB.info.find(i => i.id === id)).filter(Boolean).map(i => infoCard(i!)).join('') || '<p>まだない</p>'}`;
  if (k === 'know') return knowList(s.know);
  if (k === 'log') return `<h3>選択の記録</h3><ol>${s.history.filter(x => x.choice !== '→').map(x => { const c = DB.scenes[x.scene]?.choices?.find(c => c.id === x.choice); return `<li><small>${esc(clockLabel(s, x.t))}</small> ${c ? F(c.label) : esc(x.choice)}</li>`; }).join('')}</ol>`;
  return '';
}
function knowList(ids: string[] | null) {
  const list = DB.knowledge.filter(k => !ids || ids.includes(k.id));
  return `<h3>防災知識図鑑 ${ids ? `（${ids.length}/${DB.knowledge.length}）` : `（全${DB.knowledge.length}件）`}</h3>${list.map(k => `<details class="know"><summary><span class="cat">${esc(k.cat)}</span> ${esc(k.title)} ${k.status === '要監修' ? '<em class="kan">要監修</em>' : ''}</summary><p>${esc(k.body)}</p><small>根拠レベル：${k.level}／状態：${k.status}</small><ul class="src">${k.sources.map(id => DB.sources.find(x => x.id === id)).filter(Boolean).map(x => `<li>${esc(x!.publisher)}「${esc(x!.title)}」${esc(x!.date)} <a href="${esc(x!.url)}" target="_blank" rel="noopener">${esc(x!.url)}</a></li>`).join('')}</ul></details>`).join('') || '<p>まだ記録がない。</p>'}`;
}
function lesson() {
  const s = S!; const ch = lessonFor!; const sc = Object.values(DB.scenes).find(x => x.chapter === ch && x.chapterEnd)!;
  h(`<main class="lesson"><h1>第${ch}章 おわり</h1><h2>この章の防災ポイント</h2>${knowList(sc.lesson!.filter(Boolean))}${ad('章の区切り')}<div class="btns"><button class="primary" id="go">次の章へ</button></div></main>`);
  on('#go', () => { lessonFor = null; s.know = [...new Set([...s.know, ...sc.lesson!])]; save(s); lastFb = []; play(); });
}
function ending() {
  const s = S!; const e = resolveEnding(s);
  if (!s.flags.includes('recorded_play')) { s.flags.push('recorded_play'); addPlay({ at: new Date().toISOString(), preset: s.preset, ending: e.id, title: e.title, dead: !!s.dead, t: s.t }); save(s); }
  const rs = reportSummary(s);
  h(`<main class="ending ${e.kind}"><p class="kind">${{ survive: '生存', loss: '喪失', death: '死亡', rebuild: '再建' }[e.kind]}エンド</p><h1>${esc(e.title)}</h1>${e.text.map(t => `<p>${F(t)}</p>`).join('')}
    ${!s.dead ? afterPieces(s).filter(a => a.id !== 'a_unsent' && a.id !== 'a_report').slice(0, 3).map(a => `<div class="after"><b>${F(a.who)}</b><p>${F(a.text)}</p></div>`).join('') : ''}
    <section class="report"><h2>防災判断レポート</h2>${Object.entries(DB.reportCats).map(([k, label]) => `<div class="rc"><b>${esc(label)}</b><span class="sc ${rs[k].score > 0 ? 'pos' : rs[k].score < 0 ? 'neg' : ''}">${rs[k].score > 0 ? '+' : ''}${rs[k].score}</span><ul>${rs[k].notes.map(n => `<li>${esc(n)}</li>`).join('') || '<li class="muted">記録なし</li>'}</ul></div>`).join('')}
    <h3>あなたが知らなかったこと（その頃）</h3><ul>${s.timeline.map(t => `<li><small>${esc(clockLabel(s, t.t))}</small> ${esc(t.text)}</li>`).join('')}</ul>
    <p class="disc">${DISCLAIMER}</p></section>
    ${ad('タイトル前')}
    <div class="btns"><button class="primary" id="again">もう一度（別の選択で）</button><button id="enc">図鑑を見る</button><button id="ttl">タイトルへ</button></div></main>`);
  on('#again', () => { clearSave(); setup(); }); on('#enc', () => encyclopedia(ending)); on('#ttl', () => { clearSave(); title(); });
}
function encyclopedia(back: () => void) { h(`<main class="page">${knowList(null)}<h3>出典一覧</h3><ul class="src">${DB.sources.map(x => `<li>${esc(x.publisher)}「${esc(x.title)}」${esc(x.date)} <a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.url)}</a> <small>確認：${esc(x.checked)}</small></li>`).join('')}</ul><p class="note">「要監修」は専門家の監修を受けていない記述です。内容は公式資料で確認してください。</p><div class="btns"><button id="b">戻る</button></div></main>`); on('#b', back); }
function history(back: () => void) { const p = plays(); h(`<main class="page"><h2>プレイ履歴</h2><ul>${p.map(r => `<li>${esc(new Date(r.at).toLocaleString('ja-JP'))} ${esc(DB.presets[r.preset as PresetId]?.label ?? r.preset)}：${esc(r.title)}${r.dead ? ' 🕊' : ''}</li>`).join('') || '<li>まだありません</li>'}</ul><div class="btns"><button id="b">戻る</button></div></main>`); on('#b', back); }
function menu() {
  h(`<main class="page"><h2>メニュー</h2><div class="btns col"><button id="r">ゲームに戻る</button><button id="e">防災知識図鑑（全件）</button><button id="s">設定・セーブ管理</button><button id="t">タイトルへ（自動保存済み）</button></div></main>`);
  on('#r', play); on('#e', () => encyclopedia(menu)); on('#s', () => settings(menu)); on('#t', title);
}
function settings(back: () => void) {
  h(`<main class="page"><h2>設定</h2>
    <label><input type="checkbox" id="mute" ${P.muted ? 'checked' : ''}/> 音をミュート</label>
    <label>音量 <input type="range" id="vol" min="0" max="1" step="0.1" value="${P.volume}"/></label>
    <label><input type="checkbox" id="calm" ${document.body.classList.contains('calm') ? 'checked' : ''}/> 揺れ・暗転の演出を弱める</label>
    <label><input type="checkbox" id="ads" ${P.ads ? 'checked' : ''}/> 広告枠を表示（初期はOFF。タイトル・章の区切りのみ。現在は審査前のため中身は表示されません）</label>
    <h3>セーブデータ</h3><div class="btns"><button id="exp">書き出し（コピー）</button><button id="imp">読み込み</button><button id="del">セーブ削除</button></div>
    <textarea id="txt" rows="4" placeholder="ここにセーブデータを貼り付けて「読み込み」"></textarea><p id="msg" class="note"></p>
    <h3>免責事項</h3><p class="disc">${DISCLAIMER}</p>
    <p class="note">イラストは本作のために作成したSVG（自作）です。実在の災害映像・写真は使用していません。</p>
    <div class="btns"><button class="primary" id="b">戻る</button></div></main>`);
  const g = (id: string) => app.querySelector('#' + id) as HTMLInputElement;
  const upd = () => { P = { ...P, muted: g('mute').checked, volume: Number(g('vol').value), ads: g('ads').checked }; setPrefs(P); setSound(P.volume, P.muted); document.body.classList.toggle('calm', g('calm').checked); localStorage.setItem('odaiba-afterlines.calm', g('calm').checked ? '1' : ''); };
  ['mute', 'vol', 'ads', 'calm'].forEach(id => g(id).addEventListener('change', upd));
  on('#exp', () => { const t = exportText(); (app.querySelector('#txt') as HTMLTextAreaElement).value = t; navigator.clipboard?.writeText(t).catch(() => {}); app.querySelector('#msg')!.textContent = t ? '書き出しました（クリップボードにもコピー）' : 'セーブがありません'; });
  on('#imp', () => { const f = importText((app.querySelector('#txt') as HTMLTextAreaElement).value); app.querySelector('#msg')!.textContent = f ? '読み込みました' : '読み込めませんでした（形式が違います）'; if (f) S = f.state; });
  on('#del', () => { if (confirm('セーブを削除しますか？')) { clearSave(); S = null; app.querySelector('#msg')!.textContent = '削除しました'; } });
  on('#b', back);
}
document.body.classList.toggle('calm', localStorage.getItem('odaiba-afterlines.calm') === '1');
title();
