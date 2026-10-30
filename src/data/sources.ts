import type { Source } from '../engine/types';
// checked = date the URL was opened from the dev box and returned HTTP 200 with the stated title (2026-10-31 JST).
// "used" = what the game takes from it. Content summaries are paraphrased; expert review (監修) has NOT been done.
const C = '2026-10-31 HTTP200・タイトル確認';
export const sources: Source[] = [
  { id: 'jma_shindo', publisher: '気象庁', title: '震度について', date: '閲覧 2026-10-31', url: 'https://www.jma.go.jp/jma/kishou/know/shindo/index.html', checked: C, used: '震度は観測点での揺れの強さを表す指標であること' },
  { id: 'jma_kaisetsu', publisher: '気象庁', title: '気象庁震度階級関連解説表', date: '閲覧 2026-10-31', url: 'https://www.jma.go.jp/jma/kishou/know/shindo/kaisetsu.html', checked: C, used: '震度6強〜7で固定していない家具の多くが移動・転倒し得る等の揺れの描写の参考' },
  { id: 'jma_faq7', publisher: '気象庁', title: '地震について（よくある質問）', date: '閲覧 2026-10-31（ページ内記載 2025年8月1日現在の表あり）', url: 'https://www.jma.go.jp/jma/kishou/know/faq/faq7.html', checked: C + '・本文「地震の規模はマグニチュード（M）で表します」確認', used: 'マグニチュードは地震の規模であり震度とは別であること' },
  { id: 'jma_tsunami', publisher: '気象庁', title: '津波警報・注意報、津波情報、津波予報について', date: '閲覧 2026-10-31', url: 'https://www.jma.go.jp/jma/kishou/know/jishin/joho/tsunamiinfo.html', checked: C, used: '津波注意報・警報の区分、海岸から離れる行動' },
  { id: 'jma_eew', publisher: '気象庁', title: '緊急地震速報について', date: '閲覧 2026-10-31', url: 'https://www.jma.go.jp/jma/kishou/know/jishin/eew/index.html', checked: C, used: '震源に近い所では速報が揺れに間に合わない場合があること' },
  { id: 'tokyo_higai', publisher: '東京都', title: '首都直下地震等による東京の被害想定（令和4年5月25日公表）', date: '2022-05-25 公表', url: 'https://www.bousai.metro.tokyo.lg.jp/taisaku/torikumi/1000902/1021571.html', checked: C, used: '想定は震源・季節・時刻・風速等の条件で異なること。本作は数値を引用せず、架空シナリオとして扱う' },
  { id: 'tokyo_kitaku', publisher: '東京都', title: '帰宅困難者対策（東京都防災ホームページ）', date: '閲覧 2026-10-31', url: 'https://www.bousai.metro.tokyo.lg.jp/kitaku_portal/index.html', checked: C + '・本文「一斉帰宅の抑制」確認', used: '一斉帰宅の抑制、一時滞在施設、キタコンDX' },
  { id: 'tokyo_kitaku_ind', publisher: '東京都', title: '帰宅困難者対策 個人向け（外出時の行動マニュアル・安否確認）', date: '閲覧 2026-10-31', url: 'https://www.bousai.metro.tokyo.lg.jp/kitaku_portal/1000047/index.html', checked: C, used: '外出時の地震発生時の行動、安否確認' },
  { id: 'tokyo_book', publisher: '東京都', title: '防災ブック（東京防災・東京くらし防災 等）', date: '閲覧 2026-10-31', url: 'https://www.bousai.metro.tokyo.lg.jp/1028036/index.html', checked: C, used: '備え・家具固定・備蓄などの一般的な行動（冊子本文の頁照合は未実施＝要監修）' },
  { id: 'cao_syuto', publisher: '内閣府（防災担当）', title: '首都直下地震対策', date: '閲覧 2026-10-31', url: 'https://www.bousai.go.jp/jishin/syuto/index.html', checked: C, used: '首都直下地震の対策の枠組み' },
  { id: 'cao_wg', publisher: '内閣府（防災担当）', title: '首都直下地震対策検討ワーキンググループ', date: '閲覧 2026-10-31', url: 'https://www.bousai.go.jp/jishin/syuto/taisaku_wg/index.html', checked: C, used: '被害想定の前提条件の多様性（数値は未引用）' },
  { id: 'cao_hinanjo', publisher: '内閣府（防災担当）', title: '避難所の生活環境対策', date: '閲覧 2026-10-31', url: 'https://www.bousai.go.jp/taisaku/hinanjo/index.html', checked: C, used: '避難所の衛生・プライバシー・要配慮者への配慮' },
  { id: 'cao_shien', publisher: '内閣府（防災担当）', title: '被災者支援', date: '閲覧 2026-10-31', url: 'https://www.bousai.go.jp/taisaku/hisaisyagyousei/index.html', checked: C, used: '罹災証明書・生活再建支援などの公的支援の存在' },
  { id: 'kantei_jishin', publisher: '首相官邸', title: '地震への備えと身の守り方（防災の手引き）', date: '最終更新 令和8年10月（ページ表記）', url: 'https://www.kantei.go.jp/jp/headline/bousai/jishin.html', checked: C + '・本文「電話などがつながりにくくなります」「外壁や窓ガラスが割れて落下」確認', used: '落下物・通信障害・ライフライン停止・道路の混雑' },
  { id: 'kantei_sonae', publisher: '首相官邸', title: '災害への備え 事前にできること（防災の手引き）', date: '閲覧 2026-10-31', url: 'https://www.kantei.go.jp/jp/headline/bousai/sonae.html', checked: C, used: '備蓄・非常持出品・家族の連絡方法' },
  { id: 'fdma_portal', publisher: '総務省消防庁', title: '救急お役立ちポータルサイト', date: '閲覧 2026-10-31', url: 'https://www.fdma.go.jp/publication/portal/', checked: C, used: '応急手当・救急車の利用の一般情報' },
  { id: 'fdma_amb', publisher: '総務省消防庁', title: '救急車利用マニュアル', date: '閲覧 2026-10-31', url: 'https://www.fdma.go.jp/publication/portal/post2.html', checked: C, used: '119番通報の基本' },
  { id: 'jrc', publisher: '日本赤十字社', title: '講習の内容について（救急法・応急手当）', date: '閲覧 2026-10-31', url: 'https://www.jrc.or.jp/study/safety/', checked: C, used: '止血・AED等を学べる講習があること（手技の詳細は要監修）' },
  { id: 'ntt171', publisher: 'NTT東日本', title: '災害用伝言ダイヤル（171）', date: '閲覧 2026-10-31', url: 'https://www.ntt-east.co.jp/saigai/voice171/', checked: C + '・本文「つながりにくい状況になった場合に提供が開始」「体験利用」確認', used: '171の仕組み・体験利用' },
  { id: 'web171', publisher: 'NTT東日本・NTT西日本', title: '災害用伝言板（web171）', date: '閲覧 2026-10-31', url: 'https://www.web171.jp/', checked: C + '・「体験利用」表示確認', used: 'web171で伝言の登録・確認ができること' },
  { id: 'gsi_portal', publisher: '国土交通省・国土地理院', title: 'ハザードマップポータルサイト', date: '閲覧 2026-10-31', url: 'https://disaportal.gsi.go.jp/', checked: C, used: '自宅・職場のハザードを確認する行動' },
  { id: 'env_pet', publisher: '環境省', title: '人とペットの災害対策ガイドライン', date: '閲覧 2026-10-31', url: 'https://www.env.go.jp/nature/dobutsu/aigo/2_data/pamph/h3002.html', checked: C, used: '同行避難の考え方' },
  { id: 'jishin_hq', publisher: '地震調査研究推進本部', title: '地震本部トップ', date: '閲覧 2026-10-31', url: 'https://www.jishin.go.jp/', checked: C, used: '長期評価の存在（特定の予言はしない）' },
  { id: 'minato', publisher: '港区', title: '港区ホームページ（防災ページは個別URL要確認）', date: '閲覧 2026-10-31', url: 'https://www.city.minato.tokyo.jp/', checked: 'トップ200。防災個別ページは未特定＝要確認', used: 'お台場（台場）は港区。区の防災情報の確認先' },
  { id: 'koto', publisher: '江東区', title: '江東区ホームページ（防災ページは個別URL要確認）', date: '閲覧 2026-10-31', url: 'https://www.city.koto.lg.jp/', checked: 'トップ200。防災個別ページは未特定＝要確認', used: '青海・有明は江東区。区の防災情報の確認先' },
  { id: 'osm', publisher: 'OpenStreetMap Foundation', title: 'Copyright and License', date: '閲覧 2026-10-31', url: 'https://www.openstreetmap.org/copyright', checked: C, used: '地図の位置関係はOSMを参照し手描き模式化（© OpenStreetMap contributors, ODbL）' },
];
