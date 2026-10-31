import type { PresetId, Npc, NpcRule, Loc, Edge, ReportCat } from '../engine/types';

export const presets: Record<PresetId, { label: string; me: string; desc: string; startLoc: string; items: string[]; vars: Record<string, string> }> = {
  worker: { label: '会社員（標準）', me: '宮下 湊', desc: '34歳。台場のオフィスで働く。妻・千夏と小学2年の娘・陽菜は江東区南砂で暮らす。', startLoc: 'office',
    items: ['phone', 'wallet', 'leather_shoes', 'handkerchief', 'id_card'],
    vars: { fam1: '千夏', fam1rel: '妻', fam2: '陽菜', fam2rel: '娘', friend: '拓海', home: '江東区南砂の自宅', homeArea: '江東区', fam2place: '陽菜の小学校', meet: '南砂の公園の時計の下' } },
  student: { label: '大学生', me: '佐倉 葵', desc: '20歳。世田谷区の実家暮らし。恋人の蓮と品川で待ち合わせの約束。祖母は世田谷の古い家に一人で住む。', startLoc: 'mall',
    items: ['phone', 'wallet', 'sneakers', 'handkerchief', 'id_card'],
    vars: { fam1: '蓮', fam1rel: '恋人', fam2: '祖母・ふみ', fam2rel: '祖母', friend: '拓海', home: '世田谷区の実家', homeArea: '世田谷区', fam2place: '祖母の家', meet: '品川駅の港南口' } },
  parent: { label: '父親（子連れ）', me: '安藤 健司', desc: '41歳。休日に5歳の息子・律とお台場へ。妻の美咲は品川区の病院で勤務中。', startLoc: 'park',
    items: ['phone', 'wallet', 'sneakers', 'handkerchief', 'id_card', 'kids_snack'],
    vars: { fam1: '美咲', fam1rel: '妻', fam2: '律', fam2rel: '息子', friend: '拓海', home: '品川区の自宅', homeArea: '品川区', fam2place: '律のそば', meet: '自宅近くの小学校の門' } },
};

export const items: Record<string, { name: string; desc: string }> = {
  phone: { name: 'スマートフォン', desc: '電池残量に注意。通信が混雑すると使えないことがある。' },
  wallet: { name: '財布（少額）', desc: '' }, cash: { name: '小銭・現金', desc: '停電時はキャッシュレス決済が使えないことがある。' },
  id_card: { name: '身分証', desc: '' }, leather_shoes: { name: '革靴', desc: '長距離の徒歩やガラス片の上には不向き。' },
  sneakers: { name: '歩きやすい靴', desc: 'ガラス片・瓦礫・長距離移動のリスクを下げる。' },
  handkerchief: { name: 'ハンカチ', desc: '止血の圧迫や口元の保護に使える。' },
  battery_pack: { name: 'モバイルバッテリー', desc: 'スマホを1回程度充電できる。' }, whistle: { name: '笛（ホイッスル）', desc: '閉じ込められたとき声より体力を使わずに居場所を知らせられる。' },
  water_bottle: { name: '水（500ml）', desc: '' }, mask: { name: 'マスク', desc: '粉じん・煙対策の補助。' }, light: { name: '小型ライト', desc: '停電時・夜間の移動に。' },
  snack: { name: '非常用お菓子', desc: '' }, kids_snack: { name: '子供のおやつ', desc: '' }, inhaler: { name: '吸入薬', desc: '持病の薬。失くすと危険。' },
  extinguisher: { name: '消火器', desc: '初期消火用。炎が天井に届いたら消火をあきらめて避難。' }, map_paper: { name: '紙の地図', desc: '電池が切れても使える。' },
  blanket: { name: 'アルミブランケット', desc: '体温低下を防ぐ。' }, towel: { name: 'タオル', desc: '' }, gloves: { name: '軍手', desc: 'ガラス片や瓦礫から手を守る。' },
  radio: { name: '携帯ラジオ', desc: '通信障害時でも情報を得られる。' }, letter: { name: '手紙', desc: '' }, board_note: { name: '伝言板の二枚', desc: '避難所の伝言板から、最後に剥がした自分の紙と、隣の一枚。' },
};

