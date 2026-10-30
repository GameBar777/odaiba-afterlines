# ゆれのあと、きみへ。― ODAIBA AFTERLINES

お台場で、架空の「首都直下地震」に遭遇する防災教育ライフシミュレーション（ブラウザ／スマホ対応）。

> 本作は防災教育を目的としたシミュレーションゲームです。ゲーム内の地震、被害、施設状況、避難経路、人物の行動は架空のシナリオを含みます。現実の災害時は、気象庁、自治体、消防、警察などの最新の公式情報と現地の状況に従ってください。本作のプレイ結果だけで実際の安全を保証するものではありません。

- 公開URL: https://gamebar777.github.io/odaiba-afterlines/
- 技術: Vite + TypeScript。エンジン（`src/engine`）は決定論的で、コンテンツ（`src/data`）と分離。
- タイトル: 当初案「その日、東京が止まった。― AFTER THE SHOCK」は、英題が1990年の米TV映画 "After the Shock" と重なるため変更（docs/SPEC.md 参照）。

## 動かし方
```
npm install
npm run dev        # 開発
npm test           # vitest（データ整合性 + 600回ランダムプレイ）
npm run build && npm run preview   # http://localhost:4190/
node scripts/e2e.mjs               # Playwright（preview起動中に。390x844 / 1280x800）
npm run counts                     # docs/counts.json を更新
```

## 更新（コンテンツ追加）
- シーン: `src/data/scenes1.ts`（序章〜第2章）, `scenes2.ts`（第3〜5章・死亡・その後）
- 知識図鑑: `src/data/knowledge.ts`（必ず `sources.ts` の出典IDを付け、未確認は「要監修」）
- 人物と自律行動: `src/data/base.ts` の `npcs` / `npcRules`
- エンディング・その後: `src/data/misc.ts`
- `main` に push すると GitHub Actions がテスト→ビルド→Pages公開。

## バックアップ
- プレイヤー: 設定 →「書き出し」でセーブ文字列をコピー、「読み込み」で復元（localStorage、バージョン付き）。
- 開発: GitHub リポジトリが正本。`git clone https://github.com/GameBar777/odaiba-afterlines`。

ドキュメント: docs/ 以下（SPEC, SCENARIO, SOURCES, KNOWLEDGE_DB, ENDINGS, TEST_RESULTS, RIGHTS, REVENUE_SIM, MARKETING, USER_ACTIONS, KNOWN_ISSUES, COUNTS）。
