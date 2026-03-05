# Club Animo Webサイト Analytics Event Dictionary 設計書

0 目的
本設計書はClub Animo Webサイトにおけるアクセス解析（Google Analytics 4、Microsoft Clarity、Search Console）のイベント詳細定義を行う。
来店検討、キャスト閲覧、求人応募、問い合わせといった重要行動を正確に追跡するための設計とする。

---

1 使用分析ツール

- Google Analytics 4
- Microsoft Clarity
- Search Console

---

2 イベント設計方針
カテゴリ別設計:

- ページ閲覧
- キャスト閲覧
- 求人行動
- 問い合わせ行動
- ナビゲーション行動

---

3 〜 9 閲覧系イベント定義

- `page_view`: 通常ページ閲覧 (params: `page_path`, `page_title`)
- `cast_list_view`: キャスト一覧ページ閲覧 (params: `page_path`, `device_type`)
- `cast_detail_view`: キャスト詳細閲覧 (params: `cast_name`, `cast_id`)
- `shift_view`: 本日の出勤ページ閲覧 (params: `date`)
- `gallery_view`: ギャラリーページ閲覧 (params: `image_count`)
- `event_view`: イベントページ閲覧 (params: `event_count`)
- `recruit_view`: 求人ページ閲覧 (params: `recruit_type` = cast/staff)

---

10 〜 12 行動系（クリック・送信）イベント定義

- `recruit_apply_click`: 求人応募ボタンクリック (params: `recruit_type`)
- `recruit_submit`: 求人応募送信 (params: `recruit_type`, `device_type`)
- `contact_submit`: 問い合わせ送信 (params: `device_type`)

---

13 〜 16 全体UI行動・環境イベント定義

- `nav_click`: ナビゲーションクリック (params: `menu_name`)
- `cta_click`: CTAクリック (params: `cta_name`)
- `scroll_depth`: スクロール率 (params: 25, 50, 75, 100)
- `device_type`: ユーザーデバイス (desktop, mobile, tablet)

---

17 〜 19 分析・KPI・Funnel定義

- `cast_popularity`: キャスト人気分析 (`cast_detail_view`, `cast_name`)
- funnel設計: トップページ -> キャスト閲覧 -> 求人閲覧 -> 応募
- KPI: キャスト閲覧数 / 求人閲覧数 / 応募数 / 問い合わせ数

---

20 受け入れ基準

- GA4イベント取得成功
- 応募コンバージョン取得
- キャスト閲覧分析可能
- 求人導線分析可能
