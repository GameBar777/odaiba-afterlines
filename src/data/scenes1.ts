import type { Scene, Choice } from '../engine/types';
type L = Array<[string, string]>;
const S = (id: string, chapter: number, bg: string, lines: L, o: Partial<Scene> = {}): Scene => ({ id, chapter, bg, lines, ...o });
const C = (id: string, label: string, next: string, o: Partial<Choice> = {}): Choice => ({ id, label, next, ...o });

// ===== 第0章 その日の朝（日常） =====
export const ch0: Scene[] = [
  S('c0_open', 0, 'morning_home', [
    ['', '{me}の朝は、いつも少しだけ慌ただしい。'],
    ['{fam1}', 'ねえ、今日帰り何時？'],
    ['{me}', 'たぶん七時くらい。'],
    ['{fam1}', '{fam2}がね、昨日から「餃子の日」って言ってるの。'],
  ], { alt: [{ if: { preset: 'student' }, goto: 'c0_open_st' }, { if: { preset: 'parent' }, goto: 'c0_open_pa' }],
    choices: [
      C('promise', '「七時までに帰る。約束する」', 'c0w_m1', { icon: '🤙', effects: { flag: 'promise', mental: 5 }, hint: '小さな約束' }),
      C('maybe', '「仕事次第かな」', 'c0w_m1', { icon: '🤷', effects: { mental: -2 } }),
    ] }),
  S('c0_open_st', 0, 'morning_home', [
    ['', '{me}、二十歳。今日は授業が休講で、昼から、サークルのOBで十四歳上の先輩・拓海とお台場へ行く。'],
    ['{fam1}', '（メッセージ）夜7時、{meet}ね。遅刻したら罰ゲーム'],
    ['{fam2}', '葵ちゃん、帰りにまたお茶飲みにおいで。羊羹あるから。'],
  ], { choices: [
      C('promise', '「7時ちょうどに行く。絶対」と返す', 'c0s_m1', { icon: '🤙', effects: { flag: 'promise', mental: 5 } }),
      C('grandma', 'おばあちゃんに「週末寄るね」と約束する', 'c0s_m1', { icon: '🍵', effects: { flag: ['promise', 'promise_grandma'], mental: 5 } }),
    ] }),
  S('c0_open_pa', 0, 'morning_home', [
    ['', '休日。{me}は息子の{fam2}と二人でお台場へ行く約束をしていた。'],
    ['{fam2}', 'パパ、きょう、うみ みる？'],
    ['{fam1}', '私は夜勤明けからそのまま日勤。迎えに行けなくてごめんね。'],
  ], { choices: [
      C('promise', '「夕飯までには二人で帰るよ」', 'c0p_m1', { icon: '🤙', effects: { flag: 'promise', mental: 5 } }),
    ] }),
  S('c0_meet_talk', 0, 'morning_home', [
    ['{fam1}', 'そういえば……もし大きい地震が来たら、どこで会うか決めてないよね。'],
    ['{fam1}', 'テレビでやってたの。電話はつながらないって。'],
  ], { choices: [
      C('decide', '「{meet}にしよう。あと171に残す」と決める', 'c0_route', { icon: '📍', effects: { flag: 'meetpoint', know: ['k_meetpoint', 'k_171'], report: { cat: 'contact', score: 2, note: '事前に集合場所と171の利用を決めていた' } }, hint: '後で効く' }),
      C('later', '「今度ちゃんと決めよう」', 'c0_route', { icon: '⏳', effects: { report: { cat: 'contact', score: -1, note: '集合場所を決めずに出かけた（多くの家庭と同じ）' } } }),
    ] }),
  S('c0_commute', 0, 'odaiba_morning', [
    ['', 'ゆりかもめの窓から、レインボーブリッジと海が見える。'],
    ['', '埋立地の街は、平らで、広くて、明るい。'],
    ['拓海', 'よっ。今日、晴れてよかったな。'],
  ], { onEnter: { time: 120, loc: 'park' }, next: 'c0_walk' }),
  S('c0_walk', 0, 'promenade', [
    ['', '昼休み、拓海と海沿いの遊歩道を歩いた。砂浜で子供たちがはしゃいでいる。'],
    ['拓海', 'なあ……俺さ。'],
    ['拓海', '……いや、なんでもない。また今度話す。'],
    ['', '風が強い。拓海は何か言いかけて、海を見た。'],
  ], { choices: [
      C('photo', '「せっかくだし撮ろうぜ」と二人で写真を撮る', 'c0_lunch', { icon: '📷', effects: { photo: 'promenade_two', time: 20 } }),
      C('ask', '「言えよ、気になる」と聞く', 'c0_walk_secret', { icon: '💬', effects: { npc: { id: 'friend', trust: 10 }, time: 20 } }),
      C('skip', '黙って隣を歩く', 'c0_lunch', { icon: '🚶', effects: { time: 20 } }),
    ] }),
  S('c0_walk_secret', 0, 'promenade', [
    ['拓海', '来月から大阪に転勤なんだ。言い出せなくてさ。'],
    ['拓海', 'だから今日は、お台場の景色、ちゃんと見ときたくて。'],
  ], { onEnter: { flag: 'friend_secret', photo: 'promenade_two' }, next: 'c0_lunch' }),
  S('c0_lunch', 0, 'mall_food', [
    ['', 'シーサイドモール台場（架空の施設）。3階のフードコートは平日でもにぎわっている。'],
    ['', '壁に小さな「避難経路図」が貼ってある。いつも素通りしている紙だ。'],
  ], { onEnter: { loc: 'mall', time: 30 }, choices: [
      C('map', '避難経路図をスマホで撮っておく', 'c0_mall', { icon: '🗺', effects: { flag: 'knows_exit', item: 'map_paper', report: { cat: 'items', score: 1, note: '施設の避難経路を確認した' }, battery: -1 }, hint: '数秒でできる備え' }),
      C('eat', 'ラーメンの列に並ぶ', 'c0_mall', { icon: '🍜' }),
    ] }),
  S('c0_call', 0, 'family_call', [
    ['', 'ビデオ通話が鳴る。'],
    ['{fam2}', 'みてみて！'],
  ], { alt: [{ if: { preset: 'parent' }, goto: 'c0_call_pa' }, { if: { preset: 'student' }, goto: 'c0_call_st' }], onEnter: { time: 30 },
    lines: [['', 'ビデオ通話。学校の昼休みに、{fam1}のスマホから{fam2}が顔を出した。'], ['{fam2}', 'パパ！きょう図工で、おうちの絵かいたの。パパとママとひなと、餃子。'], ['{fam1}', '「餃子の日」だからね。早く帰ってきてよ。']],
    choices: [
      C('shot', 'スクリーンショットを撮る', 'c0_shop', { icon: '📷', effects: { photo: 'family_call', mental: 5 } }),
      C('smile', '「楽しみにしてる」と笑う', 'c0_shop', { icon: '😊', effects: { mental: 5 } }),
    ] }),
  S('c0_call_st', 0, 'family_call', [
    ['', '祖母のふみから、珍しくビデオ通話。'],
    ['{fam2}', '葵ちゃん、このボタンでいいのかい？……映ってる？'],
    ['{fam2}', '箪笥の上の写真、葵ちゃんの七五三。ほら。'],
  ], { choices: [
      C('shot', '笑って画面を撮る', 'c0_shop', { icon: '📷', effects: { photo: 'family_call', mental: 5 } }),
      C('furniture', '「その箪笥、地震で倒れない？固定しようよ」', 'c0_shop', { icon: '🧰', effects: { flag: 'warned_furniture', know: 'k_furniture', mental: 2 } }),
    ] }),
  S('c0_call_pa', 0, 'family_call', [
    ['', '{fam2}が砂浜で拾った貝がらを、{fam1}にビデオ通話で見せている。'],
    ['{fam1}', 'きれいね。ママの分もとっておいて。'],
    ['{fam2}', 'うん！ママのは、いちばん大きいの。'],
  ], { onEnter: { photo: 'family_call' }, next: 'c0_shop' }),
  S('c0_shop', 0, 'shop', [
    ['', 'モールの雑貨店。レジ横にモバイルバッテリーと、折りたたみのスニーカーが並んでいる。'],
  ], { choices: [
      C('battery', 'モバイルバッテリーを買う', 'c0_before', { icon: '🔋', if: { noItem: 'battery_pack' }, effects: { item: 'battery_pack', report: { cat: 'items', score: 1, note: 'モバイルバッテリーを持っていた' } } }),
      C('shoes', '歩きやすい靴に履き替える', 'c0_before', { icon: '👟', if: { item: 'leather_shoes' }, effects: { item: 'sneakers', useItem: 'leather_shoes', report: { cat: 'items', score: 1, note: '歩きやすい靴に替えていた' } } }),
      C('none', '特に買わない', 'c0_before', { icon: '🙅' }),
    ] }),
  S('c0_before', 0, 'mall_window', [
    ['', '午後。日差しが傾きはじめる。'],
    ['拓海', '最後にどこ寄る？'],
  ], { alt: [{ if: { preset: 'parent' }, goto: 'c0p_before' }], onEnter: { time: 30 }, choices: [
      C('cafe', '3階の窓際カフェで休む', 'c1_pre', { icon: '☕', effects: { flag: 'at_window', loc: 'mall' } }),
      C('elev', '展望デッキへ、エレベーターで上がる', 'c1_pre', { icon: '🛗', effects: { flag: 'at_elevator', loc: 'mall' } }),
      C('beach', 'もう一度、海浜公園へ', 'c1_pre', { icon: '🏖', effects: { flag: 'at_beach', loc: 'park' } }),
    ] }),
];

