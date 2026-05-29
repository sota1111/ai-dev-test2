# English Phrase Reviewer

英熟語・フレーズの穴埋め問題で復習できる学習アプリ（Next.js 14 + Prisma + SQLite）。

## 起動方法

### 開発用起動

ホットリロードあり。コード変更が即座に反映されます。

```bash
# 依存関係インストール
npm install

# .env ファイル作成
echo 'DATABASE_URL=file:./dev.db' > .env

# DBマイグレーション
npx prisma migrate dev

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開く。ナビに「DEV」バッジが表示されます。

---

### 本番相当起動

最適化ビルドを実行し、本番公開に近い状態で動作確認できます。

```bash
# .env ファイル作成（未作成の場合）
echo 'DATABASE_URL=file:./dev.db' > .env

# ビルド＆起動（1コマンド）
npm run start:prod
```

または個別に実行:

```bash
npm run build    # 本番ビルド
npm start        # 本番サーバー起動
```

ブラウザで http://localhost:3000 を開く。「DEV」バッジは表示されません。

---

### 開発用起動と本番相当起動の違い

| 項目 | 開発用 (npm run dev) | 本番相当 (npm run start:prod) |
|------|----------------------|-------------------------------|
| コマンド | npm run dev | npm run start:prod |
| NODE_ENV | development | production |
| DEV バッジ | ナビに表示 | 非表示 |
| ホットリロード | あり | なし |
| 速度 | 遅い（JIT） | 速い（ビルド済み） |
| 用途 | 開発・デバッグ | 動作確認・デプロイ前検証 |

---

## 環境変数

.env.example を参考に .env ファイルを作成してください。

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| DATABASE_URL | SQLite DB パス | file:./dev.db |
| PORT | 起動ポート（Docker用） | 3000 |

---

## 機能

- フレーズの登録・編集・削除
- 穴埋め問題による復習クイズ
- スペースド・リピティション（復習スケジュール自動設定）
- 復習セッション設定（出題数・カテゴリ・難易度・順序）
- 例文の品質チェック
- 詳細分析画面（正答率・カテゴリ別統計）

---

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Prisma + SQLite
- Tailwind CSS