export const injuries: Record<string, { name: string; drainPerHour: number; desc: string }> = {
  cut_hand: { name: '手の切り傷', drainPerHour: 1, desc: 'ガラス片による。圧迫止血で止まる。' },
  cut_leg: { name: '脚の深い切り傷（出血）', drainPerHour: 6, desc: '止血しないと時間とともに危険になる。' },
  head_bump: { name: '頭部打撲', drainPerHour: 2, desc: '後から症状が出ることがある。安静と観察が必要。' },
  sprain: { name: '足首のねんざ', drainPerHour: 0, desc: '長距離の徒歩が難しくなる。' },
  smoke: { name: '煙の吸入', drainPerHour: 3, desc: '咳・息苦しさ。新鮮な空気の場所で休む。' },
  burn: { name: '腕のやけど', drainPerHour: 2, desc: '流水で冷やすのが基本（要監修）。' },
  hypothermia: { name: '体の冷え', drainPerHour: 3, desc: '濡れた服・夜間の屋外で進行する。' },
  asthma: { name: '喘息の発作', drainPerHour: 8, desc: '吸入薬がないと危険。' },
};
export const hazardInjury: Record<string, string> = { glass: 'cut_leg', fall: 'head_bump', fire: 'smoke', crowd: 'sprain', liquefaction: 'sprain', water: 'hypothermia', exhaustion: 'sprain', collapse: 'head_bump', traffic: 'sprain' };

export const reportCats: Record<ReportCat, string> = {
  safety: '揺れの最中の安全確保', evac: '避難・移動の判断', info: '情報収集と真偽確認', contact: '家族との安否確認',
  items: '持ち物・事前の備え', stay: '帰宅困難時の行動（むやみに移動しない）', aid: '応急手当・救助', care: '要配慮者への配慮・助け合い',
};

