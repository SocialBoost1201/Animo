# Project Operating Policy

- このプロジェクトは Antigravity と Codex の両方で利用する
- 初期設計、構成設計、UI設計、要件整理は上流設計資料を基準に行う
- 実装時は既存コード、設計書、技術スタック、UI要件を必ず確認する
- 差分は最小限に保つ
- 既存構造を壊さずに改善する
- 不要な大規模変更を避ける

# Skill Usage Policy

- ユーザーが個別の skill 名を指定しない場合でも、タスク達成に有効な skill があれば自律的に選択して使用すること
- 無関係な skill を過剰に使用しないこと
- AGENTS.md のルール、既存コード、プロジェクト構造を最優先に判断すること
- skill は必要な場合にのみ使用すること
- 実行後は、使用した skill 名と使用理由を簡潔に報告すること
- skill を使用しなかった場合も、その理由を簡潔に報告すること

# Skill Selection Policy

- このプロジェクトでは、必要な Skills のみを .agent/skills に配置する
- 全Skillsを一括配置しない
- 要件定義書、設計書、技術スタック、UI要件をもとに選定する
- 現在必要なSkills と 将来必要になる可能性があるSkills を分ける
- 初期段階では 現在必要なSkills のみ配置する
- 将来候補は docs/skills/skill-selection-report.md に記録する
- .agents/skills は .agent/skills を参照する symlink とする

# Preferred Skill Selection Heuristics

- UI、レイアウト、余白、可読性の改善 → frontend-design
- 構造設計、責務分割、設計判断 → architecture
- 型設計、TSエラー、型安全性 → typescript-expert
- API、Route設計 → api-design-principles
- バグ調査、再現、原因特定 → debugging-strategies
- 修正後の検証 → lint-and-validate
- テスト設計、品質担保 → test-driven-development
- デプロイ、環境設定 → vercel-deployment
- 自動化、CI/CD、運用設計 → workflow-automation

UI/UX Design System Policy:

All projects must follow a unified UI system to ensure consistency, usability, and conversion optimization.

1. Heading System:
- Use clamp for responsive typography
- Limit line length and enforce max-width
- Maintain strict H1-H3 hierarchy
- Avoid unnatural line breaks

2. Spacing System:
- Use 8px-based spacing scale
- Maintain consistent vertical rhythm
- Ensure proper breathing space between sections

3. Button System:
- Minimum height 48px
- Clear CTA-focused text
- Limit number of primary buttons
- Maintain consistent color usage

4. CTA System:
- Must include CTA in hero, mid-section, and footer
- Use action-driven text
- Provide trust signals near CTA

5. Mobile First:
- Always optimize for mobile readability
- Avoid overcrowding UI
- Ensure tap-friendly components

6. Prohibited:
- Inconsistent spacing
- Multiple conflicting CTAs
- Typography without constraints
- Over-designed UI elements

All UI must be designed for clarity, conversion, and scalability.

UI/UX Audit Policy:

All projects must be validated against the UI/UX Design System Policy.

Audit checklist:

1. Heading System:
- clamp() is used for all headings
- max-width is applied
- H1 appears only once
- No unnatural line breaks

2. Spacing System:
- spacing follows 8px scale
- consistent vertical rhythm is maintained

3. Button System:
- buttons meet minimum size requirements (>=48px height)
- CTA text is action-driven

4. CTA System:
- CTA exists in hero section
- CTA exists in mid-section
- CTA exists in footer

5. Mobile UX:
- layout is not overcrowded
- tap targets are accessible

6. Violations:
- inconsistent spacing
- multiple conflicting CTAs
- missing CTA
- broken typography

Output:
- PASS / FAIL per item
- list of violations
- suggested fixes


Structured Data Policy

Purpose
- SEOおよびGEO対策として、検索エンジンおよびAIに対してページ内容を正確に伝える
- 構造化データの品質と一貫性を全プロジェクトで統一する

---

1. Core Principles

- 構造化データは JSON-LD で実装する
- 表示内容と完全一致させる（不一致は禁止）
- 未掲載情報・誇張・将来情報は記述禁止
- Googlebot がアクセス可能なページのみ対象
- 1ページ1主目的に対して適切な schema のみ使用
- 不要な多重 schema 実装は禁止
- 公開前に Rich Results Test を必ず通す

