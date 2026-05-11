-- Drop profiles.role column
--
-- 前提条件:
--   - user_roles が admin role の唯一のソースになっている (F-02 完了)
--   - getAppRole の profiles フォールバックを削除済み
--   - adminRegister / invite route が user_roles に書き込むよう修正済み
--   - updateStaffRole が user_roles に書き込むよう修正済み
--   - すべてのアクティブな admin について user_roles にレコードが存在する
--
-- 実行前確認クエリ:
--   SELECT p.id, p.role AS profiles_role, ur.role AS user_roles_role
--   FROM profiles p
--   LEFT JOIN user_roles ur ON p.id = ur.user_id
--   WHERE p.role IN ('owner', 'manager')
--     AND ur.user_id IS NULL;
--   → 0行であることを確認してから実行すること

ALTER TABLE profiles DROP COLUMN IF EXISTS role;