// ===== 第1章 発災 =====
export const ch1: Scene[] = [
  S('c1_eew', 1, 'quake', [
    ['', '（ここからは架空の地震シナリオです）'],
    ['', 'ポケットのスマホが鳴る——と同時に、床が下から突き上げた。'],
    ['', '速報が間に合っていない。震源が近い。'],
  ], { setT: 0, fx: 'quake', next: 'c1_where' }),
  S('c1_where', 1, 'quake', [['', '…']], { alt: [{ if: { flag: 'at_elevator' }, goto: 'c1_elev' }, { if: { flag: 'at_beach' }, goto: 'c1_beach' }, { if: {}, goto: 'c1_cafe' }] }),
  S('c1_cafe', 1, 'quake_indoor', [
    ['', '窓ガラスが波打つ。棚から食器が滝のように落ちる。'],
    ['拓海', 'うわっ——！'],
    ['', '立っていられない。どうする？'],
  ], { fx: 'quake', choices: [
      C('cover', 'テーブルの下にもぐり、頭を守る', 'c1_end', { icon: '🛡', hint: '低く・守る・動かない', effects: { flag: 'head_protected', know: ['k_drop', 'k_eew'], report: { cat: 'safety', score: 3, note: '揺れの最中、テーブルの下で頭を守った' } } }),
      C('shout', '「拓海、伏せろ！」と叫んでから自分も伏せる', 'c1_end', { icon: '📣', effects: { flag: ['head_protected', 'friend_safe'], npc: { id: 'friend', trust: 10 }, know: 'k_drop', report: { cat: 'safety', score: 3, note: '周囲に声をかけ、自分も身を守った' } } }),
      C('run', '出口へ走る', 'c1_end', { icon: '🏃', effects: { risk: { kind: 'crowd', level: 22, label: '揺れの中で走り、人と衝突して転倒' }, know: ['k_drop', 'k_crowd'], report: { cat: 'safety', score: -3, note: '揺れの最中に走った（転倒・落下物の危険）' } } }),
      C('phone', '窓際で家族に電話をかける', 'c1_end', { icon: '📱', effects: { risk: { kind: 'glass', level: 30, label: '窓ガラスが割れて降りかかった' }, know: ['k_window', 'k_comm'], report: { cat: 'safety', score: -3, note: '揺れの最中に窓際で電話をかけようとした' } } }),
    ] }),
  S('c1_elev', 1, 'elevator', [
    ['', 'エレベーターが大きく揺れ、ガコン、と止まりかける。'],
    ['', '階の表示が消えた。かごの中には、あなたと拓海と、小さな男の子。'],
  ], { fx: 'quake', choices: [
      C('buttons', '全ての階のボタンを押す', 'c1_elev2', { icon: '🔢', effects: { flag: 'elev_out', know: 'k_elevator', report: { cat: 'safety', score: 3, note: 'エレベーターで全階のボタンを押した' } } }),
      C('pry', 'ドアをこじ開けようとする', 'c1_elev2', { icon: '✋', effects: { flag: 'elev_stuck', risk: { kind: 'fall', level: 18, label: '揺れでかごが動き、手と頭を打った' }, know: 'k_elevator', report: { cat: 'safety', score: -2, note: 'エレベーターのドアを無理にこじ開けようとした' } } }),
    ] }),
  S('c1_elev2', 1, 'elevator', [
    ['', '揺れが少し弱まる。'],
  ], { alt: [{ if: { flag: 'elev_out' }, goto: 'c1_elev_out' }], lines: [['', 'かごは階の途中で止まった。暗い。男の子が泣き出す。']],
    choices: [
      C('intercom', 'インターホンで連絡し、男の子を落ち着かせて待つ', 'c1_end', { icon: '☎', effects: { time: 40, mental: -5, flag: ['rescued_elev', 'met_hiroto'], helped: 'hiroto_calm', report: { cat: 'safety', score: 2, note: '閉じ込め時にインターホンで連絡し、落ち着いて待った' }, know: 'k_whistle' } }),
      C('whistle', '笛を吹いて外に知らせる', 'c1_end', { icon: '😗', if: { item: 'whistle' }, effects: { time: 25, flag: ['rescued_elev', 'met_hiroto'], report: { cat: 'items', score: 2, note: '笛で居場所を知らせた' }, know: 'k_whistle' } }),
    ] }),
  S('c1_elev_out', 1, 'elevator', [['', 'かごは最寄りの階で止まり、扉が開いた。男の子の手を引いて、三人でフロアに降りる。']], { onEnter: { flag: 'met_hiroto' }, next: 'c1_end' }),
  S('c1_beach', 1, 'beach_quake', [
    ['', '地面が波のようにうねる。街灯がしなり、ヤシの木が大きく揺れる。'],
    ['', '海の向こうで、ビルの窓が一斉にきらめいた。'],
  ], { fx: 'quake', alt: [{ if: { preset: 'parent' }, goto: 'c1_beach_pa' }], choices: [
      C('open', '倒れてくる物のない砂浜の真ん中で、低い姿勢をとる', 'c1_end', { icon: '🧎', effects: { flag: 'head_protected', know: ['k_outdoor', 'k_drop'], report: { cat: 'safety', score: 3, note: '屋外で倒れてくる物から離れて身を低くした' } } }),
      C('tree', '近くの街灯につかまる', 'c1_end', { icon: '🪝', effects: { risk: { kind: 'fall', level: 20, label: '揺れる街灯の部品が落ちてきた' }, know: 'k_outdoor', report: { cat: 'safety', score: -2, note: '揺れる街灯につかまった' } } }),
    ] }),
  S('c1_beach_pa', 1, 'beach_quake', [
    ['', '{fam2}が砂の上で転び、悲鳴を上げる。'],
    ['{fam2}', 'パパぁ！'],
  ], { fx: 'quake', choices: [
      C('cover_child', '{fam2}に覆いかぶさり、自分の頭も腕で守る', 'c1_end', { icon: '🫂', effects: { flag: ['head_protected', 'child_safe'], know: ['k_outdoor', 'k_drop'], report: { cat: 'safety', score: 3, note: '子供に覆いかぶさり、周囲に倒れる物のない場所で身を低くした' } } }),
      C('carry_run', '{fam2}を抱えてモールへ走る', 'c1_end', { icon: '🏃', effects: { risk: { kind: 'glass', level: 26, label: 'モールの外壁ガラスが落ちてきた' }, know: ['k_outdoor', 'k_window'], report: { cat: 'safety', score: -3, note: '揺れの最中にガラス張りの建物へ走った' } } }),
    ] }),
  S('c1_end', 1, 'mall_damage', [
    ['', '……揺れが、止まった。たぶん一分か、それ以上。時間の感覚がない。'],
    ['', '耳鳴り。遠くで誰かが泣いている。焦げたにおい。停電した天井の非常灯だけが白い。'],
  ], { onEnter: { time: 3, mental: -15 }, alt: [{ if: { flag: 'at_beach' }, goto: 'c1_end_out' }], choices: [
      C('friend', '拓海の様子を確かめる', 'c1_friend', { icon: '🧍' }),
    ] }),
  S('c1_end_out', 1, 'beach_after', [
    ['', '……揺れが止まった。砂浜のあちこちから、泥水がにじみ出ている。'],
    ['', '遊歩道に段差ができ、モールの方から煙が上がっていた。'],
  ], { onEnter: { time: 3, mental: -15, know: 'k_liquefaction' }, choices: [C('friend', 'そばにいる人の様子を確かめる', 'c1_friend', { icon: '🧍' })] }),
  S('c1_friend', 1, 'mall_damage', [
    ['拓海', '……いってぇ。大丈夫、かすり傷。お前は？'],
  ], { alt: [{ if: { preset: 'parent' }, goto: 'c1_friend_pa' }], onEnter: { flag: 'friend_with_me' }, next: 'c1_after' }),
  S('c1_friend_pa', 1, 'beach_after', [
    ['{fam2}', '……パパ、こわかった。'],
    ['', 'そこへ、学生時代の友人・拓海が駆けてきた。偶然、近くのイベントの仕事で来ていたという。'],
    ['拓海', '健司！律くんも無事か！'],
  ], { onEnter: { flag: 'friend_with_me' }, next: 'c1_after' }),
  S('c1_selfcheck', 1, 'mall_damage', [
    ['', '自分の体を確かめる。'],
  ], {
    choices: [
      C('treat', 'ハンカチで傷を強く押さえて止血する', 'c2_start', { icon: '🩹', if: { anyFlag: ['exposed_glass', 'exposed_crowd', 'exposed_fall'] }, effects: { heal: 'cut_leg', time: 5, know: 'k_bleeding', report: { cat: 'aid', score: 2, note: '自分の出血をすぐ圧迫止血した' } } }),
      C('ok', '大きなけがはない。周りを見る', 'c2_start', { icon: '👀' }),
    ], chapterEnd: true, lesson: ['k_drop', 'k_window', 'k_eew', 'k_shindo_m'] }),
];

