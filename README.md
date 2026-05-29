# English Phrase Reviewer

英熟語・フレーズの穴埋め問題で復習できる学習アプリ（Next.js 14 + Prisma + SQLite）。

## 機能

- フレーズの登録・編集・削除
- 穴埋め問題による復習クイズ
- 入力ゆれ許容（大文字小文字・前後空白・句読点）
- 段階的ヒント（意味・先頭文字・単語数）
- スペースド・リピティション（復習スケジュール自動設定）
- お気に入り登録・お気に入りのみ復習
- 復習セッション設定（出題数・カテゴリ・難易度・順序）
- 例文の品質チェック
- 詳細分析画面（正答率・カテゴリ別統計）
- 学習履歴ページ

---

## 起動方法

### 開発用起動（ローカル）

```bash
# 依存関係インストール
npm install

# .env ファイル作成
echo 'DATABASE_URL=file:./dev.db' > .env

# DBマイグレーション
npx prisma migrate dev

# 開発サーバー起動（ホットリロードあり）
npm run dev
```

ブラウザで http://localhost:3000 を開く。

---

### 本番相当起動（コンテナ）

Docker と Docker Compose が必要です。

```bash
# 1. .env ファイル作成（.env.example を参考に）
cp .env.example .env
# 必要に応じてPORTを変更

# 2. コンテナ起動（初回はビルドが実行されます）
docker compose up -d

# 3. ブラウザで確認
open http://localhost:3000

# 4. 起動確認（ヘルスチェック）
curl http://localhost:3000/api/health
# -> {"status":"ok"}

# 5. ログ確認
docker compose logs -f

# 6. 停止
docker compose down
```

#### 開発用起動との違い

| 項目 | 開発用 (`npm run dev`) | コンテナ (`docker compose up`) |
|------|----------------------|-------------------------------|
| モード | 開発モード（ホットリロードあり） | 本番モード（ビルド済み） |
| DB場所 | `./dev.db`（ローカルファイル） | Docker ボリューム（`db_data`） |
| ポート | 3000（固定） | `.env` の PORT で変更可 |
| デバッグ情報 | あり | なし |
| 速度 | 遅い（JIT） | 速い（静的ビルド） |

#### PORT 変更方法

`.env` ファイルで設定：

```
PORT=8080
DATABASE_URL=file:/app/data/dev.db
```

その後 `docker compose up -d` で再起動。

#### データの永続化

SQLite データベースは Docker ボリューム `db_data` に保存されます。
`docker compose down` でコンテナを停止してもデータは保持されます。
データを削除する場合は `docker compose down -v` を使用してください。

---

## 環境変数

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| `DATABASE_URL` | SQLite DB パス | `file:./dev.db` |
| `PORT` | 起動ポート | `3000` |

`.env.example` を参考に `.env` ファイルを作成してください。

---

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Prisma + SQLite
- Tailwind CSS
- Docker / Docker Compose
