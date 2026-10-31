import type { InfoPost, Ending, AfterPiece } from '../engine/types';
const F = '【ゲーム内架空情報】';
export const info: InfoPost[] = [
  { id: 'i_sns_bridge', source: 'sns', from: '@odaiba_now（架空アカウント）', at: '発災15分後', text: 'レインボーブリッジ崩落したらしい！！橋が落ちてる写真回ってきた', reliability: 1, truth: false, note: '出所不明の転載。写真の撮影日時・場所が確認できない。シナリオ上は「点検のため通行止め」が正しい。' },
  { id: 'i_sns_fire', source: 'witness', from: 'モールから出てきた人（架空）', at: '発災20分後', text: 'フードコートの奥から煙が出てる。まだ中に人がいた', reliability: 4, truth: true, note: '直接見た人の証言。場所が具体的。' },
  { id: 'i_off_tsunami', source: 'official-fiction', from: F + '気象庁（ゲーム内想定）', at: '発災5分後', text: '東京湾内湾：津波注意報（ゲーム内の架空の発表）。海岸や河口から離れてください。', reliability: 5, truth: true, note: '実際の発表ではありません。現実では気象庁・自治体の最新情報を確認してください。' },
  { id: 'i_fac_stay', source: 'facility', from: F + 'シーサイドモール台場 館内放送', at: '発災30分後', text: '建物の安全を確認中です。外に出た方は、落下物に注意し、係員の指示に従ってください。', reliability: 4, truth: true },
  { id: 'i_sns_water', source: 'sns', from: '拡散ポスト（架空）', at: '発災40分後', text: '【拡散希望】断水で水道水に毒が混入するおそれ！絶対飲むな', reliability: 1, truth: false, note: '根拠・発信元の記載がない典型的なデマの形。自治体・水道局の発表を確認する。' },
  { id: 'i_fac_open', source: 'facility', from: F + '青海ホール（架空施設）職員', at: '発災2時間後', text: '一時滞在施設として受け入れを開始しました。水・毛布・トイレがあります。', reliability: 5, truth: true },
  { id: 'i_off_kitaku', source: 'official-fiction', from: F + '東京都（ゲーム内想定）', at: '発災2時間後', text: '一斉帰宅の抑制にご協力ください。安全な場所にとどまってください（ゲーム内の架空の発表。実在の一斉帰宅抑制の考え方は東京都の資料を参照）。', reliability: 5, truth: true },
  { id: 'i_sns_walk', source: 'sns', from: '@walker_tokyo（架空）', at: '発災2時間後', text: '有明→豊洲、普通に歩けたよ。みんな歩いて帰れる', reliability: 2, truth: false, note: '一人の体験で、時間・場所が限定的。夜間・余震・火災の状況は刻々と変わる。' },
  { id: 'i_off_restart', source: 'official-fiction', from: F + '鉄道会社（架空）', at: '翌朝', text: '一部区間で点検終了後の運転再開を予定。運転状況は各社の発表を確認してください。', reliability: 5, truth: true },
  { id: 'i_sns_looting', source: 'sns', from: '匿名掲示板（架空）', at: '翌朝', text: '外国人が集団で略奪してるらしい', reliability: 1, truth: false, note: '過去の災害でも、こうした差別的なデマが拡散し被害を生んだ。出所不明の情報は広めない。' },
];
export const photos: Record<string, { title: string; desc: string }> = {
  promenade_two: { title: '海辺の二人', desc: '発災の数時間前、拓海と撮った写真。後ろに、いつもどおりの東京湾。' },
  family_call: { title: 'ビデオ通話の画面', desc: '昼休みのビデオ通話。何でもない、いつもの顔。' },
};
export const endings: Ending[] = [
  { id: 'e_death_msg', kind: 'death', title: '声は、届いた', if: { dead: true, flag: 'msg_fam1' }, text: ['あなたは帰れなかった。', 'でも、あの日残した伝言は、ちゃんと届いていた。'] },
  { id: 'e_death_unsent', kind: 'death', title: '未送信のメッセージ', if: { dead: true, flag: 'msgfail_fam1', notFlag: 'msg_fam1' }, text: ['送信できなかった言葉が、端末の中に残っていた。', '届かなかった言葉を、家族はあとから読んだ。'] },
  { id: 'e_death_helper', kind: 'death', title: 'あの日の人', if: { dead: true, anyFlag: ['helped_hiroto', 'helped_saeki', 'helped_haruno', 'helped_morimoto'], notFlag: 'msg_fam1' }, text: ['あなたが助けた人は、生きている。', 'その人の人生の中に、あなたは残り続ける。'] },
  { id: 'e_death', kind: 'death', title: '帰れなかった日', if: { dead: true }, text: ['あなたは、帰れなかった。', 'その原因は、運だけではなかった。いくつかの判断と、準備と、時間が重なった結果だった。'] },
  { id: 'e_volunteer', kind: 'rebuild', title: 'あの日から始まった仕事', if: { flag: 'volunteer', npcAlive: 'friend' }, text: ['救護所で過ごした一夜が、あなたの何かを変えた。', '半年後、あなたは地域の防災訓練で、記録係の腕章をつけていた。'] },
  { id: 'e_lost_friend', kind: 'loss', title: '隣にいない夏', if: { npcDead: 'friend' }, text: ['生き残ったことは、喜びだけではなかった。', '拓海のいない夏が来る。あなたはそれでも、海辺の写真を消せない。'] },
  { id: 'e_lost_grandma', kind: 'loss', title: '羊羹の約束', if: { npcDead: 'fam2' }, text: ['週末、寄るはずだった。', '箪笥の固定。あの日の電話の一言。小さなことが、大きなことだった。'] },
  { id: 'e_meet', kind: 'survive', title: '決めておいた場所', if: { flag: ['meetpoint', 'reunited_family'] }, text: ['決めておいた場所で、家族はあなたを待っていた。', '「もしも」の話を一度しておくこと。それが、あの日いちばん役に立った。'] },
  { id: 'e_partner', kind: 'survive', title: '港南口で', if: { flag: 'reunited_partner' }, text: ['約束の場所で、二人はもう一度会えた。', '次は「会えなかったらどうするか」まで、決めておこうと話した。'] },
  { id: 'e_home', kind: 'rebuild', title: 'ただいま', if: {}, text: ['壊れたものを片付け、少しずつ日常を取り戻していく。', '「ただいま」が言えることの重さを、あなたは知った。'] },
];
export const after: AfterPiece[] = [
  { id: 'a_171', if: { flag: 'msg_fam1' }, who: '{fam1}', text: '171の再生ボタンを押した。あなたの声だった。「無事だよ、動かないで待ってて」。その言葉どおり、私たちは動かなかった。だから、生きている。' },
  { id: 'a_unsent', if: { flag: 'msgfail_fam1' }, who: '{fam1}', text: '数か月後、戻ってきたあなたのスマホに、送信エラーのメッセージが残っていた。送れなかった言葉。でも、たしかに私に向けて書かれていた。' },
  { id: 'a_photo_friend', if: { flag: 'photo_promenade_two', npcAlive: 'friend' }, who: '拓海', text: 'あの日の海辺の写真、まだスマホの待ち受けにしてる。大阪で、防災士の勉強を始めたよ。お前の分まで、って言ったら怒るか？', photo: 'promenade_two' },
  { id: 'a_photo_family', if: { flag: 'photo_family_call' }, who: '{fam2}', text: 'お昼のビデオ通話の写真。いちばん好きな写真。', photo: 'family_call' },
  { id: 'a_hiroto', if: { flag: 'helped_hiroto' }, who: '大翔', text: '十年後。消防学校の入学式で、大翔は「あの日、手を引いてくれた人がいた」と話した。' },
  { id: 'a_saeki', if: { flag: 'helped_saeki', npcAlive: 'saeki' }, who: '佐伯', text: '佐伯さんは、あの日のことを地域の集まりで話し続けている。「若い人が、わしを置いていかなかった」。' },
  { id: 'a_haruno', if: { flag: 'helped_haruno' }, who: '春野', text: 'あの夜、母と仲直りできた。171の使い方を教えてくれた人のことを、母にも話した。' },
  { id: 'a_morimoto', if: { flag: 'helped_morimoto' }, who: '森本', text: '足は治った。今は地元の消防団にいる。海の近くで撮影する人を見ると、つい声をかけてしまう。' },
  { id: 'a_promise', if: { flag: 'promise' }, who: '{fam1}', text: 'あの日の約束の時間になると、毎年、二人ぶんの夕飯を作る。' },
  { id: 'a_meet', if: { flag: 'meetpoint' }, who: '{fam1}', text: '決めておいた{meet}。家族は、そこで待った。あなたが決めてくれた場所だったから、迷わずにすんだ。' },
  { id: 'a_nomeet', if: { notFlag: 'meetpoint' }, who: '{fam1}', text: 'どこに行けばいいのか、分からなかった。今は、集合場所を家族で決めて、冷蔵庫に貼ってある。' },
  { id: 'a_wk_card', if: { flag: 'hina_card' }, who: '{fam2}', text: 'パパのたんじょうびカード、ひなんじょにももっていった。ママが「だいじなものはひとつにしなさい」っていったから、これにした。' },
  { id: 'a_bando', if: { flag: 'bando_car_left' }, who: '坂東', text: 'あの晩、車を置いて歩いた。女房の病院に着いたのは翌朝だった。あとで聞いたら、あの交差点を救急車が通ったそうだ。俺の車がなかった分だけ、少し早く。' },
  { id: 'a_st_gma_hand', if: { flag: 'gma_with_me' }, who: '{fam1}', text: '葵は、あの日おばあちゃんの手を最後まで握っていた。俺を待たせたことを何度も謝るけど、あれでよかったんだと思う。俺は、ちゃんと待てる場所にいたから。' },
  { id: 'a_pa_letter', if: { flag: 'misaki_has_letter' }, who: '{fam1}', text: '青いクレヨンの三つの丸は、いまもロッカーの扉の裏に貼ってある。夜勤で心が折れそうな夜は、いちばん大きい丸を見る。' },
  { id: 'a_miyauchi', if: { flag: 'helped_miyauchi' }, who: '宮内', text: 'あの夜の名簿で、十七件の家族の問い合わせに答えられました。父のところには、ヘルパーさんが来てくれていました。' },
  { id: 'a_report', if: {}, who: '', text: 'あなたの選択の記録は「防災判断レポート」に残っている。次は、あなた自身の「もしも」を考えてみてください。' },
];
