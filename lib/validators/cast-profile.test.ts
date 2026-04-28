import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { matchesCastRegisterIdentity } from './cast-profile';

describe('matchesCastRegisterIdentity', () => {
  it('matches the submitted stage name against the cast stage_name, not name_kana', () => {
    const isMatch = matchesCastRegisterIdentity({
      candidateRealName: '山田 花子',
      candidatePhone: '090-1234-5678',
      candidateStageName: 'みさと',
      candidateNameKana: 'ミサト',
      submittedRealName: '山田花子',
      submittedPhone: '09012345678',
      submittedStageName: 'みさと',
      submittedNameKana: '',
    });

    assert.equal(isMatch, true);
  });
});