---

2. Required Base Fields

すべての schema において以下は必須扱い：

- @context = https://schema.org
- @id を可能な限り設定
- url
- name
- description
- image（実在URL）
- inLanguage（ja-JP）

記事系の場合：
- datePublished
- dateModified
- author
- mainEntityOfPage

禁止：
- ダミー値
- 空文字
- 推測値

---

3. Schema Selection Rules

ページ種別ごとに以下を適用：

- Top：Organization または LocalBusiness
- Company：Organization
- Store：LocalBusiness
- Service Page：Service
- Product Page：Product
- Article：Article / BlogPosting / NewsArticle
- FAQ：FAQPage
- Breadcrumb：BreadcrumbList
- Search：WebSite + SearchAction
- Video：VideoObject
- Review：Review / AggregateRating（実在のみ）

---

4. Entity Design Rules

Organization / LocalBusiness：

- 名称、URL、ロゴ、電話、住所、営業時間、sameAs を整備
- 住所は分割（都道府県 / 市区町村 / 番地）
- 店舗と法人は分離
- 拠点ごとに固有データを持つ

---

5. Service Rules

- serviceType を明示
- provider を Organization / LocalBusiness に接続
- areaServed / audience は必要に応じて記述
- 内容は本文と一致させる
- Offer は料金公開時のみ使用

---

6. Product Rules

- 商品ページのみ使用
- price / currency / availability は実在値のみ
- review / rating は実在表示がある場合のみ

---

7. Article Rules

- headline / description / image 必須
- author は実在人物または組織
- タイトルと headline を一致させる
- 更新時は dateModified を更新

---

8. FAQ Rules

- 実際に表示されているQ&Aのみ使用
- 表示内容と完全一致
- SEO目的の捏造FAQは禁止

---

9. Breadcrumb Rules

- UIと一致
- 正しい階層順
- 実URLのみ使用

---

10. WebSite / SearchAction

- 検索機能が存在する場合のみ使用
- 動作するURLのみ記載

---

11. Media Rules

- image はクロール可能URL
- VideoObject は動画ページのみ
- 存在しないメディアは禁止

---

12. Review Rules

- 実在レビューのみ
- 自作・捏造禁止
- AggregateRating は裏付け必須

---

13. Implementation Rules

- JSON-LD は安定位置に出力
- SSR / SSG を優先
- JS後付けはクロール確認必須
- 複数 schema は関係性を明示
- @id でエンティティ接続する

---

14. Prohibited Actions

- 表示されていない情報を書く
- keyword詰め込み
- 全ページ同一schema使い回し
- Product / Service 混同
- レビュー偽装
- FAQ乱造
- noindexページへの無意味な設置

---

15. Pre-Release Validation

- Rich Results Test 実行
- Search Console エラー確認
- 表示内容とJSON-LD一致確認
- title / H1 / schema の主語一致
- canonical と url の一致

---

16. Operational Rules

- schema はテンプレート単位で管理
- 共通コンポーネント化する
- 責務ごとに分離する
- 更新時は整合性確認
- 四半期ごとに見直す

---

17. Execution Rule（重要）

実装後は必ず以下を報告する：

- 使用した schema type
- 実装理由
- 検証結果（PASS / FAIL）
- 不明点または未対応項目

未実装の場合も理由を報告すること


Automatic Skill Selection Policy
- Codex, Antigravity, and Claude Code should proactively decide whether any skill is useful even when the user does not name a skill.
- Check project-local `.agent/skills` first.
- Treat `.agents/skills` as the compatibility path and keep it aligned to `.agent/skills`.
- If no project-local skill is sufficient, shared skills in `$HOME/.agents/skills` may be used as secondary references.
- If new requirements emerge during implementation, re-check the shared skill repository and add the smallest high-fit skills needed for the new scope.
- Prefer the smallest sufficient set of skills for the task.
- Do not use unrelated skills.
- Project requirements, `AGENTS.md`, source code, design docs, and existing implementation override generic skill guidance.
- Prioritize SEO, GEO, and structured-data skills when the task involves search visibility, AI discoverability, metadata, or schema implementation and validation.
- Report which skills were used and why.
- If no skill was used, report why not.
