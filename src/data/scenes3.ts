import type { Scene, Choice } from '../engine/types';
type L = Array<[string, string]>;
const S = (id: string, chapter: number, bg: string, lines: L, o: Partial<Scene> = {}): Scene => ({ id, chapter, bg, lines, ...o });
const C = (id: string, label: string, next: string, o: Partial<Choice> = {}): Choice => ({ id, label, next, ...o });
const R = (id: string, chapter: number, alt: Scene['alt']): Scene => ({ id, chapter, bg: 'crowd', lines: [['', '…']], alt });

// ============================================================
// 第3章 拡張：プリセット別の夜（一時滞在施設）・徒歩帰宅・救護所
// 舞台の施設・学校・病院・店舗・掲示物はすべて架空。
// ============================================================
export const ch3x: Scene[] = [
  // --- 施設の夜：プリセット別に分岐 ---
  R('c3_eve', 3, [
    { if: { preset: 'worker' }, goto: 'c3w_eve' },
    { if: { preset: 'student' }, goto: 'c3s_eve' },
    { if: {}, goto: 'c3p_eve' },
  ]),

  // ---- 会社員：宮下 湊 ----
  S('c3w_eve', 3, 'facility', [
    ['', '午後八時。ホールの非常灯の下で、宮内が名簿を数え直している。三度目だ。'],
    ['宮内', '……すみません。家に、寝たきりの父がいるもので。数えていないと、そっちばかり考えてしまう。'],
    ['', 'スマホの電池表示が、じわりと減っていく。南砂までは、地図の上では指二本ぶん。歩けば何時間かかるのか、夜の道がどうなっているのか、誰にも分からない。'],
    ['', '千夏は、たぶん陽菜の学校にいる。陽菜は、たぶん泣いていない。「たぶん」を三つ重ねて、ようやく息ができた。'],
  ], { onEnter: { know: ['k_web171', 'k_school'] }, choices: [
      C('web171', 'web171に「青海ホールにいる。明るくなってから歩いて帰る。学校で待ってて」と登録する', 'c3w_eve2', { icon: '🌐', if: { minBattery: 5 }, effects: { msg: { to: 'fam1', channel: 'web171', text: '湊です。青海ホール（一時滞在施設）にいます。けがはありません。明るくなってから歩いて帰ります。陽菜の学校で待っていてください。' }, flag: 'wk_told_plan', report: { cat: 'contact', score: 3, note: '自分の居場所と今後の行動予定を伝言板に残した' } } }),
      C('sms', '千夏にメッセージを何度も送り直す', 'c3w_eve2', { icon: '📱', effects: { battery: -6, msg: { to: 'fam1', channel: 'sms', text: '大丈夫？　どこにいる？　返事して' }, report: { cat: 'contact', score: -1, note: '混雑中にメッセージを送り直して電池を消耗した' } } }),
      C('night_walk', '名簿の数字を見ていられない。今から歩いて帰る', 'c3_walk1', { icon: '🌙', if: { notFlag: 'turned_back' }, effects: { flag: 'walking', loc: 'aomi', unflag: 'supplied', report: { cat: 'stay', score: -3, note: '夜間に一時滞在施設を出て徒歩帰宅を始めた' } } }),
    ] }),
  S('c3w_eve2', 3, 'facility', [
    ['', '宮内に、充電の列の場所を尋ねる。彼は少しだけ笑った。'],
    ['宮内', '父には、ヘルパーさんが毎晩来てくれることになってるんです。……来てくれていれば、ですが。'],
    ['', '同じだ、と思った。人はみんな、誰かの「たぶん」を抱えてここに座っている。'],
  ], { choices: [
      C('help_miyauchi', '「名簿、手伝います」と記録を分担する', 'c3_eve_end', { icon: '📝', effects: { time: 40, npc: { id: 'miyauchi', trust: 25, flag: 'helped' }, helped: 'miyauchi', report: { cat: 'care', score: 2, note: '一時滞在施設の受付・名簿づくりを手伝った' } }, result: '名簿は、家族の問い合わせに答えるための命綱になる。宮内は「助かります」と短く頭を下げた。' }),
      C('save_phone', '省電力にして、明朝に備えて眠る', 'c3_eve_end', { icon: '🔋', effects: { flag: 'phone_saving', stamina: 10, know: 'k_battery', report: { cat: 'items', score: 1, note: '翌朝の移動に備えてスマホの電池を温存した' } } }),
    ] }),

  // ---- 大学生：佐倉 葵 ----
  S('c3s_eve', 3, 'facility', [
    ['', '品川駅の港南口。七時に、と言った。いまは八時を過ぎている。'],
    ['', '蓮はきっと、あの柱の前にいる。寒がりのくせに、上着を持ってこない人だ。約束を守る人だ。だから、きっと、まだいる。'],
    ['', 'それが嬉しくて、怖い。'],
    ['リン', '（多言語の案内を配りながら）……電話、つながらない？　171なら、相手の番号に声を置いておけるよ。わたしも、ベトナムの母に毎晩そう教えてる。'],
  ], { onEnter: { know: ['k_171', 'k_comm'] }, choices: [
      C('171ren', '171で蓮の番号に「港南口で待たないで。近くの一時滞在施設に移って」と録音する', 'c3s_eve2', { icon: '☎', effects: { msg: { to: 'fam1', channel: '171', text: '葵です。無事です。港南口で待たないで。近くの一時滞在施設に入って、朝まで動かないで。私も動かない。' }, report: { cat: 'contact', score: 3, note: '待ち合わせ相手に「動かないで安全な場所へ」と伝言した' } } }),
      C('sms_ren', '「待ってて、すぐ行くから」とメッセージを打つ', 'c3s_eve2', { icon: '📱', effects: { msg: { to: 'fam1', channel: 'sms', text: '待ってて、すぐ行くから' }, flag: 'said_coming', report: { cat: 'contact', score: -2, note: '相手をその場に縛る「すぐ行く」を送った' } } }),
    ] }),
  S('c3s_eve2', 3, 'phone_171', [['', '…']], { alt: [{ if: { flag: 'msg_fam1', notFlag: 'said_coming' }, goto: 'c3s_ren_ok' }, { if: {}, goto: 'c3s_gma' }] }),
  S('c3s_ren_ok', 3, 'phone_171', [
    ['', '録音の終わりを告げる音声が流れる。受話器の向こうに蓮はいない。ただ、声だけが、どこかの棚に置かれた。'],
    ['', '「待たないで」と言うのは、「会いたくない」と言うことではない。そう分かってくれる人だと、信じるしかない。'],
  ], { onEnter: { flag: 'fam1_moved_safe', mental: 6 }, next: 'c3s_gma' }),
  S('c3s_gma', 3, 'phone_171', [
    ['', '次は、祖母の家の番号。'],
    ['', '「お預かりしている伝言はありません」'],
    ['', '祖母は携帯を持たない。171の使い方も、たぶん知らない。週末に教えればよかった——と思いかけて、やめた。今は、明日のことだけを考える。'],
  ], { alt: [{ if: { flag: 'grandma_safe' }, goto: 'c3s_gma_safe' }, { if: { flag: 'fam2_trapped' }, goto: 'c3s_gma_hurt' }], next: 'c3_eve_end' }),
  S('c3s_gma_safe', 3, 'phone_171', [
    ['{fam2}', '（録音・少し早口で）……ふみです。お隣さんに教わってね、これ、入ってるのかしら。箪笥は倒れたけど、ばあちゃんは無事。葵ちゃんが言うから寝床を変えておいたの。羊羹は、ちょっとつぶれたわ。'],
    ['', '笑ったのか泣いたのか、自分でも分からなかった。'],
  ], { onEnter: { mental: 20, flag: 'heard_gma' }, next: 'c3_eve_end' }),
  S('c3s_gma_hurt', 3, 'phone_171', [
    ['', '（録音・知らない男性の声）……ふみさんのお隣の者です。ご家族の方へ。箪笥の下からね、いま皆でふみさんを出しました。意識はあります。消防が来られないので、近所の車で病院へ向かいます。病院の名前は——'],
    ['', '雑音で、そこだけが聞き取れなかった。'],
    ['', '伝言は三十秒で切れる。最後に、祖母の小さな声が混じっていた気がした。「葵ちゃんに、言わないで」。'],
  ], { onEnter: { mental: -15, flag: 'knows_gma_hurt', know: 'k_crush' }, next: 'c3_eve_end' }),

  // ---- 父親：安藤 健司と律 ----
  S('c3p_eve', 3, 'night_shelter', [
    ['', '律は、段ボールの上で膝を抱えている。昼間あれほど拾った貝がらを、ひとつずつポケットから出しては、また戻す。'],
    ['律', 'ママ、きょう、おしごと？'],
    ['', '美咲は品川の病院（架空）にいる。けが人が運ばれてくれば、持ち場を離れられない人だ。それを五歳にどう言えばいいのか、四十一年生きても分からない。'],
    ['小野寺', '（赤ちゃんを揺らしながら）……うちの子も、さっきから泣きやまなくて。すみません、うるさいですよね。'],
  ], { onEnter: { know: 'k_vulnerable' }, choices: [
      C('letter', '「ママはけがした人を助けてる」と伝え、律と一緒に「ママへの手紙」を描く', 'c3p_eve2', { icon: '🖍', effects: { flag: 'ritsu_letter', mental: 8, npc: { id: 'fam2', trust: 15 }, report: { cat: 'care', score: 2, note: '子どもに状況を短く本当のことばで伝え、気持ちを表す時間をつくった' } }, result: '律は青いクレヨンで、大きな丸を三つ描いた。「パパと、ぼくと、ママ。いちばん大きいのがママ」。' }),
      C('together', '小野寺さんと交代で子どもを見ることにし、律に「赤ちゃんのお兄さん役」を頼む', 'c3p_eve2', { icon: '🤝', effects: { helped: 'onodera', flag: 'ritsu_brother', npc: [{ id: 'onodera', trust: 30 }, { id: 'fam2', trust: 10 }], know: 'k_privacy', report: { cat: 'care', score: 2, note: '乳児連れの母親と交代で見守り、互いに休む時間をつくった' } }, result: '律は、結の小さな手に人差し指を握られて、背筋を伸ばした。役目がある子どもは、少しだけ強くなる。' }),
      C('distract', '「大丈夫、すぐ会えるよ」と言い、スマホの動画を見せる', 'c3p_eve2', { icon: '📱', effects: { battery: -10, mental: -3, report: { cat: 'items', score: -1, note: '子どもを落ち着かせるために電池を大きく消費した' } }, result: '動画が終わると、律は前より大きな声で泣いた。「すぐ」は、五歳にとって約束だった。' }),
    ] }),
  S('c3p_eve2', 3, 'night_shelter', [['', '…']], { alt: [{ if: { flag: 'helped_hiroto' }, goto: 'c3p_hiroto' }, { if: {}, goto: 'c3p_msg' }] }),
  S('c3p_hiroto', 3, 'night_shelter', [
    ['', '入口のほうから、見覚えのある小さな背中が歩いてくる。昼間、手を引いた子——大翔だ。隣には父親の黒田がいる。'],
    ['大翔', '……あ。'],
    ['', '大翔は律の前にしゃがみ、ポケットから折りたたんだ紙を出しかけて、またしまった。代わりに、ラムネを一粒差し出した。'],
    ['黒田', 'あのときは……本当に。息子を、叱ったばかりだったんです。'],
    ['', '律と大翔は、言葉より先に、貝がらとラムネを交換した。'],
  ], { onEnter: { mental: 12, npc: [{ id: 'kuroda', trust: 20 }, { id: 'hiroto', trust: 20 }], flag: 'ritsu_hiroto' }, next: 'c3p_msg' }),
  S('c3p_msg', 3, 'phone_171', [
    ['', '律が眠ったあと、web171を開く。美咲の名前で、一件。'],
    ['{fam1}', '（伝言）美咲です。病院は無事。今夜は帰れません。律をお願い。あなたを信じてる。……律に、ママは怒ってないよって。'],
    ['', '「怒ってない」。今朝、出がけに律が牛乳をこぼして、美咲は少しだけ声を荒らげた。彼女は、一日中それを気にしていたのだ。'],
  ], { onEnter: { know: 'k_web171' }, choices: [
      C('reply', '「律は眠った。けがはない。明日、明るくなったら病院へ向かう」と返信を登録する', 'c3_eve_end', { icon: '🌐', if: { minBattery: 3 }, effects: { msg: { to: 'fam1', channel: 'web171', text: '健司です。律と青海ホールにいます。二人ともけがなし。律はさっき眠りました。明日、明るくなってから品川へ向かいます。無理しないで。' }, report: { cat: 'contact', score: 3, note: '家族に居場所・状態・次の行動を伝言した' } } }),
      C('noreply', '電池が心もとない。返信は朝にする', 'c3_eve_end', { icon: '🔋', effects: { flag: 'phone_saving', mental: -4 } }),
    ] }),

  // --- 友人・拓海の夜（生存して一緒にいる場合） ---
  R('c3_eve_end', 3, [
    { if: { npcAlive: 'friend', notFlag: ['friend_left', 'takumi_talk'] }, goto: 'c3_takumi' },
    { if: {}, goto: 'c3_mid' },
  ]),
  S('c3_takumi', 3, 'night_shelter', [
    ['', '自販機の明かりだけが点いている廊下。拓海が、売り切れの赤いランプを見上げていた。'],
    ['拓海', 'なあ。……俺、来月から大阪なんだ。言うタイミング、ずっと探してて。今日の夜、海見ながら言うつもりだった。'],
    ['拓海', 'で、今日これだろ。昼に煙の中に戻ろうとしたの、たぶん、何かしてから行きたかったんだよな。何もしないで東京を出るのが、いやで。'],
  ], { choices: [
      C('go', '「行けよ。で、向こうで、今日のことを誰かに話せ」', 'c3_mid', { icon: '✈', effects: { flag: ['takumi_talk', 'takumi_blessed'], npc: { id: 'friend', trust: 20 }, mental: 6 }, result: '拓海は鼻をすすって、「お前、たまにいいこと言うよな」と笑った。' }),
      C('quiet', '何も言わず、自販機の前に並んで座る', 'c3_mid', { icon: '🌌', effects: { flag: 'takumi_talk', npc: { id: 'friend', trust: 10 }, mental: 4 }, result: '余震が来て、二人同時に壁に手をついた。それがなぜか可笑しくて、少しだけ笑った。' }),
    ] }),

  // --- 徒歩：プリセット別の入口 ---
  S('c3s_walk', 3, 'liquefaction', [
    ['', '有明の交差点。人の流れは東へ向かっている。でも、品川は西だ。海の向こうだ。'],
    ['', '湾をまたぐ橋の入口には、カラーコーンと警備員。「点検のため通行止め（ゲーム内の架空の規制）」。'],
    ['武藤', '品川？　……今夜は、ここからじゃ無理だ。橋がだめなら、ぐるっと回って何十キロだぞ。'],
  ], { onEnter: { loc: 'ariake', time: 40, know: ['k_walk_home', 'k_liquefaction'] }, choices: [
      C('back', '青海ホールへ引き返す', 'c3_hall', { icon: '↩', effects: { unflag: 'walking', loc: 'aomi_hall', time: 40, flag: ['stay_decided', 'turned_back'], report: { cat: 'stay', score: 2, note: '通行止めを確認して一時滞在施設へ引き返した' } } }),
      C('east', '人の列について東へ歩き続ける', 'c3_walk2', { icon: '🚶', effects: { time: 30, risk: { kind: 'liquefaction', level: 10, label: '噴砂でぬかるんだ歩道で足を取られた' }, report: { cat: 'evac', score: -2, note: '目的地と逆方向へ群衆についていった' } } }),
    ] }),
  S('c3p_walk', 3, 'liquefaction', [
    ['', '律を肩車して歩き出して、三十分。首の後ろに、律の頬の熱が重なる。'],
    ['律', 'パパ、さむい。……おしっこ。'],
    ['', '歩道は噴き出した砂でぬかるみ、段差のたびに律の体が揺れる。暗くなれば、足元は見えなくなる。品川までは、橋が使えなければ遠回りの道しかない。'],
    ['', '大人一人なら「行ける」と思えた距離が、五歳を背負うと、まったく違う距離になる。'],
  ], { onEnter: { loc: 'ariake', time: 30, stamina: -12, know: ['k_walk_home', 'k_vulnerable'] }, choices: [
      C('back', '律の手を握り直し、一時滞在施設へ引き返す', 'c3_hall', { icon: '↩', effects: { unflag: 'walking', loc: 'aomi_hall', time: 40, flag: ['stay_decided', 'turned_back'], report: { cat: 'stay', score: 3, note: '子連れの夜間徒歩をやめ、一時滞在施設に戻った' } }, result: '戻る道のほうが短く感じた。律はホールの入口で、もう半分眠っていた。' }),
      C('push', '「もう少しだけ頑張ろう」と歩き続ける', 'c3_walk2', { icon: '🏃', effects: { time: 40, risk: { kind: 'exhaustion', level: 12, label: '子どもを背負ったまま段差で膝をついた' }, npc: { id: 'fam2', trust: -10 }, mental: -8, report: { cat: 'evac', score: -3, note: '幼児を連れて夜間の長距離徒歩を続けた' } } }),
    ] }),
  R('c3_walk2b', 3, [
    { if: { preset: 'worker', notFlag: 'calmed_bando' }, goto: 'c3w_bando' },
    { if: { preset: 'worker' }, goto: 'c3w_station' },
    { if: {}, goto: 'c3_walk2' },
  ]),
  S('c3w_bando', 3, 'walk_night', [
    ['', '東雲のあたり。動かない車の列が、赤いテールランプの川になっている。'],
    ['', 'クラクションを鳴らし続けている一台。運転席の男に見覚えがあった。施設で職員に詰め寄っていた——坂東だ。'],
    ['坂東', '……一時間で百メートルだぞ。女房が病院にいるんだ。俺が行かなきゃ、誰が行くんだよ。'],
    ['', '交差点の先には「緊急交通路（ゲーム内の架空表示）」の看板と警察官。救急車が、車の列の隙間を縫えずに止まっている。'],
  ], { onEnter: { loc: 'toyosu', time: 30, know: 'k_traffic' }, choices: [
      C('car_rule', '「車を置いて行きましょう。左に寄せて、キーは付けたまま、ドアはロックしないで」', 'c3w_station', { icon: '🔑', effects: { flag: 'bando_car_left', npc: { id: 'bando', trust: 25, flag: 'left_car' }, helped: 'bando', know: 'k_car_leave', time: 20, report: { cat: 'evac', score: 3, note: 'やむを得ず車を置く人に、緊急車両を妨げない置き方を伝えた' } }, result: '坂東は長いこと黙っていたが、やがてハンドルを切って車を左へ寄せた。キーを差したまま、窓を閉め、ロックはせずに降りてきた。「……途中まで、一緒に歩いていいか」。' }),
      C('pass', '関わらずに先を急ぐ', 'c3w_station', { icon: '🚶', effects: { mental: -3 } }),
    ] }),
  S('c3w_station', 3, 'walk_night', [
    ['', '辰巳を抜けると、道は運河にぶつかる。橋のたもとに、人が小さな群れになって座り込んでいた。'],
    ['', '誰かがラジオを持っている。音量を絞った声が、知らない区の火災を読み上げる（ゲーム内の架空の放送）。'],
    ['', '南砂まで、あと数キロ。地図を見なくても分かる距離に来て、足が初めて止まった。ここまで、千夏と陽菜のことしか考えていなかった。この先にある自分の街が、どうなっているのかを、考えるのが怖かった。'],
  ], { fx: 'dark', onEnter: { time: 20 }, next: 'c3_walk2' }),

  // --- 救護所：父親は律を連れている ---
  S('c3p_aid', 3, 'aid', [
    ['', '臨時の救護所。ブルーシートの端に段ボールを敷き、律を寝かせる。毛布の下から、小さな寝息。'],
    ['早瀬', '子連れで手伝うの？　……じゃあ、ここから動かずにできることを。記録と、水の配布。お子さんから目を離さない範囲で。'],
    ['大川', '（消防隊員・架空）挟まれていた時間が長い人は、救出後に急変することがある。医療につなぐまで目を離さないで。'],
  ], { onEnter: { know: ['k_crush', 'k_119', 'k_aed'], flag: 'supplied', water: 20, time: 120 }, choices: [
      C('record', '律の隣で、負傷者の名前と状態を記録する', 'c3_aid_mid', { icon: '📝', effects: { report: { cat: 'aid', score: 2, note: '子どもから目を離さずにできる救護の手伝いをした' }, npc: { id: 'hayase', trust: 15 } } }),
      C('rest', '律が起きたときにそばにいるため、横で休む', 'c3_aid_mid', { icon: '😴', effects: { stamina: 15, npc: { id: 'fam2', trust: 10 } } }),
    ] }),
];

