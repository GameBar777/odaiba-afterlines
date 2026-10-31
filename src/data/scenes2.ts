import type { Scene, Choice } from '../engine/types';
type L = Array<[string, string]>;
const S = (id: string, chapter: number, bg: string, lines: L, o: Partial<Scene> = {}): Scene => ({ id, chapter, bg, lines, ...o });
const C = (id: string, label: string, next: string, o: Partial<Choice> = {}): Choice => ({ id, label, next, ...o });

// ===== 第3章 帰宅困難（2時間〜翌朝） =====
export const ch3: Scene[] = [
  S('c3_dusk', 3, 'crowd', [
    ['', '日が、傾いていく。'],
    ['', '広場の人の数は、減るどころか、増えていた。モールから出てきた人。駅から引き返してきた人。橋のたもとまで行って、戻ってきた人。'],
    ['', '風が冷たくなってきた。昼間の服のままの人が、腕をさすっている。誰かが、売り場から出された段ボールを、地面に敷き始めた。それを見て、何人かが、同じようにした。'],
    ['', '遠くの空に、黒い煙が、まだ一本、立ちのぼっている。その煙の根元に、何があるのか、誰も知らない。'],
    ['', 'カラスが一羽、街灯のてっぺんにとまって、じっと人の群れを見下ろしていた。カラスにとっては、今日も、ただの夕方なのかもしれなかった。'],
    ['', 'スマホの画面の時刻を見た。十七時を過ぎていた。ふだんなら、帰りの電車の中で、晩ごはんのことを考えている時間だった。'],
    ['', '晩ごはん。その言葉を思い浮かべたとたん、お腹が鳴った。昼から何も食べていなかった。こんな時にも、体は、ちゃんとお腹をすかせる。それが、なんだか、悔しくて、少しだけ、ありがたかった。'],
    ['', 'ポケットに、飴が一つ入っていた。いつ入れたのか覚えていない、レモン味の飴。口に入れると、すっぱさが、頭の芯まで届いた。'],
    ['', '今夜、どこで眠るのか。そもそも、眠れるのか。考えたくない問いが、夕暮れと一緒に、足元から、ゆっくりとせり上がってくる。'],
  ], { onEnter: { know: 'k_temp_facility' }, next: 'c3_hub' }),
  S('c3_hub', 3, 'crowd', [
    ['拓海', 'なあ。モールの奥に、まだ人が残ってるって。煙の向こうから声がした。'],
    ['拓海', '俺、戻る。昔、救命講習受けたことあるし。'],
  ], { alt: [{ if: { npcDead: 'friend' }, goto: 'c3_announce' }], choices: [
      C('together', '「一人で行くな。一緒に行く」', 'c3_rescue', { icon: '🤝', effects: { npc: { id: 'friend', trust: 10 } } }),
      C('firefighters', '「消防が来てる。煙の中は素人じゃ無理だ。場所を伝えよう」', 'c3_announce', { icon: '🚒', effects: { flag: 'warned_friend', npc: { id: 'friend', trust: 5, flag: 'reported' }, time: 15, know: 'k_119', report: { cat: 'aid', score: 3, note: '取り残された人の情報を消防に伝え、二次災害を避けた' } }, result: '拓海は唇をかんだが、消防隊員に場所を伝えた。数十分後、取り残されていた二人が運び出された。' }),
      C('let', '「……気をつけろよ」と送り出す', 'c3_announce', { icon: '👋', effects: { unflag: 'friend_with_me', flag: 'friend_left', npc: { id: 'friend', loc: 'mall' }, report: { cat: 'aid', score: -1, note: '友人が一人で煙の中へ戻るのを止めなかった' } } }),
    ] }),
  S('c3_rescue', 3, 'smoke', [
    ['', '濡らしたハンカチで口を覆い、低い姿勢で進む。'],
    ['', '倒れた棚の向こうに、若い女性が足を挟まれていた。'],
    ['', '煙は、天井の近くに、厚い層を作っていた。低くしていれば、まだ、息ができる。目が痛い。涙が勝手にあふれてくる。'],
    ['', '女性は、声を出す力も残っていないようだった。それでも、こちらに気づくと、片手を、小さく上げた。'],
    ['拓海', 'せーので持ち上げる！'],
  ], { choices: [
      C('lift', '二人で棚を持ち上げ、引き出す', 'c3_rescue2', { icon: '💪', effects: { time: 15, stamina: -15, risk: { kind: 'fire', level: 14, label: '煙を吸い、熱で腕を焼いた' }, helped: 'haruno', flag: 'rescued_haruno' } }),
      C('shout_ff', '位置を確かめ、すぐ戻って消防に伝える', 'c3_announce', { icon: '🚒', effects: { time: 10, risk: { kind: 'fire', level: 8, label: '煙を少し吸った' }, flag: 'warned_friend', know: ['k_119', 'k_crush'], report: { cat: 'aid', score: 3, note: '要救助者の位置を確認して消防に伝えた' } }, result: '駆けつけた消防隊が女性を救出した。「長く挟まれていた人を無理に引き出さないで正解でした」と隊員は言った。' }),
    ] }),
  S('c3_rescue2', 3, 'smoke', [
    ['', '女性——春野さきを外へ運び出した。煙の中で、拓海が咳き込んでいる。'],
    ['早瀬', '長く挟まれてた？　——なら、すぐ救護所へ。あとで容体が急に変わることがあるの。'],
  ], { onEnter: { know: ['k_crush', 'k_smoke'], report: { cat: 'aid', score: 1, note: '煙の中で救助した（救助はできたが自分たちも負傷のリスクを負った）' } }, next: 'c3_announce' }),
  S('c3_announce', 3, 'facility', [
    ['', '夕方。拡声器を持った職員が叫んでいる。'],
    ['宮内', '青海ホール（※架空の施設）を、一時滞在施設として開放します！　帰宅が難しい方は、むやみに移動せず、こちらへ！'],
    ['', 'スマホには「鉄道各線運転見合わせ」「一斉帰宅の抑制を」という表示（ゲーム内の架空情報）。'],
    ['', 'それでも、人の流れは、橋の方へ向かっていた。「歩けば帰れる」。誰かがそう言うと、まわりの何人かが、うなずいた。'],
    ['', 'あなたの足も、一瞬、そちらへ動きかけた。家。家族。ベッド。帰りたい理由なら、いくらでもあった。'],
    ['宮内', '歩いて帰るのは、明日、状況が分かってからでも遅くありません！　今夜、道路は救急車と消防車のために空けてください！'],
    ['', 'その言葉に、立ち止まる人がいた。立ち止まらない人もいた。どちらが正しいのか、その時のあなたには、まだ分からなかった。'],
    ['', 'ホールの入口には、手書きの紙が貼られていた。「水・毛布あります」「トイレ使用可（流せません）」「携帯の充電は一人十五分」。マジックの字が、何人もの手で、書き足されていた。'],
    ['', '入口の脇では、ボランティアらしい高校生が、名簿用の紙を配っていた。「お名前と、連絡先と……書ける方だけで、大丈夫です」。その声も、少し、震えていた。'],
    ['', '宮内の声は、かすれていた。もう、何時間も叫び続けている声だった。'],
  ], { info: ['i_fac_open', 'i_off_kitaku', 'i_sns_walk'], onEnter: { time: 60, know: ['k_stay', 'k_temp_facility'] }, choices: [
      C('stay', '一時滞在施設にとどまる', 'c3_hall', { icon: '🏢', effects: { loc: 'aomi_hall', flag: 'stay_decided', time: 20, report: { cat: 'stay', score: 3, note: '一時滞在施設にとどまる判断をした' } } }),
      C('walk', '今すぐ{home}へ歩いて帰る', 'c3_walk1', { icon: '🚶', effects: { flag: 'walking', time: 10, report: { cat: 'stay', score: -2, note: '発災当日の夕方、情報が少ない中で徒歩帰宅を始めた' } } }),
      C('aid', '早瀬と救護所へ行き、手伝う', 'c3_aid', { icon: '⛑', if: { npcAlive: 'hayase' }, effects: { loc: 'aid', time: 20, flag: 'volunteer', report: { cat: 'care', score: 2, note: '救護所で手伝った' } } }),
    ] }),
  // --- stay route ---
  S('c3_hall', 3, 'facility', [
    ['', 'ホールの床に、段ボールが敷かれていく。毛布と水が配られる。'],
    ['坂東', 'おい、俺は車で来てんだ。そこどけ、出口側は俺の場所だ！　家に帰るんだよ！'],
    ['', '男が職員の宮内につめ寄っている。'],
    ['', 'ホールの天井は高く、声がよく響いた。坂東の怒鳴り声が、天井に跳ね返って、何倍にもなって降ってくる。近くにいた子どもが、母親の胸に顔を埋めた。'],
    ['', '宮内は、首から「区職員」の名札を下げていた。その名札の紐が、ねじれていた。直す暇もなかったのだろう。'],
    ['', '坂東の手には、車のキーが握られていた。キーホルダーに、色あせたお守りが一つ。「交通安全」。'],
  ], { onEnter: { water: 20, item: 'blanket', stamina: 10, flag: 'supplied', unflag: 'walking' }, choices: [
      C('calm', '「奥さんのことですか」と話を聞く', 'c3_hall2', { icon: '👂', effects: { flag: 'calmed_bando', npc: { id: 'bando', trust: 20 }, know: 'k_traffic', report: { cat: 'care', score: 2, note: '不安から怒る人の話を聞いた' } }, result: '坂東の妻は入院中だった。車は緊急交通路の妨げになるかもしれない——宮内の説明を、坂東は黙って聞いた。' }),
      C('argue', '「みんな同じだろ！」と怒鳴り返す', 'c3_hall2', { icon: '😠', effects: { mental: -5, npc: { id: 'bando', trust: -20 } } }),
      C('ignore', '関わらない', 'c3_hall2', { icon: '…' }),
    ] }),
  S('c3_hall2', 3, 'facility', [
    ['', '夜が近い。あちこちで困りごとが起きている。全部は手伝えない。'],
    ['エミリー', 'Sorry… what are they saying? Is there a tsunami? I can\'t read…'],
    ['小野寺', '（赤ちゃんを抱いて）すみません……ミルクのお湯って、どこかに……'],
    ['石川', '（青い顔で）……薬、モールに置いてきてしまって。'],
  ], { choices: [
      C('emily', 'エミリーとリンをつなぎ、多言語の公式情報を一緒に探す', 'c3_hall3', { icon: '🌏', effects: { helped: 'emily', time: 30, npc: [{ id: 'emily', trust: 30 }, { id: 'lin', trust: 20 }], know: 'k_foreign', report: { cat: 'care', score: 2, note: '外国人旅行者に情報支援をつないだ' } } }),
      C('mana', '小野寺さんのために授乳・休憩スペースを職員に頼む', 'c3_hall3', { icon: '🍼', effects: { helped: 'onodera', flag: 'helped_onodera_any', time: 30, npc: { id: 'onodera', trust: 30 }, know: ['k_vulnerable', 'k_privacy'], report: { cat: 'care', score: 2, note: '乳児連れの母親のスペース確保を運営に頼んだ' } } }),
      C('ishikawa', '石川さんの持病を職員と救護所に伝える', 'c3_hall3', { icon: '💉', effects: { helped: 'ishikawa', flag: 'ishikawa_cared', time: 30, npc: { id: 'ishikawa', trust: 30 }, know: ['k_meds', 'k_vulnerable'], report: { cat: 'care', score: 3, note: '持病の薬を失った人を医療につないだ' } } }),
      C('rest', '自分も限界だ。横になる', 'c3_hall3', { icon: '😴', effects: { stamina: 20, time: 30 } }),
    ] }),
  S('c3_night', 3, 'night_shelter', [
    ['', '深夜。また揺れる。余震だ。誰かが小さく悲鳴を上げ、すぐに静かになった。'],
    ['', '隣で、若い女性がスマホを握りしめている。'],
    ['春野', '……母と、朝、喧嘩したんです。「もう帰ってこない」って言っちゃって。'],
  ], { alt: [{ if: { preset: 'worker' }, goto: 'c3w_night' }, { if: { preset: 'student' }, goto: 'c3s_night' }, { if: { preset: 'parent' }, goto: 'c3p_night' }], fx: 'aftershock', onEnter: { time: 300, know: ['k_aftershock', 'k_dvt', 'k_water'] }, choices: [
      C('171play', '171の使い方を教え、一緒に伝言を確認する', 'c3_171', { icon: '☎', effects: { helped: 'haruno', flag: 'helped_haruno_any', npc: { id: 'haruno', trust: 30 }, report: { cat: 'contact', score: 2, note: '他の人に171の使い方を教えた' } } }),
      C('listen', '黙って話を聞く', 'c3_171', { icon: '🤲', effects: { npc: { id: 'haruno', trust: 15 }, mental: 3 } }),
    ] }),
  S('c3_171', 3, 'phone_171', [
    ['', '171で、自分の家族からの伝言を再生してみる。'],
  ], { alt: [{ if: { flag: 'fam1_recorded171' }, goto: 'c3_171_yes' }], lines: [['', '「お預かりしている伝言はありません」'], ['', '決めていなかった。どこに、何を残すか。']],
    onEnter: { mental: -8 }, next: 'c4_dawn' }),
  S('c3_171_yes', 3, 'phone_171', [
    ['{fam1}', '（録音）……{fam1}です。{fam2}も無事。約束どおり、ここに残すね。私たちは動かない。あなたも、無理しないで。'],
    ['', '声を聞いた瞬間、体の力が抜けた。'],
  ], { onEnter: { mental: 25, flag: 'heard_fam1' }, next: 'c4_dawn' }),
  // --- walk route ---
  S('c3_walk1', 3, 'liquefaction', [
    ['', '有明方面。歩道のあちこちから砂が噴き出し、マンホールが突き出している。'],
    ['', '人の列が、黙々と東へ歩いていく。'],
    ['', '誰も、しゃべらない。靴底が泥を踏む音と、遠くのヘリの音だけが続く。スーツの男性。ハイヒールを手に持って裸足で歩く女性。ベビーカーを押す父親。'],
    ['', '歩道の端に、誰かが段ボールに書いた紙が貼ってあった。「この先　液状化　足元注意」。マジックの字が、雨でもないのに、にじんでいた。'],
    ['武藤', '（ずぶ濡れの若者を背負って）……そこの人、手ぇ貸してくれ。足が折れてる。'],
  ], { onEnter: { loc: 'ariake', time: 60, risk: { kind: 'liquefaction', level: 10, label: '噴砂の段差でつまずいた' }, know: 'k_liquefaction' }, alt: [{ if: { preset: 'student' }, goto: 'c3s_walk' }, { if: { preset: 'parent' }, goto: 'c3p_walk' }], choices: [
      C('help_muto', '若者（森本）を一緒に救護所まで運ぶ', 'c3_walk2b', { icon: '🤝', if: { flag: 'morimoto_went_shore' }, effects: { time: 40, stamina: -15, helped: 'morimoto', npc: { id: 'muto', trust: 30 }, report: { cat: 'aid', score: 2, note: '負傷者の搬送を手伝った' } } }),
      C('help_generic', '武藤と一緒に、倒れていた人を救護所へ運ぶ', 'c3_walk2b', { icon: '🤝', if: { notFlag: 'morimoto_went_shore' }, effects: { time: 40, stamina: -15, helped: 'muto', npc: { id: 'muto', trust: 30 }, report: { cat: 'aid', score: 2, note: '負傷者の搬送を手伝った' } } }),
      C('go', '「すみません」と頭を下げ、先を急ぐ', 'c3_walk2b', { icon: '🚶', effects: { mental: -6 } }),
      C('turn', 'これは無理だ。一時滞在施設へ引き返す', 'c3_hall', { icon: '↩', effects: { unflag: 'walking', loc: 'aomi_hall', time: 50, flag: ['stay_decided', 'turned_back'], report: { cat: 'stay', score: 2, note: '徒歩帰宅の途中で状況を見て引き返した' } } }),
    ] }),
  S('c3_walk2', 3, 'walk_night', [
    ['', 'すっかり暗くなった。停電で信号も街灯も消えている。'],
    ['', 'コンビニの前に「災害時帰宅支援ステーション」のステッカー（ゲーム内の架空店舗）。水道水とトイレを貸している。'],
  ], { fx: 'dark', onEnter: { time: 120, know: 'k_walk_home' }, choices: [
      C('rest', '水をもらい、トイレを借りて休む', 'c3_walk2c', { icon: '🚰', effects: { water: 30, stamina: 15, time: 40, report: { cat: 'evac', score: 1, note: '徒歩中に支援拠点で休息と水分補給をした' } } }),
      C('push', '休まず歩き続ける', 'c3_walk2c', { icon: '🏃', effects: { time: 10, risk: { kind: 'exhaustion', level: 10, label: '暗い歩道の段差で足をひねった' }, report: { cat: 'evac', score: -1, note: '夜間に休まず歩き続けた' } } }),
    ] }),
  S('c3_walk3', 3, 'walk_night', [
    ['', '運河を渡る橋の手前。向こう岸の空が赤い。火災の煙が、風に乗ってこちらへ流れてくる。'],
    ['', '橋の上には、人が詰まっていた。立ち止まった人と、引き返してくる人と、それでも進もうとする人。三つの流れが、欄干のあいだでぶつかり合っている。'],
    ['', '「この先、通れるらしい」と誰かが言う。根拠は分からない。別の誰かが「向こうは燃えてるって」と言う。それにも、根拠はない。'],
    ['', 'スマホの電池は、もう心もとない。明るい情報も暗い情報も、同じ小さな画面の中で、同じ大きさの文字で流れていく。いま、この橋の上で、正しいことを知っている人は、たぶん一人もいない。'],
  ], { fx: 'dark', onEnter: { time: 60, know: 'k_smoke' }, choices: [
      C('detour', '風上へ大きく迂回する（2時間余計にかかる）', 'c4_dawn_walk', { icon: '↪', effects: { time: 120, stamina: -12, water: -10, report: { cat: 'evac', score: 2, note: '火災の煙を避けて迂回した' } } }),
      C('through', '煙の中を突っ切る', 'c4_dawn_walk', { icon: '🔥', effects: { time: 30, risk: { kind: 'fire', level: 26, label: '煙と熱気の中を通過した' }, report: { cat: 'evac', score: -3, note: '火災の煙の中を突っ切った' } } }),
      C('wait', '橋のたもとの公園で夜明けを待つ', 'c4_dawn_walk', { icon: '🌙', effects: { time: 240, risk: { kind: 'water', level: 10, label: '夜の冷え込みで体が冷えた' }, report: { cat: 'stay', score: 2, note: '夜間の移動をやめ、明るくなるまで待った' } } }),
    ] }),
  // --- aid route ---
  S('c3_aid', 3, 'aid', [
    ['', '臨時の救護所。ブルーシートの上に負傷者が並ぶ。'],
    ['', '手首に、色のついたタグが巻かれている人がいる。赤。黄。緑。あとから、それがトリアージのタグだと知った。（色分けの運用は要監修）'],
    ['', 'ブルーシートの端で、若い男性が、自分の腕の包帯をぼんやり見つめていた。包帯の上に、マジックで時刻が書いてある。「15:20」。'],
    ['早瀬', 'ここでは、重い人から順に診ます。あなたは記録と水をお願い。'],
    ['', '投光器が一台、発電機の低い唸りとともに点いた。白い光の輪の中だけが、世界のすべてみたいに見える。輪の外の暗がりから、次の担架が、また次の担架が、現れては光の中に置かれていく。'],
    ['', '運ばれてきた男性は、数時間、瓦礫に脚を挟まれていたという。顔色は悪くない。本人も「平気だ、歩ける」と言う。だからこそ怖いのだ、と早瀬の目が言っていた。'],
    ['大川', '（消防隊員・架空）挟まれていた時間が長い人は、救出後に急変することがある。医療につなぐまで目を離さないで。'],
  ], { alt: [{ if: { preset: 'parent' }, goto: 'c3p_aid' }], onEnter: { know: ['k_crush', 'k_119', 'k_aed'], flag: 'supplied', water: 20, time: 120 }, choices: [
      C('record', '負傷者の名前と状態を記録し、家族の問い合わせに備える', 'c3_aid_mid', { icon: '📝', effects: { report: { cat: 'aid', score: 2, note: '救護所で記録係を務めた' }, npc: { id: 'hayase', trust: 15 } } }),
      C('aed', 'AEDを取りに走る', 'c3_aid_mid', { icon: '⚡', effects: { stamina: -8, report: { cat: 'aid', score: 2, note: 'AEDを運んだ' }, flag: 'aed_run' } }),
    ] }),
  S('c3_aid2', 3, 'aid', [
    ['', '夜明け前。早瀬が、はじめて座り込んだ。'],
    ['早瀬', '……息子と、まだ連絡が取れないの。看護師なのに、自分の子のところには行けない。'],
  ], { alt: [{ if: { preset: 'worker' }, goto: 'c3w_aid2' }, { if: { preset: 'student' }, goto: 'c3s_aid2' }, { if: { preset: 'parent' }, goto: 'c3p_aid2' }], choices: [
      C('web171', '早瀬の代わりにweb171で息子の学校名を検索する', 'c4_dawn', { icon: '🌐', if: { minBattery: 10 }, effects: { battery: -4, npc: { id: 'hayase', trust: 20, flag: 'son_found' }, report: { cat: 'contact', score: 2, note: '他者の安否確認を手伝った' } }, result: '学校の伝言板に「児童は全員校内で保護」の書き込みがあった（ゲーム内架空情報）。早瀬は顔を覆った。' }),
      C('sit', '隣に座り、水を渡す', 'c4_dawn', { icon: '💧', effects: { npc: { id: 'hayase', trust: 10 } } }),
    ] }),
];