const N = (o: Npc) => o;
export const npcs: Npc[] = [
  N({ id: 'fam1', name: '{fam1}', role: '{fam1rel}', age: 33, startLoc: 'home', personality: '慎重だが、決めたら動く', values: '家族の約束を守ること', fear: '大切な人と連絡が取れないこと', secret: '最近、仕事を辞めるか迷っている', goal: '{fam2}と自分の安全を確保し、あなたと再会する', past: '子供のころ、阪神・淡路大震災の話を祖父から聞いて育った', knowledge: 60, health: '良好', family: 'あなた・{fam2}', job: '会社員／医療職' }),
  N({ id: 'fam2', name: '{fam2}', role: '{fam2rel}', age: 7, startLoc: 'fam2place', personality: '甘えん坊で、決めたことは曲げない', values: '約束', fear: '暗いところ', secret: 'あなたへの誕生日カードを隠している', goal: '家族に会うこと', past: '学校の避難訓練が好き', knowledge: 40, health: '良好', family: 'あなた・{fam1}', job: '—' }),
  N({ id: 'friend', name: '拓海', role: '友人', age: 34, startLoc: 'with_me', personality: '明るく、無鉄砲なところがある', values: '困っている人を放っておかない', fear: '自分が役に立たないこと', secret: '来月から大阪へ転勤する。まだ言い出せていない', goal: '全員で帰ること', past: '学生時代、救命講習を受けたことがある', knowledge: 45, health: '良好', family: '一人暮らし。実家は仙台', job: '営業職' }),
  N({ id: 'saeki', name: '佐伯 正造', role: '負傷した高齢者', age: 82, startLoc: 'mall', personality: '頑固で、人に迷惑をかけたくない', values: '自分のことは自分で', fear: '亡き妻との思い出の店がなくなること', secret: '妻の命日に、いつも同じ店で同じものを食べている', goal: '家に帰って仏壇に手を合わせる', past: '元・港湾の溶接工。お台場の埋立を見てきた', knowledge: 30, health: '高血圧・足が悪い', family: '娘が千葉に住む', job: '年金生活' }),
  N({ id: 'hayase', name: '早瀬 由紀', role: '看護師（非番）', age: 38, startLoc: 'mall', personality: '冷静で、短い言葉で指示を出す', values: '目の前の命から順に', fear: '自分の子供のところへ行けないこと', secret: '自分の息子と連絡がつかない不安を隠している', goal: '救護所に負傷者をつなぐ', past: '東日本大震災の時に派遣された経験がある', knowledge: 85, health: '良好', family: '夫と息子(10)', job: '救急外来の看護師' }),
  N({ id: 'onodera', name: '小野寺 真奈', role: '乳児を連れた母親', age: 29, startLoc: 'mall', personality: '気丈にふるまうが限界に近い', values: '子供を守る', fear: 'ミルクとおむつが尽きること', secret: '夫とは別居中', goal: '娘の結を安全な場所で休ませる', past: '初めての子育て', knowledge: 35, health: '寝不足', family: '娘・結(8か月)', job: '育休中' }),
  N({ id: 'emily', name: 'エミリー・カーター', role: '外国人旅行者', age: 26, startLoc: 'mall', personality: '好奇心旺盛、地震は未経験', values: '自分で判断したい', fear: '言葉が分からないこと', secret: '明朝の便で帰国予定', goal: 'ホテルに戻り家族に無事を伝える', past: 'オーストラリア・パース出身', knowledge: 10, health: '良好', family: '両親', job: 'グラフィックデザイナー' }),
  N({ id: 'morimoto', name: '森本 翔', role: 'SNSを信じて動こうとする若者', age: 19, startLoc: 'mall', personality: '焦りやすく、声が大きい', values: 'スピード', fear: '取り残されること', secret: '実は泳げない', goal: '有明の会場にいる兄のところへ行く', past: 'バイトを始めたばかり', knowledge: 15, health: '良好', family: '兄・健太', job: 'アルバイト' }),
  N({ id: 'kuroda', name: '黒田 誠', role: '子供を探す父親', age: 45, startLoc: 'mall', personality: '責任感が強く、思いつめる', values: '家族', fear: '息子を失うこと', secret: '息子を叱った直後にはぐれた', goal: '息子・大翔を見つける', past: '消防団に入っていたことがある', knowledge: 55, health: '良好', family: '息子・大翔', job: '工務店経営' }),
  N({ id: 'hiroto', name: '黒田 大翔', role: '父とはぐれた子供', age: 8, startLoc: 'mall', personality: '人見知り', values: '父との約束', fear: '大きな音', secret: 'ポケットに父への謝りの手紙', goal: 'お父さんに会う', past: '', knowledge: 20, health: '良好', family: '父', job: '小学生' }),
  N({ id: 'ishikawa', name: '石川 静香', role: '持病の薬を失った人', age: 52, startLoc: 'mall', personality: '物静か', values: '人に頼らない', fear: '低血糖で倒れること', secret: '誰にも病気のことを話していない', goal: '薬（インスリン）を確保する', past: '', knowledge: 40, health: '1型糖尿病', family: '夫', job: '事務職' }),
  N({ id: 'miyauchi', name: '宮内 聡', role: '一時滞在施設の職員（架空施設）', age: 47, startLoc: 'aomi_hall', personality: '真面目、手順を大切にする', values: '受け入れた人を守る', fear: '受け入れ人数を超えること', secret: '自宅に寝たきりの父がいる', goal: '施設を安全に運営する', past: '帰宅困難者訓練の担当', knowledge: 75, health: '良好', family: '父', job: '施設管理会社' }),
  N({ id: 'bando', name: '坂東 剛', role: 'あなたと対立する人物', age: 50, startLoc: 'aomi_hall', personality: '強引で、不安を怒りに変える', values: '自分の家族優先', fear: '無力さ', secret: '妻が入院中', goal: '一刻も早く車で帰る', past: '', knowledge: 25, health: '高血圧', family: '妻・娘', job: '運送業' }),
  N({ id: 'muto', name: '武藤 昭', role: '自らも被災しながら救助する港湾作業員', age: 58, startLoc: 'aomi', personality: '寡黙', values: '現場の仲間', fear: '海', secret: '若いころ、救えなかった同僚がいる', goal: '取り残された人を探す', past: '港湾作業40年', knowledge: 65, health: '腰痛', family: '妻', job: '港湾作業員' }),
  N({ id: 'lin', name: 'グエン・リン', role: '外国人を支援する留学生', age: 23, startLoc: 'aomi_hall', personality: '明るく粘り強い', values: '言葉の壁をなくす', fear: '自分の家族が遠いこと', secret: '奨学金の更新が不安', goal: '施設の外国人に情報を伝える', past: 'ベトナム・ダナン出身、日本語と英語が話せる', knowledge: 50, health: '良好', family: '両親(ダナン)', job: '大学院生' }),
  N({ id: 'tanabe', name: '田辺 久子', role: '避難所運営に関わる町会役員', age: 67, startLoc: 'home_area', personality: '面倒見がよい', values: '誰も取り残さない', fear: '高齢者の孤立', secret: '自分の家も傷んでいる', goal: '避難所を回す', past: '町会で20年防災訓練を担当', knowledge: 70, health: '膝が悪い', family: '夫', job: '町会役員' }),
  N({ id: 'haruno', name: '春野 さき', role: '家族と連絡が取れない若い女性', age: 22, startLoc: 'aomi_hall', personality: '真面目で、不安を一人で抱える', values: '家族', fear: '母が一人でいること', secret: '母と喧嘩したまま家を出てきた', goal: '母の無事を知る', past: '', knowledge: 30, health: '良好', family: '母(大田区)', job: '販売員' }),
  N({ id: 'okawa', name: '大川 隊員', role: '消防隊員（架空）', age: 36, startLoc: 'ariake', personality: '落ち着いている', values: '二次災害を出さない', fear: '—', secret: '—', goal: '救助活動', past: '', knowledge: 95, health: '良好', family: '', job: '消防' }),
];