// ============================================================
// 第4章 拡張：会社員の南砂、大学生の二つの約束、父親の品川
// ============================================================
export const ch3y: Scene[] = [
  // ---- 救護所の夜明け前（c3_aid2 のプリセット別）----
  S('c3w_aid2', 3, 'aid', [
    ['', '夜明け前。早瀬が、はじめて床に座り込んだ。手袋を外した指が、小さく震えている。'],
    ['早瀬', '……息子と、まだ連絡が取れないの。十歳。看護師なのに、自分の子のところにだけは行けない。'],
    ['', '陽菜は八歳だ。二つしか違わない。その顔が浮かんで、あなたは言葉を探すのをやめた。'],
  ], { choices: [
      C('web171', '早瀬の代わりにweb171で息子の学校名を検索する', 'c4_dawn', { icon: '🌐', if: { minBattery: 10 }, effects: { battery: -4, npc: { id: 'hayase', trust: 20, flag: 'son_found' }, report: { cat: 'contact', score: 2, note: '他者の安否確認を手伝った' } }, result: '学校の伝言板に「児童は全員校内で保護」の書き込みがあった（ゲーム内架空情報）。早瀬は顔を覆い、それから、何事もなかったように手袋をはめ直した。' }),
      C('sit', '隣に座り、水を渡す', 'c4_dawn', { icon: '💧', effects: { npc: { id: 'hayase', trust: 10 } }, result: '早瀬は一口だけ飲んで、「東北に行ったときも、こうやって誰かが水をくれた」とだけ言った。' }),
    ] }),
  S('c3s_aid2', 3, 'aid', [
    ['', '夜明け前。早瀬が、はじめて床に座り込んだ。'],
    ['早瀬', 'あなた、学生さん？……よく動いてくれた。私の息子もね、あと十年したら、あなたくらいになる。まだ、連絡が取れないけど。'],
    ['', '大人も、こんなふうに怖がるのだ。そう知ったことが、なぜか少しだけ、あなたを強くした。'],
  ], { choices: [
      C('web171', '「わたし、探してみます」web171で息子さんの学校名を検索する', 'c4_dawn', { icon: '🌐', if: { minBattery: 10 }, effects: { battery: -4, npc: { id: 'hayase', trust: 25, flag: 'son_found' }, report: { cat: 'contact', score: 2, note: '他者の安否確認を手伝った' } }, result: '学校の伝言板に「児童は全員校内で保護」の書き込み（ゲーム内架空情報）。早瀬はあなたの肩に手を置き、「ありがとう。あなたのおばあさんも、きっと誰かが見てる」と言った。' }),
      C('sit', '隣に座り、黙って水を渡す', 'c4_dawn', { icon: '💧', effects: { npc: { id: 'hayase', trust: 10 }, mental: 2 } }),
    ] }),
  S('c3p_aid2', 3, 'aid', [
    ['', '夜明け前。律は毛布の中で、あなたの上着の裾を握ったまま眠っている。'],
    ['', '早瀬が、はじめて床に座り込んだ。視線が、律の寝顔に止まる。'],
    ['早瀬', '……うちの子は十歳。まだ、連絡が取れない。あなたは、そばにいられてよかったね。'],
    ['', 'その「よかったね」には、責める響きはひとつもなかった。だから余計に、胸に刺さった。'],
  ], { choices: [
      C('web171', '律を起こさないよう片手で、web171で息子さんの学校名を検索する', 'c4_dawn', { icon: '🌐', if: { minBattery: 10 }, effects: { battery: -4, npc: { id: 'hayase', trust: 20, flag: 'son_found' }, report: { cat: 'contact', score: 2, note: '子どもを見ながら他者の安否確認を手伝った' } }, result: '「児童は全員校内で保護」（ゲーム内架空情報）。早瀬は声を出さずに泣き、律が寝返りを打つと、反射のように毛布を掛け直してくれた。' }),
      C('sit', '律を抱いたまま、早瀬に水を差し出す', 'c4_dawn', { icon: '💧', effects: { npc: { id: 'hayase', trust: 10 } } }),
    ] }),
  // ---- 一時滞在施設の深夜（c3_night のプリセット別導入）----
  S('c3w_night', 3, 'night_shelter', [
    ['', '深夜。また揺れる。余震だ。誰かが小さく悲鳴を上げ、すぐに静かになった。'],
    ['', 'スマホの壁紙で、陽菜が笑っている。明日は誕生日の一週間前だった、と思い出す。'],
    ['', '隣で、若い女性が同じように画面を握りしめていた。'],
    ['春野', '……母と、朝、喧嘩したんです。「もう帰ってこない」って言っちゃって。'],
  ], { fx: 'aftershock', onEnter: { time: 300, know: ['k_aftershock', 'k_dvt', 'k_water'] }, choices: [
      C('171play', '171の使い方を教え、一緒に伝言を確認する', 'c3_171', { icon: '☎', effects: { helped: 'haruno', flag: 'helped_haruno_any', npc: { id: 'haruno', trust: 30 }, report: { cat: 'contact', score: 2, note: '他の人に171の使い方を教えた' } }, result: '「お母さんも、あなたの声を探してると思う」。言いながら、それは自分に向けた言葉でもあった。' }),
      C('listen', '黙って話を聞く', 'c3_171', { icon: '🤲', effects: { npc: { id: 'haruno', trust: 15 }, mental: 3 } }),
    ] }),
  S('c3s_night', 3, 'night_shelter', [
    ['', '深夜。また揺れる。余震だ。毛布の端を握る手に、自分で驚くほど力が入った。'],
    ['', '隣で、少し年上の女性がスマホを見つめている。画面には、送れなかったメッセージ。'],
    ['春野', '……母と、朝、喧嘩したんです。「もう帰ってこない」って言っちゃって。……子どもみたいでしょ。'],
    ['', '子どもみたいなのは自分も同じだ、と思った。祖母に、週末の約束を「たぶん」と返したままだった。'],
  ], { fx: 'aftershock', onEnter: { time: 300, know: ['k_aftershock', 'k_dvt', 'k_water'] }, choices: [
      C('171play', '「わたしもさっき覚えたんです」171の使い方を一緒に確かめる', 'c3_171', { icon: '☎', effects: { helped: 'haruno', flag: 'helped_haruno_any', npc: { id: 'haruno', trust: 30 }, report: { cat: 'contact', score: 2, note: '他の人に171の使い方を教えた' } } }),
      C('listen', '黙って隣にいる', 'c3_171', { icon: '🤲', effects: { npc: { id: 'haruno', trust: 15 }, mental: 3 } }),
    ] }),
  S('c3p_night', 3, 'night_shelter', [
    ['', '深夜。また揺れる。余震だ。律が跳ね起き、あなたの胸に顔を押しつけた。'],
    ['', '背中をとん、とん、と叩く。そのリズムだけは、体が覚えていた。'],
    ['', '隣で、若い女性がスマホを握りしめている。'],
    ['春野', '……ごめんなさい、うるさくて。母と、朝、喧嘩したんです。「もう帰ってこない」って。'],
  ], { fx: 'aftershock', onEnter: { time: 300, know: ['k_aftershock', 'k_dvt', 'k_water'] }, choices: [
      C('171play', '律を抱いたまま、171の使い方を教える', 'c3_171', { icon: '☎', effects: { helped: 'haruno', flag: 'helped_haruno_any', npc: { id: 'haruno', trust: 30 }, report: { cat: 'contact', score: 2, note: '他の人に171の使い方を教えた' } }, result: '眠りかけた律が「ママにも、でんわする？」と聞いた。春野は、泣きながら笑った。' }),
      C('listen', '黙って話を聞く', 'c3_171', { icon: '🤲', effects: { npc: { id: 'haruno', trust: 15 }, mental: 3 } }),
    ] }),
];