// ===== 第4章 翌日〜数日 =====
export const ch4: Scene[] = [
  S('c4_dawn', 4, 'dawn', [
    ['', '朝。海の向こうから日が昇る。昨日と同じ太陽なのが、不思議だった。'],
    ['宮内', '（ゲーム内の架空情報）一部の路線で、点検後の運転再開の見込みが発表されました。徒歩で帰宅される方は、帰宅支援のルート情報を確認してください。'],
  ], { setT: 960, onEnter: { flag: ['net_restored', 'supplied'], know: 'k_shelter_vs_place' }, info: ['i_off_restart', 'i_sns_looting'], choices: [
      C('next', '出発の支度をする', 'c4_dawn2', { icon: '🎒' }),
    ] }),
  S('c4_dawn_walk', 4, 'dawn', [
    ['', '夜が明けた。足の裏が焼けるように痛い。'],
    ['', 'それでも、見覚えのある街並みが近づいてくる。'],
  ], { alt: [{ if: { preset: 'worker' }, goto: 'c4w_arrive' }], setT: 960, onEnter: { flag: ['net_restored', 'supplied'], unflag: 'walking', water: 20, loc: 'home', time: 60 }, next: 'c4_home' }),
  S('c4_home', 4, 'reunion', [['', '…']], { alt: [
      { if: { preset: 'student' }, goto: 'c4s_dawn' }, { if: { preset: 'parent' }, goto: 'c4p_road' }, { if: {}, goto: 'c4w_town' }] }),
  S('c4_wk_meet', 4, 'reunion', [
    ['', '{meet}。'],
    ['', '時計の下に、二つの影。'],
    ['{fam2}', 'パパぁ！！'],
    ['{fam1}', '……決めておいて、よかったね。'],
  ], { photoShow: 'family_call', onEnter: { mental: 30, flag: 'reunited_family' }, next: 'c4w_house' }),
  S('c4_wk_search', 4, 'reunion', [
    ['', '自宅のマンションは入口に貼り紙がされていた。「立入注意（ゲーム内の架空表示）」。'],
    ['', '家族はいない。学校、公園、避難所——どこを探せばいい？'],
  ], { onEnter: { time: 300, stamina: -15, mental: -10 }, choices: [
      C('shelter', '地域の避難所（小学校）の掲示板を見に行く', 'c4_wk_found', { icon: '📋', effects: { time: 60, know: 'k_shelter_vs_place' } }),
    ] }),
  S('c4_wk_found', 4, 'reunion', [
    ['', '避難所の掲示板。手書きの紙の中に、見慣れた字。「{fam1}・{fam2} 無事 体育館にいます」'],
    ['{fam1}', '……どこ探していいか、分からなかった。あなたも、私も。'],
    ['', '{fam2}は、あなたの服をつかんだまま眠ってしまった。'],
  ], { photoShow: 'family_call', onEnter: { mental: 20, flag: 'reunited_family', know: 'k_meetpoint' }, next: 'c4w_house' }),
  S('c4_st', 4, 'reunion', [
    ['', '品川。'],
  ], { alt: [{ if: { flag: 'fam1_moved_safe' }, goto: 'c4_st_safe' }], lines: [['', '品川駅の港南口。'], ['', '{fam1}は、一晩中ここにいた。冷えきった手で、あなたの手を握った。'], ['{fam1}', '約束、したから。……来なかったら、どうしようって。'], ['', '約束は人を守り、人を危険な場所に縛りつけもする。']],
    onEnter: { mental: 15, npc: { id: 'fam1', hp: -20, injured: true }, flag: 'reunited_partner' }, next: 'c4s_ren_talk' }),
  S('c4_st_safe', 4, 'reunion', [
    ['', '品川の一時滞在施設。'],
    ['{fam1}', '171、聞いたよ。「動かない」って言ってたから、俺も動かなかった。'],
  ], { onEnter: { mental: 25, flag: 'reunited_partner' }, next: 'c4s_ren_talk' }),
  S('c4_st_gma', 4, 'family_away', [
    ['', '世田谷の祖母のことが、ずっと胸に引っかかっている。'],
  ], { alt: [{ if: { flag: 'st_gma_first' }, goto: 'c4_shelter' }, { if: { flag: 'grandma_safe' }, goto: 'c4_st_gma_ok' }, { if: { notFlag: 'fam2_trapped' }, goto: 'c4_st_gma_ok' }], lines: [['', '病院の掲示板。負傷者名簿の中に「ふみ」の名前。'], ['', '箪笥の下から助け出されたが、長く挟まれていた脚の影響で、容体が安定しないという。']],
    onEnter: { know: ['k_crush', 'k_furniture'], time: 600 }, next: 'c4_st_gma2' }),
  S('c4_st_gma2', 4, 'aid', [
    ['{fam2}', '……葵ちゃん。羊羹、あるからね。'],
    ['', 'それが、最後の言葉だった。'],
    ['', '固定していなかった箪笥。誰のせいでもない、と医師は言った。でも、あの電話で一言言っていたら——。'],
  ], { onEnter: { npc: { id: 'fam2', alive: false }, mental: -30 }, next: 'c4_shelter' }),
  S('c4_st_gma_ok', 4, 'reunion', [
    ['{fam2}', '葵ちゃんが言うから、寝る場所変えといたんだよ。'],
    ['', '倒れた箪笥の横で、祖母は羊羹を切っていた。'],
  ], { onEnter: { mental: 25 }, next: 'c4_shelter' }),
  S('c4_pa', 4, 'reunion', [
    ['', '二日目の夕方。病院の通用口。'],
    ['{fam1}', '律！　……健司！'],
    ['{fam2}', 'ママ、かいがら！　いちばん大きいの！'],
    ['', 'ポケットの中で、貝がらは一つも割れていなかった。'],
  ], { photoShow: 'family_call', onEnter: { mental: 30, flag: 'reunited_family', time: 600 }, next: 'c4p_misaki' }),
  S('c4_shelter', 4, 'shelter_life', [
    ['', '数日後。地域の避難所（架空の小学校）。巡回の医療チームが、ようやく傷を診てくれた。'],
    ['田辺', 'トイレ掃除の当番、足りないのよ。それと、夜、女性用の更衣スペースに男の人が入ってきたって苦情が。'],
    ['', '体育館の隅で、高齢の男性が三日間ほとんど動かずに座っている。'],
  ], { alt: [{ if: { preset: 'worker', notFlag: 'w_office_done' }, goto: 'c4w_office' }, { if: { preset: 'student', notFlag: 's_after_done' }, goto: 'c4s_after' }], onEnter: { time: 4320, hp: 15, know: ['k_infection', 'k_privacy', 'k_dvt'] }, choices: [
      C('duty', 'トイレ掃除の当番に入り、更衣スペースの見回りを提案する', 'c4_d_rumor', { icon: '🧹', effects: { report: { cat: 'care', score: 2, note: '避難所の衛生と防犯の運営に参加した' }, npc: { id: 'tanabe', trust: 20 } } }),
      C('old', '高齢の男性に声をかけ、一緒に足を動かす体操をする', 'c4_d_rumor', { icon: '🦵', effects: { report: { cat: 'care', score: 2, note: '動かない高齢者にエコノミークラス症候群の予防を促した' } } }),
      C('car', '体育館は落ち着かない。車中泊に切り替える', 'c4_d_rumor', { icon: '🚗', effects: { risk: { kind: 'exhaustion', level: 5, label: '狭い車内で長時間動かず、脚がむくんだ' }, report: { cat: 'care', score: -1, note: '車中泊でエコノミークラス症候群の対策をしなかった' } } }),
    ] }),
  S('c4_shelter2', 4, 'shelter_life', [
    ['', '夜。体育館の天井を見上げる。'],
    ['', 'あの日、助けた人、助けられなかった人の顔が浮かぶ。'],
    ['', '海辺の手すり。煙の向こうの手。暗い歩道で、黙って隣を歩いてくれた誰か。名前を知っている顔も、知らない顔も、同じ明るさで浮かんでは、消える。'],
    ['', '助けられた顔だけを思い出すことは、できなかった。助けられなかった顔だけを思い出すことも、できなかった。二つは、同じ一日の、同じ海の上に、並んで浮かんでいた。'],
    ['', '体育館のどこかで、誰かが寝言を言った。誰かの名前のようだった。'],
    ['', '明日も、ここで目を覚ます。水を運び、トイレを掃除し、伝言板の前を通り、誰かに「おはよう」と言う。'],
    ['', 'それが、今のあなたにできる、いちばん確かなことだった。'],
  ], { chapterEnd: true, lesson: ['k_stay', 'k_temp_facility', 'k_walk_home', 'k_shelter_vs_place', 'k_dvt', 'k_infection', 'k_vulnerable'], next: 'c5_weeks' }),
];

