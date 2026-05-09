import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { asApprovalActionState } from './approval-action';

describe('asApprovalActionState', () => {
  it('returns success when result.success is true', () => {
    assert.deepEqual(asApprovalActionState({ success: true }, 'fb'), { success: true });
  });

  it('returns failure with result.error when success is false', () => {
    assert.deepEqual(
      asApprovalActionState({ success: false, error: 'DB down' }, 'fb'),
      { success: false, error: 'DB down' },
    );
  });

  it('falls back to fallback string when error is missing', () => {
    assert.deepEqual(
      asApprovalActionState({ success: false }, '承認に失敗しました'),
      { success: false, error: '承認に失敗しました' },
    );
  });

  it('falls back when result is null or undefined', () => {
    assert.deepEqual(
      asApprovalActionState(null, 'fb'),
      { success: false, error: 'fb' },
    );
    assert.deepEqual(
      asApprovalActionState(undefined, 'fb'),
      { success: false, error: 'fb' },
    );
  });

  it('treats {success: undefined} as failure', () => {
    // 旧 wrapper のうっかり戻り値（success フィールド忘れ）が
    // 成功扱いされないことを担保
    assert.deepEqual(
      asApprovalActionState({}, 'fb'),
      { success: false, error: 'fb' },
    );
  });
});