// ===== 第2章 直後（〜2時間） =====
export const ch2: Scene[] = [
  S('c2_start', 2, 'mall_damage', [
    ['', '発災から数分。館内放送が途切れ途切れに流れる。'],
    ['放送', '……ただいま……安全を確認……その場で……'],
    ['', 'フードコートの奥から、黒い煙。'],
  ], { alt: [{ if: { flag: 'at_beach' }, goto: 'c2_start_out' }], choices: [
      C('ext', '近くの消火器を取り、火元へ向かう', 'c2_fire', { icon: '🧯', effects: { item: 'extinguisher' } }),
      C('away', '煙から離れ、低い姿勢で反対側へ移動', 'c2_saeki', { icon: '↘', effects: { time: 5, know: 'k_smoke', flag: 'fire_spread', report: { cat: 'evac', score: 1, note: '煙から低い姿勢で離れた' } } }),
      C('shout_fire', '「火事だ！」と大声で知らせ、非常ベルを押す', 'c2_saeki', { icon: '🔔', effects: { time: 5, flag: ['fire_alarm', 'fire_spread'], report: { cat: 'aid', score: 2, note: '火災を周囲に知らせた' }, know: 'k_smoke' } }),
    ] }),
  S('c2_start_out', 2, 'beach_after', [
    ['', '海浜公園。人々が呆然と立ち尽くし、モールの方を見ている。煙が上がっている。'],
    ['', '水際に人だかり。「海の様子を見よう」と誰かが言う。'],
  ], { onEnter: { flag: 'fire_spread' }, choices: [
      C('away_sea', '海から離れ、モール前の広場へ移動する', 'c2_saeki', { icon: '↗', effects: { time: 10, loc: 'mall', know: 'k_tsunami', report: { cat: 'evac', score: 2, note: '揺れの後、すぐ海から離れた' } } }),
      C('look_sea', '水際へ行って海を見る', 'c2_saeki', { icon: '🌊', effects: { time: 10, risk: { kind: 'water', level: 18, label: '液状化で崩れた護岸の段差に足をとられ、海水に落ちかけた' }, know: 'k_tsunami', report: { cat: 'evac', score: -3, note: '発災直後に海の様子を見に行った' } } }),
    ] }),
  S('c2_fire', 2, 'smoke', [
    ['', '厨房の油が燃えている。炎はまだ腰の高さ。'],
  ], { choices: [
      C('spray', '安全ピンを抜き、火元にホースを向けて噴射', 'c2_fire_res', { icon: '🧯', effects: { useItem: 'extinguisher', flag: 'fire_out', time: 3, know: 'k_fire_initial', report: { cat: 'aid', score: 2, note: '小さな火のうちに初期消火を試みた' } } }),
      C('retreat', '炎が大きくなりそうだ。消火をあきらめ避難', 'c2_saeki', { icon: '↩', effects: { flag: 'fire_spread', time: 3, know: 'k_fire_initial', report: { cat: 'evac', score: 1, note: '初期消火の限界を判断して離れた' } } }),
    ] }),
  S('c2_fire_res', 2, 'smoke', [
    ['', '白い粉が舞う。炎は小さくなり——消えた。'],
    ['', 'しかし、奥の別の店から、また煙が上がる。一人では無理だ。'],
  ], { onEnter: { flag: 'fire_spread', risk: { kind: 'fire', level: 8, label: '煙を少し吸い込んだ' } }, next: 'c2_saeki' }),
  S('c2_saeki', 2, 'injured', [
    ['', '倒れた陳列棚の横に、高齢の男性がうずくまっている。ズボンの裾が赤い。'],
    ['佐伯', '……大丈夫だ。自分でなんとかする。迷惑はかけん。'],
    ['', '出血が床に広がっている。'],
  ], { choices: [
      C('press', 'ハンカチで傷口を直接強く押さえる', 'c2_saeki_ok', { icon: '🩹', effects: { useItem: 'handkerchief', time: 15, helped: 'saeki', flag: 'stayed_saeki', npc: { id: 'saeki', trust: 30 }, know: 'k_bleeding', report: { cat: 'aid', score: 3, note: '負傷した高齢者を直接圧迫で止血した' } }, hint: '自分の避難は遅れる' }),
      C('call', '大声で医療関係者を探す', 'c2_saeki_ok', { icon: '📣', effects: { time: 10, flag: 'stayed_saeki', npc: { id: 'saeki', trust: 10 }, report: { cat: 'aid', score: 2, note: '周囲に応援を求めた' } } }),
      C('pass', '「すぐ人を呼びます」と言って先を急ぐ', 'c2_boy', { icon: '🚶', effects: { time: 2, mental: -5, report: { cat: 'aid', score: -1, note: '負傷者のそばを離れた（呼びに行った人はいなかった）' } } }),
    ] }),
  S('c2_saeki_ok', 2, 'injured', [
    ['早瀬', '看護師です。代わります。——押さえ方、合ってます。そのまま。'],
    ['', '早瀬と名乗った女性は、素早く佐伯さんの脚を確認した。'],
    ['佐伯', '……すまんな。女房の命日でな。毎年、あの店で天ぷらを食うんだ。'],
    ['早瀬', '救護所へ運びます。手伝ってもらえますか。'],
  ], { onEnter: { npc: [{ id: 'hayase', trust: 20 }, { id: 'saeki', loc: 'aid' }], know: ['k_head', 'k_119'] }, choices: [
      C('carry', '佐伯さんを支えて救護所へ同行する', 'c2_boy', { icon: '🤝', effects: { time: 30, stamina: -10, helped: 'saeki', flag: 'escort_saeki', npc: { id: 'hayase', trust: 10 }, report: { cat: 'care', score: 2, note: '負傷者を救護所まで支えた' } } }),
      C('leave_nurse', '早瀬に任せ、拓海と状況を確かめに行く', 'c2_boy', { icon: '👋', effects: { time: 5, helped: 'saeki' } }),
    ] }),
  S('c2_boy', 2, 'child', [
    ['', '吹き抜けの下で、小学生くらいの男の子が一人、柱にしがみついて泣いている。'],
    ['大翔', '……おとうさん、いない……'],
  ], { alt: [{ if: { flag: 'met_hiroto' }, goto: 'c2_boy_known' }], choices: [
      C('staff', '手をつないで、迷子対応の施設職員のところへ連れて行く', 'c2_stairs', { icon: '🧒', effects: { time: 15, helped: 'hiroto', npc: { id: 'hiroto', trust: 30, loc: 'staff' }, report: { cat: 'care', score: 3, note: 'はぐれた子供を施設職員に引き継いだ' } } }),
      C('take', '一緒に父親を探しながら行動する', 'c2_stairs', { icon: '🔍', effects: { time: 30, stamina: -5, helped: 'hiroto', flag: 'hiroto_with_me', report: { cat: 'care', score: 1, note: '子供と一緒に保護者を探した（混乱の中で連れ歩くリスクもある）' } } }),
      C('leave', '自分のことで精一杯だ。通り過ぎる', 'c2_stairs', { icon: '😔', effects: { mental: -8 } }),
    ] }),
  S('c2_boy_known', 2, 'child', [
    ['大翔', '（エレベーターで一緒だった男の子が、あなたの袖をつかんで離さない）'],
    ['大翔', 'ぼく、くろだ ひろと。おとうさん、いない。'],
  ], { choices: [
      C('staff', '施設職員のところへ一緒に行く', 'c2_stairs', { icon: '🧒', effects: { time: 15, helped: 'hiroto', report: { cat: 'care', score: 3, note: 'はぐれた子供を施設職員に引き継いだ' } } }),
    ] }),
  S('c2_info', 2, 'phone_sns', [
    ['', 'スマホを見る。電波は1本。タイムラインが異様な速さで流れていく。'],
    ['森本', 'おい見ろよ！有明のでかい会場が燃えてるって！橋も落ちたって！海沿いから回れば早い、行くぞ！'],
  ], { info: ['i_sns_bridge', 'i_sns_fire', 'i_off_tsunami', 'i_fac_stay', 'i_sns_water'], onEnter: { time: 10, battery: -3 }, choices: [
      C('verify', '投稿の発信元と時刻を確かめ、公式の発表と見比べる', 'c2_morimoto', { icon: '🔎', effects: { flag: 'verified_info', know: ['k_official', 'k_rumor', 'k_tsunami'], report: { cat: 'info', score: 3, note: 'SNS投稿の発信元・時刻を確認し、公式情報と照合した' } } }),
      C('share', '「拡散希望」をそのまま転送する', 'c2_morimoto', { icon: '🔁', effects: { flag: 'spread_rumor', know: 'k_rumor', report: { cat: 'info', score: -3, note: '未確認の情報を拡散した' } } }),
      C('radio', '電池を節約するため画面を消す', 'c2_morimoto', { icon: '🔅', effects: { flag: 'phone_saving', know: 'k_battery', report: { cat: 'items', score: 1, note: 'スマホの電池を節約した' } } }),
    ] }),
  S('c2_morimoto', 2, 'phone_sns', [
    ['森本', '兄貴が有明にいるんだよ！待ってらんねえ！'],
    ['', '海沿いの遊歩道は、さっき段差と泥水が見えた場所だ。それに「津波注意報（ゲーム内の架空情報）」が出ている。'],
  ], { choices: [
      C('stop', '「その情報、発信元が分からない。海沿いは注意報が出てる」と止める', 'c2_wait1', { icon: '✋', if: { flag: 'verified_info' }, effects: { flag: 'stopped_morimoto', helped: 'morimoto', npc: { id: 'morimoto', trust: 20 }, report: { cat: 'info', score: 2, note: '誤情報で危険な場所へ向かう人を止めた' } } }),
      C('stop2', '「行くな」と腕をつかむ', 'c2_wait1', { icon: '🫷', if: { notFlag: 'verified_info' }, effects: { npc: { id: 'morimoto', trust: -10 }, mental: -3 }, result: '森本は腕を振りほどいて走っていった。根拠を示せなかった。' }),
      C('follow', '自分も一緒に海沿いへ向かう', 'c2_shore', { icon: '🌊', effects: { report: { cat: 'evac', score: -3, note: '未確認情報を信じて海沿いへ向かった' } } }),
      C('let', '黙って見送る', 'c2_wait1', { icon: '…' }),
    ] }),
  S('c2_shore', 2, 'beach_after', [
    ['', '遊歩道は波打ち、マンホールが突き出し、泥水が足首まで来た。'],
    ['', '岸辺の手すりは外れていた。海面が、いつもより高い。'],
  ], { onEnter: { loc: 'promenade', time: 20, risk: { kind: 'liquefaction', level: 25, label: '液状化した遊歩道で転倒' }, know: ['k_liquefaction', 'k_tsunami'] }, choices: [
      C('back', '引き返す', 'c2_contact', { icon: '↩', effects: { time: 20, risk: { kind: 'water', level: 12, label: '濡れた体が冷えてきた' } } }),
      C('push', 'そのまま有明まで進む', 'c2_contact', { icon: '➡', effects: { time: 40, risk: { kind: 'water', level: 22, label: '崩れた護岸で海水に転落しかけた' }, report: { cat: 'evac', score: -3, note: '危険を認識しながら水際を進んだ' } } }),
    ] }),
  S('c2_contact', 2, 'phone_171', [
    ['', '{fam1}に電話をかける。'],
    ['', '「ただいま、大変電話が混み合っており……」'],
    ['', 'もう一度。同じ音声。'],
  ], { onEnter: { time: 5, battery: -2, know: 'k_comm' }, choices: [
      C('171_stay', '171に「無事。お台場の施設にいる。むやみに動かない」と録音する', 'c2_fam_cut', { icon: '☎', effects: { msg: { to: 'fam1', channel: '171', text: '{me}です。無事。お台場にいます。安全な場所にとどまって、落ち着いたら連絡する。{fam2}をお願い。' }, flag: 'stay_decided', know: 'k_171', report: { cat: 'contact', score: 3, note: '171に居場所と方針を録音した' } } }),
      C('web171', 'web171に「無事・台場・動かない」と登録する', 'c2_fam_cut', { icon: '🌐', if: { minBattery: 5 }, effects: { msg: { to: 'fam1', channel: 'web171', text: '無事です。台場にいます。今は動きません。{meet}のこと、覚えてる。' }, flag: 'stay_decided', know: 'k_web171', report: { cat: 'contact', score: 3, note: 'web171に伝言を登録した' }, battery: -2 } }),
      C('sms', '「今から帰る！」とメッセージを送る', 'c2_fam_cut', { icon: '💬', effects: { msg: { to: 'fam1', channel: 'sms', text: '今から歩いて帰る！待ってて' }, flag: 'said_coming', report: { cat: 'contact', score: 0, note: 'メッセージで「今から帰る」と送った（届かない可能性・移動のリスク）' } } }),
      C('redial', 'つながるまでかけ続ける', 'c2_fam_cut', { icon: '🔁', effects: { battery: -12, time: 20, mental: -6, report: { cat: 'contact', score: -2, note: 'つながらない電話をかけ続け、電池と時間を消耗した' } } }),
    ] }),
  S('c2_fam_cut', 2, 'family_away', [
    ['', '——その頃。'],
  ], { alt: [{ if: { preset: 'student' }, goto: 'c2_fam_cut_st' }, { if: { preset: 'parent' }, goto: 'c2_fam_cut_pa' }],
    lines: [['', '——その頃、{homeArea}。{fam1}は職場の机の下から這い出し、真っ先に{fam2}の小学校へ向かっていた。'], ['{fam1}', '（学校は子供を守ってくれる。慌てないで。……それでも、早く顔が見たい）'], ['', '校庭には、訓練どおり整列した子供たち。{fam2}は先生の手を握っていた。']],
    onEnter: { know: 'k_school' }, next: 'c2w_cut2' }),
  S('c2_fam_cut_st', 2, 'family_away', [
    ['', '——その頃、世田谷。'],
    ['', '古い家の居間で、箪笥が倒れていた。'],
    ['{fam2}', '（……葵ちゃんに、羊羹……）'],
  ], { alt: [{ if: { flag: 'warned_furniture' }, goto: 'c2_fam_cut_st2' }], next: 'c2s_cut2' }),
  S('c2_fam_cut_st2', 2, 'family_away', [
    ['', '——その頃、世田谷。'],
    ['', 'ふみは、昼間の電話のあと、気になって箪笥の前の座布団をどけ、寝る場所を変えていた。'],
    ['', '倒れた箪笥は、誰もいない場所に横たわっている。'],
  ], { onEnter: { npc: { id: 'fam2', injured: false }, flag: 'grandma_safe' }, next: 'c2s_cut2' }),
  S('c2_fam_cut_pa', 2, 'family_away', [
    ['', '——その頃、品川の病院。'],
    ['', '{fam1}は、運び込まれる負傷者の色分け（トリアージ）に入っていた。スマホを見る余裕はない。'],
    ['{fam1}', '（健司なら、律を守ってくれる。……そう信じるしかない）'],
  ], { next: 'c2p_cut2' }),
  S('c2_end', 2, 'crowd', [
    ['', '発災からおよそ二時間。'],
    ['', '鉄道は止まっている。道路には車があふれ、サイレンが途切れない。'],
  ], { onEnter: { time: 60 }, chapterEnd: true, lesson: ['k_comm', 'k_171', 'k_official', 'k_bleeding', 'k_fire_initial', 'k_tsunami'], next: 'c3_hub' }),
];
