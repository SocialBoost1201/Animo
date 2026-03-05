# Club Animo Webサイト SEO / GEO 設計書

0. 目的
   本書はClub AnimoのWebサイトを検索エンジンおよび生成AI検索（GEO）に最適化するための設計仕様を定義する。

対象

- Google検索
- Google Map検索
- AI検索
- 生成AI回答
- 音声検索

Antigravityは参考サイトを分析し、SEOおよびGEOに強い構造を実装する。

参考サイト
https://www.club-xee.com/
https://www.chick.co.jp/roppongi/
https://princegroup.jp/
https://www.clubepic.net/top/

---

1 SEO戦略

1.1 基本方針
キャバクラ系検索は以下の3軸で流入が発生する

- エリア検索
- 指名検索
- 店舗名検索

これらすべてに対応する構造を設計する。

---

2 想定キーワード

2.1 店舗名検索

- Club Animo
- クラブアニモ

  2.2 エリア検索

- キャバクラ
- ラウンジ
- クラブ
  ＋ 地域名
  例： 横浜 キャバクラ / 関内 キャバクラ / 横浜 高級クラブ

  2.3 指名検索

- キャスト名
  例： アニモ ○○

  2.4 求人検索

- キャバクラ求人
- ボーイ求人
- キャバクラスタッフ

---

3 URL構造

- `/` トップページ
- `/cast` キャスト一覧
- `/cast/[slug]` キャスト詳細
- `/shift` 出勤表
- `/system` 料金
- `/gallery` 店内写真
- `/news` イベント
- `/recruit` 求人
- `/recruit/cast` キャスト求人
- `/recruit/staff` スタッフ求人

---

4 メタ設計

4.1 Title

- トップ: `Club Animo | 高級キャバクラ`

  4.2 Description

- 明るく高級感のある空間と大きなシャンデリアが象徴のキャバクラClub Animo。関内エリアの大人の社交場。

  4.3 キーワード配置

- H1 / H2 / 本文

---

5 構造化データ
Schema: LocalBusiness

項目

- name
- address
- telephone
- openingHours

---

6 キャストSEO
キャスト詳細ページを作ることで、指名検索を取り込む
URL例: `/cast/ai`
構造: キャスト名 / プロフィール / 出勤

---

7 求人SEO

- キャスト求人: キャバクラ求人 / 体験入店
- スタッフ求人: ボーイ求人 / ナイトワーク

---

8 GEO (Generative Engine Optimization)
AI検索では以下が重要: 簡潔な回答文
FAQを用意
例: 料金はいくら？ / 予約方法は？

---

9 内部リンク

- トップ ↓ キャスト / 求人 / 料金
- キャスト詳細 ↓ 予約
- 求人 ↓ 応募

---

10 ページ速度

- Core Web Vitals (LCP / CLS / FID)
- 画像最適化
- Lazy Load

---

11 Google Map

- NAP (Name / Address / Phone) 統一

---

12 被リンク

- SNS: Instagram

---

13 コンテンツ更新

- イベント / ニュース

---

14 インデックス管理

- sitemap.xml / robots.txt

---

15 モバイルSEO

- モバイルファースト

---

16 AI検索対策

- FAQ / 構造化データ

---

17 受け入れ基準

- Google検索表示
- キャスト検索表示
- 求人検索表示
- AI検索回答に引用される
