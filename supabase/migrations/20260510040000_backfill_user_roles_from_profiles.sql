-- ==========================================
-- user_roles バックフィル: profiles.role からの同期
-- ==========================================
-- 背景:
--   getAppRole() は user_roles を第一参照とし、空の場合 profiles.role に
--   フォールバックする二重ソース構造になっている。
--   一方で、本マイグレーションシリーズで追加・既存の admin RLS は
--   user_roles のみを参照する。
--
--   このため、profiles.role に admin ロールを持つが user_roles に
--   行が無いユーザーは:
--     - requireAdminLogin は通る（profiles.role フォールバック）
--     - しかし RLS は user_roles を見るため staffs / customers 等が
--       全く見えない (silent 0 rows)
--
--   症状: 「スタッフ登録したのに一覧に表示されない」
--   原因: 操作者本人の user_roles 行が無く、RLS が SELECT を空に絞る
--
-- 対策:
--   profiles.role が 'owner'/'manager'/'staff' で
--   user_roles に行が無いユーザーに対し、profiles.role を user_roles に
--   バックフィルする。これで RLS の admin チェックが通るようになる。
--
-- 注意:
--   profiles.role='staff' かつ user_roles.role='cast' のユーザー（17名）は
--   キャストとしての user_roles エントリを正規にもつケース（兼任）と
--   解釈し、本マイグレーションでは触らない。
--   問題は user_roles が完全欠損している admin のみが対象。

INSERT INTO public.user_roles (user_id, role)
SELECT p.id, p.role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
WHERE p.role IN ('owner', 'manager', 'staff')
  AND ur.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;