// ===== 第5章 数週間後（生活再建） =====
export const ch5: Scene[] = [
  S('c5_weeks', 5, 'rebuild', [
    ['', '三週間後。'],
    ['', '自宅は「一部損壊」。壁のひび、傾いた扉、割れた食器。区役所の窓口には長い列。'],
    ['職員', '罹災証明書の申請ですね。被害の写真はありますか？'],
  ], { setT: 30240, onEnter: { know: ['k_support', 'k_mental'], flag: 'home_damaged' }, choices: [
      C('photo', '片付ける前に撮っておいた被害の写真を出す', 'c5_weeks2', { icon: '📷', if: { flag: 'damage_photo' }, effects: { report: { cat: 'items', score: 1, note: '罹災証明のため被害の写真を残した' } } }),
      C('nophoto', 'もう片付けてしまった……', 'c5_weeks2', { icon: '🧹', if: { notFlag: 'damage_photo' }, effects: { mental: -5 } }),
    ] }),
  S('c5_hiroto', 5, 'letter', [
    ['', 'ある日、玄関に父子が立っていた。'],
    ['黒田', 'あの日、息子の手を引いてくれた方ですよね。モールの職員さんに聞いて、探しました。'],
    ['大翔', '（手紙を差し出す）'],
  ], { onEnter: { item: 'letter' }, next: 'c5_friend' }),
  S('c5_friend', 5, 'rebuild', [['', '…']], { alt: [{ if: { npcDead: 'friend' }, goto: 'c5_friend_lost' }, { if: { flag: 'takumi_blessed' }, goto: 'c5_friend_bless' }, { if: { preset: 'parent' }, goto: 'c5p_friend_ok' }, { if: {}, goto: 'c5_friend_ok' }] }),
  S('c5_friend_ok', 5, 'rebuild', [
    ['拓海', '大阪、行くことにした。……あの日の写真、送ってくれよ。'],
    ['拓海', '向こうで防災士の講座、受けてみる。あの日、何もできない自分がいやだったから。'],
    ['', '拓海の左腕には、まだ、薄いサポーターが巻かれていた。煙の中で棚を持ち上げたときに、痛めた腕だ。'],
    ['拓海', '医者に、「無茶しましたね」って言われたよ。……無茶しなきゃよかった、とは、思ってないけど。'],
    ['', '二人で、駅前のベンチに座った。缶コーヒーは、あの日の自販機と同じ銘柄だった。拓海が、それに気づいて、少し笑った。'],
    ['拓海', 'あの日の朝さ、お前と海見ながら、「東京、つまんねえな」って言ったの覚えてる？　……撤回する。全然、つまんなくなかった。'],
    ['', '冗談の形をしていた。でも、拓海の目は、冗談を言う目ではなかった。'],
  ], { photoShow: 'promenade_two', next: 'c5_preset' }),
  S('c5_friend_lost', 5, 'memorial', [
    ['', '拓海の葬儀。仙台から来た両親が、あなたに頭を下げた。'],
    ['', '拓海が助けた人が、焼香の列に並んでいた。'],
    ['', 'あの時「一人で行くな」と言えていたら。答えの出ない問いを、あなたはこれからも抱えていく。'],
    ['', '焼香の列の最後に並んだ。前の人の背中を見ながら、あの日の拓海の背中を思い出していた。煙の中へ、振り返らずに入っていった背中を。'],
    ['', '遺影の拓海は、少しだけピントが合っていなかった。誰かが、スマホの写真を引き伸ばしたのだろう。もしかしたら、あの日、海辺で撮った写真かもしれなかった。'],
    ['拓海の母', '（小さな声で）あの子、最後に、何か言ってましたか。'],
    ['', 'あなたは、答えられなかった。最後に聞いたのは、「大丈夫、すぐ戻る」だった。それを、この人に、言えるだろうか。'],
    ['', '結局、「人を助けに行きました」とだけ言った。母親は、うなずいて、もう一度、深く頭を下げた。'],
  ], { photoShow: 'promenade_two', onEnter: { mental: -20 }, next: 'c5_preset' }),
  S('c5_final', 5, 'rebuild', [
    ['', '街は、少しずつ戻っていく。戻らないものもある。'],
    ['', '戻ったものと、戻らないものの間に、新しいものが、少しずつ生まれていく。冷蔵庫の紙。伝言板の二枚。十年後への手紙。手すりの根元の貝がら。'],
    ['', 'それらは、どれも、あの日がなければ、ここになかった。あの日がなければよかった、と思う。それでも、これらを手放したいとは、思わない。'],
    ['', 'その二つの気持ちを、同時に抱えたまま、生きていく。たぶん、それでいい。'],
    ['', '今夜は——'],
  ], { chapterEnd: true, lesson: ['k_support', 'k_mental', 'k_stock', 'k_kit', 'k_hazardmap', 'k_meetpoint'], next: 'END' }),
  S('END', 5, 'dawn', [['', '——終わり——']]),
  S('death', 9, 'memorial', [['', 'あなたの体は、限界を超えた。']], { next: 'after_story' }),
  S('after_story', 9, 'letter', [['', 'その後——残された人たちの話。']], { next: 'END' }),
];