export const ch4x: Scene[] = [
  // ---- 会社員：南砂に着く ----
  S('c4w_arrive', 4, 'dawn', [
    ['', '夜が明けた。足の裏の皮が、靴の中でずるりと動く。'],
    ['', '見覚えのある歩道橋。その下を、昨日まで毎朝くぐっていた。手すりが一本、ねじれている。'],
  ], { setT: 960, onEnter: { flag: ['net_restored', 'supplied'], unflag: 'walking', water: 20, loc: 'home', time: 30 }, next: 'c4w_town' }),
  S('c4w_town', 4, 'reunion', [
    ['', '江東区、南砂（実在の地名。以下の建物・学校・店はすべて架空）。'],
    ['', '団地の中庭に、住民が集まっていた。毛布にくるまった人、ラジオを囲む人、給水の列（ゲーム内の想定）に並ぶ人。ブロック塀が一か所、歩道側へ倒れていて、誰かが段ボールに「キケン」と書いて立てかけている。'],
    ['', 'いつも陽菜が手を振ってくる三階のベランダ。洗濯物は、昨日の朝のまま揺れていた。'],
    ['田辺', '（腕章をつけて）宮下さん？　宮下さんよね！　歩いてきたの、お台場から？　……まあ。奥さんたちは——ちょっと待って、名簿名簿。'],
  ], { onEnter: { know: ['k_outdoor', 'k_shelter_vs_place'], npc: { id: 'tanabe', trust: 10 } }, choices: [
      C('meet', '決めておいた「{meet}」へ走る', 'c4_wk_meet', { icon: '📍', if: { flag: 'meetpoint' }, effects: { time: 15 } }),
      C('school', '陽菜の小学校（架空・避難所）へ向かう', 'c4w_school', { icon: '🏫', effects: { time: 20 } }),
      C('home', 'まず自宅マンションを見に行く', 'c4_wk_search', { icon: '🏠', effects: { time: 10 } }),
    ] }),
  S('c4w_school', 4, 'shelter_life', [['', '…']], { alt: [{ if: { flag: 'meetpoint' }, goto: 'c4w_school_meet' }, { if: {}, goto: 'c4w_school_found' }] }),
  S('c4w_school_meet', 4, 'shelter_life', [
    ['', '校門の掲示板。ガムテープで貼られた紙が何十枚も重なっている。'],
    ['先生', '宮下陽菜ちゃんのお父さん？　お母さんと一緒に、朝早くに出ましたよ。「決めてある場所がある」って。'],
    ['', '決めてある場所。あの日の昼、冗談みたいに話した場所。'],
  ], { onEnter: { know: 'k_school' }, next: 'c4_wk_meet' }),
  S('c4w_school_found', 4, 'shelter_life', [
    ['', '体育館の入口に、手書きの名簿が貼られている（架空の避難所）。指でたどる。「宮下 千夏」「宮下 陽菜（2年）」。'],
    ['', '体育館の奥。見慣れたピンクの上履きが、毛布の端からのぞいていた。'],
    ['{fam2}', '……パパ？'],
    ['{fam1}', '陽菜、昨日の夜ね、ずっと「パパは歩くのおそいから」って言ってたの。……ほんとに、おそいよ。'],
    ['', '千夏は笑おうとして、うまくいかなかった。'],
  ], { photoShow: 'family_call', onEnter: { mental: 25, flag: 'reunited_family', know: 'k_school' }, next: 'c4w_house' }),
  S('c4w_house', 4, 'rebuild', [
    ['', '自宅マンションの入口に、黄色い紙が貼られていた。「要注意」。'],
    ['', '（ゲーム内の架空の判定表示。実際の応急危険度判定は区市町村が実施し、赤「危険」・黄「要注意」・緑「調査済」の表示で、当面の立入りの可否を知らせる）'],
    ['{fam1}', '中、見てないの。陽菜の薬と、通帳と……あと、あの子のうさぎ。'],
    ['', 'また揺れた。小さい。でも、外壁のひびから、ぱらぱらと何かが落ちた。'],
  ], { fx: 'aftershock', onEnter: { know: ['k_okyu', 'k_aftershock'] }, choices: [
      C('quick', '家族は外に残し、自分だけ短時間入る。必要な物だけ取り、出るときにブレーカーを落とす', 'c4w_talk', { icon: '⚡', effects: { time: 30, risk: { kind: 'fall', level: 6, label: '廊下に落ちていた照明カバーで手を切りかけた' }, item: 'radio', flag: ['breaker_off', 'got_usagi'], know: 'k_breaker', report: { cat: 'safety', score: 3, note: '「要注意」の建物に短時間だけ入り、ブレーカーを落として出た' } }, result: 'うさぎのぬいぐるみは、倒れた本棚の隙間にいた。玄関でブレーカーのレバーを下ろす。カチン、という音が、妙に大きく響いた。' }),
      C('long', '今のうちに片付けながら、運べる物を全部運び出す', 'c4w_talk', { icon: '📦', effects: { time: 150, stamina: -20, risk: { kind: 'collapse', level: 12, label: '余震で棚が倒れ、頭をかばった腕を打った' }, flag: 'got_usagi', report: { cat: 'safety', score: -3, note: '余震が続く中、傷んだ建物に長時間とどまった' } } }),
      C('stay_out', '入らない。うさぎは、あとで迎えに来ると陽菜に約束する', 'c4w_talk', { icon: '🚫', effects: { mental: -4, npc: { id: 'fam2', trust: 5 }, report: { cat: 'safety', score: 2, note: '判定表示を見て、傷んだ建物に入らなかった' } }, result: '陽菜は唇をかんで、それから小さくうなずいた。「うさちゃん、ひとりで平気だよね。おうちの係だもんね」。' }),
    ] }),
  S('c4w_talk', 4, 'night_shelter', [
    ['', 'その夜、体育館。陽菜は千夏の膝で眠っている。'],
    ['{fam1}', '……ねえ。こんなときに言うことじゃないけど。私、仕事、辞めようか迷ってたの。昨日、学校まで走りながら、ずっと思ってた。職場から陽菜のところまで、こんなに遠かったんだって。'],
    ['', '千夏の手が、陽菜の髪をなでる。その指先に、昨日の泥がまだ残っていた。'],
  ], { choices: [
      C('wait', '「今は決めなくていい。落ち着いたら、三人で決めよう」', 'c4w_card', { icon: '🕰', effects: { flag: 'wk_decide_later', npc: { id: 'fam1', trust: 15 }, mental: 5 } }),
      C('support', '「千夏が決めたことなら、どっちでも一緒に考える。俺の働き方も含めて」', 'c4w_card', { icon: '🤝', effects: { flag: 'wk_both_change', npc: { id: 'fam1', trust: 25 }, mental: 8 } }),
    ] }),
  S('c4w_card', 4, 'night_shelter', [
    ['', '千夏が、自分のリュックの底から、少しよれた封筒を出した。'],
    ['{fam1}', '陽菜がね、ランドセルに入れてたの。避難のときも、これだけは絶対持つって。……来週、あなたの誕生日でしょ。'],
    ['', '封筒には、鉛筆で「パパへ　まだあけないで」。'],
    ['', 'あけなかった。来週、ちゃんと、家族そろって開ける日まで。'],
  ], { onEnter: { flag: 'hina_card', mental: 10 }, next: 'c4w_hina_night' }),

  // ---- 大学生：二つの約束 ----
  S('c4s_dawn', 4, 'dawn', [
    ['', '朝。運転再開の見込み（ゲーム内の架空情報）が貼り出される。品川へも、世田谷へも、今日なら向かえる。'],
    ['', 'でも、体は一つしかない。'],
    ['', '港南口で待っているかもしれない蓮。病院にいるかもしれない祖母。どちらを先にするかは、どちらを後にするかということだ。'],
  ], { choices: [
      C('ren_first', '先に品川へ。蓮を確かめてから、世田谷へ', 'c4_st', { icon: '🚉', effects: { flag: 'st_ren_first' } }),
      C('gma_first', '先に祖母のもとへ。蓮には171で行き先を残していく', 'c4s_gma', { icon: '🏥', effects: { flag: 'st_gma_first', time: 240, msg: { to: 'fam1', channel: '171', text: '葵です。先におばあちゃんのところへ行きます。夕方、品川へ行く。待っていなくていいから、安全な場所にいて。' }, report: { cat: 'contact', score: 2, note: '行き先と予定を伝言してから移動した' } } }),
    ] }),
  S('c4s_gma', 4, 'family_away', [['', '…']], { alt: [{ if: { flag: 'fam2_trapped', notFlag: 'grandma_safe' }, goto: 'c4s_gma_bed' }, { if: {}, goto: 'c4s_gma_ok' }] }),
  S('c4s_gma_bed', 4, 'aid', [
    ['', '世田谷の病院（架空）。廊下まで簡易ベッドが並んでいる。'],
    ['', '祖母は、思っていたより小さかった。点滴の管が、細い腕に二本。'],
    ['{fam2}', '……葵ちゃん。来たの。だめよ、蓮くん、待たせちゃ。'],
    ['', '長く挟まれていた脚の影響で、容体が安定しないのだと看護師は言った。助け出されたあとに急変することがある、と。昨日、救護所で聞いた言葉と同じだった。'],
    ['{fam2}', '羊羹ね、台所の、いちばん上の棚。……週末、来てくれるって言ったから。'],
    ['', '手を握った。冷たくて、でも、ちゃんと握り返してきた。'],
    ['', 'その日の夕方、祖母は眠るように息を引き取った。最後まで、手は離さなかった。'],
  ], { onEnter: { npc: { id: 'fam2', alive: false }, flag: 'gma_with_me', mental: -20, know: ['k_crush', 'k_furniture'], time: 300 }, next: 'c4s_ren_late' }),
  S('c4s_gma_ok', 4, 'reunion', [
    ['', '世田谷。祖母の家の前で、近所の人たちが倒れた塀を片付けていた。'],
    ['{fam2}', 'あら、葵ちゃん。……まあ、蓮くんを放ってきたの？　ばかねえ、ばあちゃんは逃げやしないよ。'],
    ['', '倒れた箪笥は、誰もいない場所に横たわっている。祖母は、つぶれた羊羹を半分に切って、包んで持たせた。'],
    ['{fam2}', '半分は蓮くんの。ほら、早く行きなさい。'],
  ], { onEnter: { mental: 15, time: 120 }, next: 'c4s_ren_late' }),
  S('c4s_ren_late', 4, 'reunion', [['', '…']], { alt: [{ if: { flag: 'fam1_moved_safe' }, goto: 'c4_st_safe' }, { if: {}, goto: 'c4s_ren_cold' }] }),
  S('c4s_ren_cold', 4, 'reunion', [
    ['', '夕方の品川駅、港南口。'],
    ['', '蓮は、柱の前に座っていた。丸一日、ほとんど動かずに。'],
    ['{fam1}', '171、聞いた。……聞いたけど、動けなかった。ここを離れたら、もう会えない気がして。'],
    ['', '唇が紫色だった。約束は人を守り、人をその場所に縛りつけもする。'],
  ], { onEnter: { npc: { id: 'fam1', hp: -30, injured: true }, flag: 'reunited_partner', mental: 5, know: ['k_hypothermia', 'k_dvt'] }, next: 'c4s_ren_talk' }),

  // ---- 父親：品川へ ----
  S('c4p_road', 4, 'dawn', [
    ['', '朝。律は、毛布ごと抱き上げても起きなかった。'],
    ['', '一部の路線が運転を再開する見込み（ゲーム内の架空情報）。駅には、もう長い列ができている。'],
    ['', '律の靴ひもを結び直す。昨日の砂が、まだ靴底から落ちてくる。'],
  ], { onEnter: { know: 'k_official' }, choices: [
      C('line', '情報を確かめ、運転再開を待って列に並ぶ', 'c4p_train', { icon: '🚃', effects: { time: 240, report: { cat: 'evac', score: 2, note: '子連れで、公式情報を確認して公共交通の再開を待った' } } }),
      C('walk_day', '明るいうちに、休憩を挟みながら律と歩く', 'c4p_daywalk', { icon: '🚶', effects: { time: 300, stamina: -20, water: -15, npc: { id: 'fam2', trust: -5 }, report: { cat: 'evac', score: 0, note: '日中に休憩を挟みながら子連れで歩いた' } } }),
    ] }),
  S('c4p_misaki', 4, 'aid', [
    ['', '病院の通用口。美咲の白衣の袖は、乾いた誰かの血で茶色くなっていた。'],
      ['{fam1}', '……ごめん。まだ、戻らないといけないの。人が足りなくて。'],
      ['', '律が美咲の脚にしがみつく。美咲はしゃがんで、律の頭に額をつけた。言葉より先に、呼吸の音が重なった。'],
  ], { choices: [
      C('go_back', '「行ってこい。律は俺が見る。避難所で待ってる」', 'c4p_letter', { icon: '🫡', effects: { flag: 'pa_misaki_work', npc: { id: 'fam1', trust: 25 }, report: { cat: 'care', score: 2, note: '医療の現場に戻る家族を支え、子どもの世話を引き受けた' } } }),
      C('ask_stay', '「一晩だけでいい、律のそばにいてやってくれないか」', 'c4p_letter', { icon: '🙏', effects: { flag: 'pa_misaki_stay', npc: { id: 'fam1', trust: -5 }, mental: 5 }, result: '美咲は長い間黙って、それから「上に聞いてくる」と言った。戻ってきた彼女は、三時間だけ、と指を三本立てた。' }),
    ] }),
  S('c4p_letter', 4, 'reunion', [['', '…']], { alt: [{ if: { flag: 'ritsu_letter' }, goto: 'c4p_letter_yes' }, { if: {}, goto: 'c4p_ritsu_night' }] }),
  S('c4p_letter_yes', 4, 'reunion', [
    ['', '律がポケットから、四つにたたんだ紙を出す。青いクレヨンの、三つの丸。'],
    ['律', 'いちばん大きいのが、ママ。'],
    ['', '美咲はそれを白衣の胸ポケットにしまった。その日、彼女はそのポケットに何度も手を当てながら、夜まで働いたという。'],
  ], { onEnter: { mental: 15, flag: 'misaki_has_letter' }, next: 'c4p_ritsu_night' }),
];

