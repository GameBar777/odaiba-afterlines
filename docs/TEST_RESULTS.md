# TEST_RESULTS（2026-10-31 JST 実測）

- `npx tsc --noEmit`：エラー0
- `npx vitest run`：3/3 合格（データ整合性／架空公式情報ラベル／600回の決定論的ランダムプレイ：10種のエンディングすべてに到達、死亡は約34%で全件に死因記録あり）
- `node scripts/e2e.mjs`（Playwright、390x844 と 1280x800）：ローカル 38/38、**公開URL https://gamebar777.github.io/odaiba-afterlines/ でも 38/38**
  - タイトル・レポート・設定の免責文、エンディング到達、横はみ出しなし、コンソールエラーなし、死亡ルート、リロード後のセーブ復元
- スクリーンショット：docs/screenshots/
- GitHub Actions（Deploy to GitHub Pages）：build と deploy が成功
