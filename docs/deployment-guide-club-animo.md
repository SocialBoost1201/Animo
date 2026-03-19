# CLUB Animo Vercel デプロイ・運用ガイド

本ドキュメントは、ローカル環境で開発された CLUB Animo（Next.js アプリケーション）を、インターネット上へ本番公開するための公式手順書です。推奨ホスティングサービスである **Vercel** へのデプロイを前提に記載しています。

---

## 1. 必要な前提アカウント

デプロイにあたり、事前に以下のサービスのアカウント（またはアクセス権限）が必要です。

1. **GitHub アカウント**: ソースコードのバージョン管理およびVercel連携用。
2. **Vercel アカウント**: 本番ホスティング環境（GitHubログインを推奨）。
3. **Supabase アカウント**: 本番用データベース（Production プロジェクト）。
4. **Google Cloud (reCAPTCHA) アカウント**: 本番ドメイン用の reCAPTCHA v3 キー。
5. **ドメイン管理サービス**: `club-animo.com` などの独自ドメインを管理しているサービス（お名前.com, ムームードメイン、Amazon Route 53など）。

---

## 2. デプロイ前準備（環境変数の整理）

Vercelに設定するための「本番用」環境変数（Environment Variables）を準備します。ローカルの `.env.local` の内容をベースに作成しますが、**必ず本番用の値（Production）**を用意してください。

以下の形式のリストを手元（メモ帳など）に控えます。

```env
# ---------------------------------------------
# [SUPABASE] 本番用プロジェクトの情報
# ---------------------------------------------
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROD_PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_PROD_ANON_KEY]"

# ---------------------------------------------
# [RECAPTCHA] 本番ドメイン（例: club-animo.com）を許可したキー
# ---------------------------------------------
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="[YOUR_PROD_RECAPTCHA_SITE_KEY]"
RECAPTCHA_SECRET_KEY="[YOUR_PROD_RECAPTCHA_SECRET_KEY]"

# ---------------------------------------------
# [ANALYTICS] Google Analytics 4 / Microsoft Clarity (任意)
# ---------------------------------------------
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_CLARITY_ID="xxxxxxxxx"

# ---------------------------------------------
# [RESEND] お問い合わせ等のメール配信用 (任意)
# ---------------------------------------------
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"
```

> [!CAUTION]
> **Supabase の設定に関する注意**
> ローカル環境と同じプロジェクトを「本番」にしてしまうと、誤って本番データが消えたり混ざったりするリスクがあります。原則として、Supabase上で「Production（本番）」プロジェクトを新規作成し、改めてDBのマイグレーション（テーブル展開）を行うことを強く推奨します。

---

## 3. GitHub へのプッシュ

ローカルマシンのソースコードを、リモートの GitHub リポジトリにプッシュします。

```bash
# まだ Git 管理していない場合
git init
git add .
git commit -m "Initial commit for production"
git branch -M main

# GitHub で作成した空リポジトリへの登録とプッシュ
git remote add origin https://github.com/[YOUR_ACCOUNT]/[YOUR_REPO_NAME].git
git push -u origin main
```

---

## 4. Vercel へのデプロイ実行

1. [Vercel](https://vercel.com/) にログインします。
2. ダッシュボード画面右上の **「Add New...」 -> 「Project」** をクリックします。
3. **「Import Git Repository」** の一覧から、手順3でプッシュしたリポジトリ（例: `club-animo-web`）の **「Import」** をクリックします。
4. **「Configure Project」** 画面が開きます。
   - **Framework Preset**: 自動的に `Next.js` が選択されていることを確認します。
   - **Root Directory**: `./` （デフォルトのまま）。
   - **Environment Variables**: ここを開き、**手順2で用意した環境変数をすべて登録**します。コピー＆ペーストで一括入力が可能です。
5. **「Deploy」** ボタンをクリックします。

数分後にビルドが完了し、「Congratulations!」の画面が出れば、Vercelから付与された一時的ドメイン（例: `club-animo-web.vercel.app`）でサイトが公開されます。

---

## 5. 独自ドメインの割り当て（Custom Domain）

一時的なドメインではなく、店舗の公式ドメイン（例: `club-animo.com`）を割り当てます。

1. Vercelダッシュボードから該当プロジェクトを開き、上部の **「Settings」 -> 「Domains」** をクリックします。
2. 入力欄に取得済みのドメイン（例 `club-animo.com`、または `www.club-animo.com`）を入力し、**「Add」** をクリックします。
3. Vercel画面上に「DNS設定手順（Nameservers の変更 または A / CNAME レコードの追加）」が表示されます。
4. お使いのドメイン管理サービス（お名前.comなど）の管理画面へログインし、Vercelの指示通りにDNSレコードを設定します。
5. DNSの伝播には数十分〜数時間かかる場合があります。Vercelの画面上でステータスが「Valid Configuration」になるのを待ちます。

---

## 6. 運用開始前の最終チェックリスト

本番公開ドメイン（例: `https://club-animo.com`）にアクセスし、以下の動作確認を必ず行ってください。

### ☑ フロントエンド機能確認

- [ ] トップページ：動画や画像が正しく表示され、スクロールが滑らか（Lenis/GSAP）に動作するか。
- [ ] 募集要項・料金システム：レイアウト崩れがないか（特にモバイル実機での確認）。

### ☑ フォーム・通信機能確認（※重要）

- [ ] **求人応募・お問い合わせフォーム**: 実際にテスト送信を行い、正常に送信処理が完了するか。
- [ ] **reCAPTCHA挙動**: ブラウザのConsoleタブ等にエラーが出ていないか（ドメイン不一致エラー等）。

### ☑ CMS（管理画面）確認

- [ ] `https://club-animo.com/admin` へアクセスし、Supabaseの認証（Email/Password等）でログインできるか。
- [ ] 「キャスト一覧」で新規キャスト登録と、顔写真のアップロードが正常に行えるか（Storageの権限エラーが出ないか）。
- [ ] 先ほどテスト送信したフォームの内容が、管理画面の「お問い合わせ一覧（Inquiries）」または「応募一覧（Applications）」で確認・既読処理できるか。

---

以上の手順によって、サイトは安全に本番稼働を開始します。
何か問題（エラー画面の発生など）が起きた場合は、Vercel管理画面内の **「Logs」タブ** からリアルタイムにサーバーの実行エラーを確認できます。