export const npcRules: NpcRule[] = [
  { id: 'r_fam1_school', npc: 'fam1', if: { preset: 'worker' }, tAt: 25, set: { loc: 'fam2place', flag: 'went_school' }, log: '{fam1}は職場から{fam2}の小学校へ向かった。学校は児童を保護して待機している。' },
  { id: 'r_fam1_171', npc: 'fam1', if: { anyFlag: ['meetpoint', 'prep_full'] }, tAt: 70, set: { flag: 'recorded171' }, log: '{fam1}は約束どおり災害用伝言ダイヤル171に伝言を録音した。' },
  { id: 'r_fam1_noplan', npc: 'fam1', if: { notFlag: ['meetpoint', 'prep_full'] }, tAt: 150, set: { flag: 'searching', loc: 'home' }, log: '{fam1}は連絡がつかないまま、家とあちこちを行き来している。決めた場所がないからだ。' },
  { id: 'r_fam1_hospital', npc: 'fam1', if: { preset: 'parent' }, tAt: 30, set: { flag: 'triage' }, log: '{fam1}は勤務先の病院で、運び込まれる負傷者の対応に入った。持ち場を離れられない。' },
  { id: 'r_fam1_ren', npc: 'fam1', if: { preset: 'student' }, tAt: 45, set: { loc: 'shinagawa', flag: 'waiting' }, log: '{fam1}は約束の品川駅港南口で、あなたを待ち続けている。' },
  { id: 'r_fam1_ren_move', npc: 'fam1', if: { preset: 'student', anyFlag: ['msg_fam1', 'stay_decided'] }, tAt: 240, set: { loc: 'shelter_shinagawa', flag: 'moved_safe' }, log: '{fam1}はあなたの伝言を聞き、駅を離れて一時滞在施設へ移った。' },
  { id: 'r_fam2_grandma', npc: 'fam2', if: { preset: 'student', notFlag: 'prep_full' }, tAt: 5, set: { injured: true, flag: 'trapped' }, log: '世田谷。古い家の箪笥が倒れ、{fam2}は足を挟まれて動けなくなった。' },
  { id: 'r_fam2_grandma_rescue', npc: 'fam2', if: { preset: 'student', flag: 'fam2_trapped' }, tAt: 300, set: { loc: 'hospital', flag: 'rescued' }, log: '近所の人たちが{fam2}を助け出し、病院へ運んだ。だが家族には誰も連絡できていない。' },
  { id: 'r_fam2_school', npc: 'fam2', if: { preset: 'worker' }, tAt: 3, set: { flag: 'protected' }, log: '{fam2}は教室で机の下にもぐった。訓練どおりだった。' },
  { id: 'r_friend_back', npc: 'friend', if: { flag: ['friend_left', 'fire_spread'] }, tAt: 330, set: { injured: true, flag: 'burned2' }, log: '拓海は一人で煙の中へ戻り、取り残された人を外へ押し出した。そのとき、崩れた天井材が彼の上に落ちた。' },
  { id: 'r_friend_death2', npc: 'friend', if: { flag: ['friend_left', 'fire_spread'] }, tAt: 480, set: { alive: false, flag: 'lost' }, log: '拓海は救護所に運ばれたが、煙を多く吸っていた。夜のうちに、息を引き取った。' },
  { id: 'r_friend_fire', npc: 'friend', if: { notFlag: 'friend_with_me', flag: 'fire_spread' }, tAt: 90, set: { injured: true, flag: 'burned' }, log: '拓海はあなたと別れた後、煙の中に取り残された人を助けに戻り、やけどを負った。' },
  { id: 'r_friend_death', npc: 'friend', if: { notFlag: ['friend_with_me', 'warned_friend'], flag: ['fire_spread', 'friend_burned'] }, tAt: 240, set: { alive: false, flag: 'lost' }, log: '拓海は、救護所にたどり着く前に力尽きた。助けた人は生き延びた。' },
  { id: 'r_hayase_saeki', npc: 'hayase', if: { flag: 'stayed_saeki' }, tAt: 20, set: { loc: 'mall', flag: 'met' }, log: '看護師の早瀬が佐伯さんのもとへ駆けつけた。' },
  { id: 'r_saeki_alone', npc: 'saeki', if: { notFlag: ['stayed_saeki', 'helped_saeki'] }, tAt: 180, set: { alive: false, flag: 'lost' }, log: '誰にも気づかれないまま、佐伯さんの出血は止まらなかった。' },
  { id: 'r_morimoto_go', npc: 'morimoto', if: { notFlag: 'stopped_morimoto' }, tAt: 40, set: { loc: 'promenade', flag: 'went_shore' }, log: '森本はSNSの投稿を信じ、海沿いの近道を走っていった。' },
  { id: 'r_morimoto_hurt', npc: 'morimoto', if: { flag: 'morimoto_went_shore' }, tAt: 100, set: { injured: true, flag: 'hurt' }, log: '海沿いの遊歩道は液状化と段差で崩れていた。森本は転倒し、足を骨折した。武藤が見つけて運んだ。' },
  { id: 'r_kuroda_find', npc: 'kuroda', if: { flag: 'helped_hiroto' }, tAt: 60, set: { flag: 'reunited' }, log: '黒田は迷子案内の拠点で、息子の大翔と再会した。' },
  { id: 'r_kuroda_search', npc: 'kuroda', if: { notFlag: 'helped_hiroto' }, tAt: 60, set: { flag: 'searching', injured: true }, log: '黒田は息子を探して立入禁止の区画に入り、落下物で負傷した。大翔は施設職員に保護されていた。' },
  { id: 'r_ishikawa', npc: 'ishikawa', if: { notFlag: 'helped_ishikawa' }, tAt: 400, set: { injured: true, flag: 'collapsed' }, log: '石川は夜中に低血糖で倒れた。早瀬が気づき、救護所へ運ばれた。' },
  { id: 'r_bando_car', npc: 'bando', if: { notFlag: 'calmed_bando' }, tAt: 300, set: { loc: 'road', flag: 'drove' }, log: '坂東は車で出発したが、緊急交通路の規制と渋滞で動けなくなった（シナリオ上の描写）。' },
  { id: 'r_net', npc: 'friend', if: {}, tAt: 600, set: {}, log: '通信の混雑が少しずつ落ち着き始めた（シナリオ上の想定）。' },
];

