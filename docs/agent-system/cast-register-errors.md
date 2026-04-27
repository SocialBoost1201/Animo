# castRegister エラー契約（`code` 一覧）

**正本:** 実装は `lib/actions/cast-auth.ts` の `castRegister`。  
**UI 見出し:** `lib/cast-register-error-titles.ts` の `CAST_REGISTER_ERROR_TITLE_MAP`。  
**変更ルール:** `code` を追加・変更したら **この表・タイトルマップ・両登録ページの表示**を同一 PR で更新する。

## 成功

| `code` | ユーザー向けメッセージ（概要） | UI 見出し |
|--------|----------------------------------|-----------|
| `SUCCESS` | アカウントを登録しました。ログイン画面からSMS認証を行ってください。 | （成功時は別表示） |

## エラー（`success: false`）

| `code` | 想定原因（内部） | ユーザー向けメッセージ | UI 見出し | 一次対応 |
|--------|------------------|-------------------------|-----------|----------|
| `VALIDATION_INCOMPLETE` | 本名・電話・カナ相当が空 | すべての項目を入力してください。 | 入力不備 | B / ユーザー |
| `INVALID_PHONE` | 携帯形式不正 | 携帯番号は09012345678のように11桁で入力してください。 | 携帯番号 | B / ユーザー |
| `UNEXPECTED` | 環境変数欠落（URL / service role）または catch 例外 | 登録設定の読み込みに失敗〜 / 想定外のエラーが発生〜 | 想定外エラー | E / F |
| `MATCH_LOOKUP_FAILED` | DB 照会エラー | 本人確認情報の照合に失敗しました。時間をおいて再度お試しください。 | 照合処理失敗 | F |
| `MULTIPLE_MATCHES` | 同一キーで複数キャスト | 同一の本人確認情報に一致するキャストが複数見つかりました。担当者にお問い合わせください。 | 重複候補 | D / E |
| `NO_MATCH` | 事前登録データと不一致 | 入力された情報に一致するキャスト情報が見つかりませんでした。〜 | 照合失敗 | D / ユーザー |
| `ALREADY_REGISTERED` | `casts.auth_user_id` 済み | この電話番号は既に登録済みです。ログイン画面からSMS認証してください。 | 既登録 | ユーザー |
| `AUTH_SIGNUP_FAILED` | GoTrue createUser 失敗（重複以外） | アカウント作成に失敗しました。時間をおいて再度お試しください。 | Auth作成失敗 | F |
| `AUTH_RECOVERY_FAILED` | Admin users API / JSON / 0件 | アカウント情報の照合に失敗しました。担当者にお問い合わせください。 | Auth照合失敗 | E |
| `AUTH_MULTIPLE_USERS` | 同一電話の Auth が複数 | 同一電話番号のアカウントが複数存在します。担当者にお問い合わせください。 | Auth重複 | E |
| `AUTH_USER_MISSING` | createUser 応答に user なし | アカウント作成の応答が不正でした。時間をおいて再度お試しください。 | Auth作成失敗 | F |
| `ROLE_INSERT_FAILED` | `user_roles` 挿入失敗（23505 以外） | アカウント作成後の権限付与に失敗しました。担当者にお問い合わせください。 | 権限付与失敗 | E / F |
| `CAST_LINK_FAILED` | `casts.auth_user_id` 更新失敗 | アカウント作成後のキャスト紐付けに失敗しました。担当者にお問い合わせください。 | キャスト紐付け失敗 | E / F |

### `UNEXPECTED` の二種類

同じ `code` でメッセージが異なる。

1. **環境:** `NEXT_PUBLIC_SUPABASE_URL` または `SUPABASE_SERVICE_ROLE_KEY` 欠落 → 「登録設定の読み込みに失敗しました。」
2. **例外:** `try/catch` → 「想定外のエラーが発生しました。」

将来的に `CONFIG_ERROR` などへ分割する場合は M3 以降のタスクとする。

## 将来予約（未実装）

| `code` | 備考 |
|--------|------|
| `AUTH_RATE_LIMIT` | M3: Supabase Auth レート制限など細分化時に `castRegister` から返す場合に追加 |