// ============================================================
// 第5章 拡張：数週間後、それぞれの暮らし
// ============================================================
export const ch5x: Scene[] = [
  // ---- 第5章の訪問（c5_visit のプリセット別）----
  S('c5w_visit', 5, 'letter', [
    ['', '会社から、一枚のはがきが転送されてきた。差出人は、あの夜の一時滞在施設の宮内。'],
    ['宮内', '（はがき）あの夜、名簿づくりを手伝っていただいた方へ。あの名簿で、十七件の家族の問い合わせに答えることができました。父のところには、翌朝ヘルパーさんが来てくれていたそうです。施設の訓練の手順を、いただいた意見で一つ直しました。'],
    ['', 'はがきの隅に、施設の地図が手描きで添えてあった。「次は、ここに集まってください」と。'],
  ], { onEnter: { mental: 8 }, next: 'c5_visit2' }),
  R('c5_visit', 5, [
    { if: { preset: 'worker', flag: 'helped_miyauchi' }, goto: 'c5w_visit' },
    { if: {}, goto: 'c5_visit2' },
  ]),
  R('c5_visit2', 5, [
    { if: { flag: 'helped_hiroto' }, goto: 'c5_hiroto' },
    { if: { flag: 'helped_haruno' }, goto: 'c5_haruno' },
    { if: {}, goto: 'c5_friend' },
  ]),
  S('c5_haruno', 5, 'letter', [
    ['', 'SNSに、知らないアカウントから短いメッセージが届いた。'],
    ['春野', 'あの夜、隣にいた春野です。母とは、次の日に会えました。「もう帰ってこない」は、ちゃんと取り消しました。171、母にも教えました。母は「録音の声が、思ったより若く聞こえた」って笑ってました。'],
  ], { onEnter: { mental: 6 }, next: 'c5_friend' }),
  // ---- 拓海（c5_friend のプリセット別）----
  S('c5_friend_bless', 5, 'rebuild', [
    ['', '新大阪行きの新幹線ホーム。拓海は、あの夜と同じ上着を着ていた。'],
    ['拓海', '「向こうで、今日のことを誰かに話せ」って、お前言ったろ。……もう三回話した。歓迎会で一回、取引先で二回。'],
    ['拓海', '向こうで防災士の講座、受けてみる。あの日、何もできない自分がいやだったから。'],
    ['', '発車のベルが鳴る。あなたは、海辺で撮った二人の写真を送った。既読は、ドアが閉まる前についた。'],
  ], { photoShow: 'promenade_two', next: 'c5_preset' }),
  S('c5p_friend_ok', 5, 'rebuild', [
    ['拓海', '大阪、行くことにした。……律くん、元気？あの晩、自販機の明かりの下で、お前の上着にくるまって寝てたよな。'],
    ['拓海', '向こうで防災士の講座、受けてみる。お前が律を抱えたまま動いてるの見て、俺は何もできないって思ったから。'],
  ], { photoShow: 'promenade_two', next: 'c5_preset' }),

  R('c5_preset', 5, [
    { if: { preset: 'worker' }, goto: 'c5w' },
    { if: { preset: 'student' }, goto: 'c5s' },
    { if: {}, goto: 'c5p' },
  ]),
  S('c5w', 5, 'rebuild', [['', '…']], { alt: [{ if: { flag: 'breaker_off' }, goto: 'c5w_home' }, { if: {}, goto: 'c5w_fire' }] }),
  S('c5w_fire', 5, 'rebuild', [
    ['', '電気が戻った日の夜、マンションの非常ベルが鳴った。'],
    ['', 'うちの部屋だった。倒れたままの電気ストーブに、床に落ちたカーテンがかぶさっていた。電気が戻った瞬間、ストーブも戻ったのだ。隣の住人が消火器で消し止めてくれた（ゲーム内の架空の出来事）。'],
    ['', 'ブレーカーを、落としていなかった。それだけのことだった。'],
  ], { onEnter: { mental: -10, know: 'k_breaker', flag: 'wk_tsuden' }, next: 'c5w_home' }),
  S('c5w_home', 5, 'rebuild', [
    ['', '日曜日の夜。台所のテーブルに、三人で紙を広げた。「うちの　もしものとき」。陽菜の字で、大きく。'],
    ['{fam2}', 'あつまるばしょ、こうえんのとけいのした。でんごんは、171。パパは、あるくのおそいから、まつ。'],
    ['{fam1}', '最後のは、いらないでしょ。'],
    ['', '紙は冷蔵庫に貼られた。マグネットは、陽菜が選んだうさぎの形だった。'],
  ], { onEnter: { flag: 'meetpoint_after', know: ['k_meetpoint', 'k_furniture'] }, next: 'c5w_card' }),
  S('c5w_card', 5, 'letter', [['', '…']], { alt: [{ if: { flag: 'hina_card' }, goto: 'c5w_card_open' }, { if: {}, goto: 'c5_final' }] }),
  S('c5w_card_open', 5, 'letter', [
    ['', '一週間遅れの誕生日。封筒の中には、クレヨンの絵。地震の前に描かれた、三人と、うさぎ。'],
    ['', '裏には、震える鉛筆の字で書き足しがあった。「パパ　あるいて　かえってきて　えらい」。'],
  ], { alt: [{ if: { flag: 'bando_car_left' }, goto: 'c5w_card_bando' }], onEnter: { mental: 12 }, next: 'c5_final' }),
  S('c5w_card_bando', 5, 'letter', [
    ['', '一週間遅れの誕生日。封筒の中には、クレヨンの絵。三人と、うさぎ。それから、余白に描き足された、知らない男の人が一人。'],
    ['{fam2}', 'これ、パパがあるいてくるとき、いっしょにあるいてくれたひと。パパがはなしてくれたから、かいた。'],
    ['', '描かれた男は、怒ったような顔で、でも、パパと手をつないでいた。'],
  ], { onEnter: { mental: 12 }, next: 'c5_final' }),

  S('c5s', 5, 'rebuild', [['', '…']], { alt: [{ if: { npcDead: 'fam2' }, goto: 'c5s_loss' }, { if: {}, goto: 'c5s_fix' }] }),
  S('c5s_fix', 5, 'rebuild', [
    ['', '週末。約束より三週間遅れて、祖母の家に行った。'],
    ['', '蓮と二人で、箪笥を起こし、L字の金具で壁に留める。祖母は縁側で、それを「大げさねえ」と見ていた。'],
    ['{fam2}', 'で、あんたたち。次は会えなかったら、どうするの。'],
    ['{fam1}', '……171に残して、近くの施設に入る。迎えに行くのは、明るくなってから。'],
    ['', '祖母は満足そうにうなずき、新しい羊羹を三つに切った。'],
  ], { onEnter: { know: ['k_furniture', 'k_meetpoint'], flag: 'st_fixed' }, next: 'c5_final' }),
  S('c5s_loss', 5, 'memorial', [
      ['', '四十九日。祖母の家の台所、いちばん上の棚に、羊羹が一本、残っていた。週末に三人で食べるはずだった、あの羊羹だった。'],
      ['', '蓮が黙って、それを仏壇の前に置いた。線香の煙が、まっすぐに上がった。'],
  ], { choices: [
      C('cut', '羊羹を切って、三つに分ける。祖母の分と、蓮の分と、自分の分', 'c5s_saeki', { icon: '🍵', effects: { mental: 10, flag: 'st_yokan' } }),
      C('keep', '切れない。そのまま、仏壇に供えておく', 'c5s_saeki', { icon: '🕯', effects: { mental: -2, know: 'k_mental' }, result: '切れなくていい、と蓮は言った。悲しみには、決まった速さがない。' }),
    ] }),
  S('c5s_saeki', 5, 'memorial', [['', '…']], { alt: [{ if: { flag: 'helped_saeki', npcAlive: 'saeki' }, goto: 'c5s_saeki_yes' }, { if: {}, goto: 'c5_final' }] }),
  S('c5s_saeki_yes', 5, 'letter', [
    ['', '数日後、一通のはがきが届いた。差出人は、あの日、海辺で助けた佐伯正造。'],
    ['佐伯', '（はがき）妻の命日に、いつもの店で、いつものものを食べました。あの日、あなたがわしを置いていかなかったから、今年も行けた。あなたにも、手を合わせる人がいると聞きました。その人の分も、どうか、ちゃんと食べてください。'],
  ], { onEnter: { mental: 10 }, next: 'c5_final' }),

  S('c5p', 5, 'rebuild', [
      ['', '保育園が再開した日。先生から、律の描いた絵を渡された。題は「じしんのひ」。'],
      ['', '黒い波線の上に、貝がらがたくさん。段ボールの上で、くっついて眠る二人。'],
  ], { choices: [
      C('talk', '律に、あの日のことを聞いてみる', 'c5p_2', { icon: '👂', effects: { know: 'k_mental', flag: 'pa_listened' }, result: '律は「こわかった」と言い、すぐに「でも、パパがよるじゅう、だっこしてくれた」と付け足した。怖かったことと、守られたことは、同じ一日の中にあった。' }),
      C('frame', '何も聞かず、絵を額に入れて飾る', 'c5p_2', { icon: '🖼', effects: { mental: 3 } }),
    ] }),
  S('c5p_2', 5, 'rebuild', [['', '…']], { alt: [{ if: { flag: 'ritsu_brother' }, goto: 'c5p_onodera' }, { if: {}, goto: 'c5p_3' }] }),
  S('c5p_onodera', 5, 'letter', [
    ['小野寺', '（手紙）結は、最近よく笑います。あの夜、律くんが「お兄さん」をしてくれた三時間、私は初めて目を閉じられました。眠れたのは、たった三時間。でも、あの三時間がなかったら、私は朝まで持たなかったと思います。'],
  ], { onEnter: { mental: 8 }, next: 'c5p_3' }),
  S('c5p_3', 5, 'rebuild', [
    ['', '夜勤明けの美咲が、玄関で靴を脱ぎながら言った。'],
    ['{fam1}', 'ねえ、次の休み、三人でお台場行こうか。……海、まだ怖い？'],
    ['律', 'こわくない。こんどは、いちばん大きいかいがら、ママにあげる。'],
  ], { next: 'c5_final' }),
];