export const locs: Loc[] = [
  { id: 'office', name: '台場ベイオフィス（架空）', x: 150, y: 120, real: false, note: '架空のオフィスビル' },
  { id: 'mall', name: 'シーサイドモール台場（架空）', x: 120, y: 175, real: false, note: '架空の商業施設' },
  { id: 'park', name: 'お台場海浜公園', x: 95, y: 140, real: true, note: '実在の公園（港区）' },
  { id: 'promenade', name: '海沿いの遊歩道', x: 70, y: 165, real: true, note: '海浜公園の水際。シナリオでは段差・液状化で通行不可' },
  { id: 'daiba_st', name: '台場駅（ゆりかもめ）', x: 135, y: 150, real: true, note: '実在駅' },
  { id: 'telepo', name: '東京テレポート駅（りんかい線）', x: 185, y: 205, real: true, note: '実在駅' },
  { id: 'aomi', name: '青海エリア', x: 170, y: 270, real: true, note: '実在地名' },
  { id: 'aomi_hall', name: '青海ホール（架空・一時滞在施設）', x: 205, y: 250, real: false, note: '架空の一時滞在施設' },
  { id: 'cruise', name: '東京国際クルーズターミナル周辺', x: 140, y: 330, real: true, note: '実在地名' },
  { id: 'ariake', name: '有明・東京ビッグサイト周辺', x: 320, y: 230, real: true, note: '実在地名' },
  { id: 'bridge', name: 'レインボーブリッジ', x: 40, y: 95, real: true, note: '実在の橋。シナリオでは点検のため通行止め（現実の状況ではない）' },
  { id: 'toyosu', name: '豊洲方面', x: 400, y: 160, real: true, note: '方向のみ' },
  { id: 'home', name: '自宅方面', x: 470, y: 90, real: false, note: 'プリセットにより異なる' },
  { id: 'aid', name: '救護所（架空）', x: 260, y: 215, real: false, note: 'シナリオ上の救護所' },
  { id: 'shelter', name: '避難所（自宅地域・架空の小学校）', x: 470, y: 50, real: false, note: 'シナリオ上の避難所' },
];
export const edges: Edge[] = [
  { a: 'office', b: 'mall', minutes: 5, note: '' }, { a: 'mall', b: 'park', minutes: 6, note: '' }, { a: 'park', b: 'promenade', minutes: 4, closedIf: { tMin: 1 }, note: '発災後：段差・液状化・津波注意報のため立入不可（シナリオ）' },
  { a: 'mall', b: 'daiba_st', minutes: 4, note: '発災後：運転見合わせ（シナリオ）' }, { a: 'mall', b: 'telepo', minutes: 10, note: '' }, { a: 'telepo', b: 'aomi_hall', minutes: 8, note: '' },
  { a: 'telepo', b: 'aomi', minutes: 10, note: '' }, { a: 'aomi', b: 'cruise', minutes: 15, note: '' }, { a: 'telepo', b: 'aid', minutes: 12, note: '' }, { a: 'aid', b: 'ariake', minutes: 15, note: '一部で噴砂・段差（シナリオ）' },
  { a: 'ariake', b: 'toyosu', minutes: 35, note: '徒歩。橋の通行は状況次第（シナリオ）' }, { a: 'toyosu', b: 'home', minutes: 90, note: '徒歩・帰宅支援ルートは状況次第（シナリオ）' }, { a: 'park', b: 'bridge', minutes: 20, closedIf: { tMin: 1 }, note: '発災後：点検のため通行止め（シナリオ上の想定）' },
  { a: 'home', b: 'shelter', minutes: 10, note: '' },
];
