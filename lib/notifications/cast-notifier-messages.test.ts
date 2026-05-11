import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildProfileImageApprovedMessage,
  buildProfileImageRejectedMessage,
  buildProfileTextApprovedMessage,
  buildProfileTextRejectedMessage,
  buildShiftApprovedMessage,
  buildShiftRejectedMessage,
  buildCheckinRejectedMessage,
  buildPostPublishedMessage,
  buildPostUnpublishedMessage,
} from './cast-notifier-messages';

describe('cast-notifier message builders', () => {
  describe('always include cast name', () => {
    const builders = [
      ['profile image approved', () => buildProfileImageApprovedMessage('みらん')],
      ['profile image rejected', () => buildProfileImageRejectedMessage('みらん')],
      ['profile text approved (all fields)', () => buildProfileTextApprovedMessage('みらん', { hobby: true, quizTags: true, comment: true })],
      ['profile text rejected', () => buildProfileTextRejectedMessage('みらん')],
      ['shift approved', () => buildShiftApprovedMessage('みらん', '2026-05-04')],
      ['shift rejected', () => buildShiftRejectedMessage('みらん', '2026-05-04')],
      ['checkin rejected', () => buildCheckinRejectedMessage('みらん', '2026-05-10')],
      ['post published', () => buildPostPublishedMessage('みらん')],
      ['post unpublished', () => buildPostUnpublishedMessage('みらん')],
    ] as const;

    for (const [label, fn] of builders) {
      it(`${label} contains the cast name`, () => {
        assert.match(fn(), /みらん/);
      });
    }
  });

  describe('profile text approved — changed-fields list', () => {
    it('lists only updated fields', () => {
      const msg = buildProfileTextApprovedMessage('A', {
        hobby: true,
        quizTags: false,
        comment: true,
      });
      assert.match(msg, /趣味/);
      assert.match(msg, /一言コメント/);
      assert.doesNotMatch(msg, /AI診断タグ/);
    });

    it('handles all-false (edge: nothing actually updated)', () => {
      const msg = buildProfileTextApprovedMessage('A', {
        hobby: false,
        quizTags: false,
        comment: false,
      });
      // 更新項目: 〔空〕として表示される。文言として空ではないことだけ保証
      assert.match(msg, /更新項目: /);
    });
  });

  describe('shift messages', () => {
    it('approved message mentions target week', () => {
      const msg = buildShiftApprovedMessage('A', '2026-05-04');
      assert.match(msg, /2026-05-04/);
      assert.match(msg, /承認/);
    });

    it('rejected message asks for resubmission', () => {
      const msg = buildShiftRejectedMessage('A', '2026-05-04');
      assert.match(msg, /2026-05-04/);
      assert.match(msg, /再度提出/);
    });
  });

  describe('checkin rejected message', () => {
    it('embeds the checkin date', () => {
      const msg = buildCheckinRejectedMessage('A', '2026-05-10');
      assert.match(msg, /2026-05-10/);
      assert.match(msg, /再度提出/);
    });
  });

  describe('post messages', () => {
    it('published reads positively', () => {
      const msg = buildPostPublishedMessage('A');
      assert.match(msg, /公開されました/);
    });

    it('unpublished asks to re-confirm', () => {
      const msg = buildPostUnpublishedMessage('A');
      assert.match(msg, /非公開/);
      assert.match(msg, /再度公開申請/);
    });
  });

  describe('format consistency', () => {
    it('all messages start with a bracketed category label', () => {
      const samples = [
        buildProfileImageApprovedMessage('A'),
        buildShiftApprovedMessage('A', '2026-05-04'),
        buildCheckinRejectedMessage('A', '2026-05-10'),
        buildPostPublishedMessage('A'),
      ];
      for (const msg of samples) {
        assert.match(msg, /^【.+?】/);
      }
    });
  });
});
