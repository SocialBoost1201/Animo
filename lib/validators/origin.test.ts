import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { isAllowedOrigin, isUuid, UUID_PATTERN } from './origin';

describe('isAllowedOrigin', () => {
  it('returns false when origin is null or empty', () => {
    assert.equal(isAllowedOrigin(null, 'https://app.example.com'), false);
    assert.equal(isAllowedOrigin('', 'https://app.example.com'), false);
    assert.equal(isAllowedOrigin(undefined, 'https://app.example.com'), false);
  });

  it('matches the configured app URL', () => {
    assert.equal(
      isAllowedOrigin('https://app.example.com', 'https://app.example.com'),
      true,
    );
  });

  it('rejects different scheme even on same host', () => {
    assert.equal(
      isAllowedOrigin('http://app.example.com', 'https://app.example.com'),
      false,
    );
  });

  it('rejects subdomain not in allowlist', () => {
    assert.equal(
      isAllowedOrigin('https://other.example.com', 'https://app.example.com'),
      false,
    );
  });

  it('allows localhost in dev regardless of appUrl', () => {
    assert.equal(isAllowedOrigin('http://localhost:3000', null), true);
    assert.equal(isAllowedOrigin('http://127.0.0.1:3000', null), true);
  });

  it('rejects localhost on non-3000 port', () => {
    assert.equal(isAllowedOrigin('http://localhost:4000', null), false);
  });

  it('rejects evil origin even when appUrl is unset', () => {
    assert.equal(
      isAllowedOrigin('https://evil.example.com', undefined),
      false,
    );
  });
});

describe('isUuid / UUID_PATTERN', () => {
  it('accepts a valid v4 UUID', () => {
    assert.equal(isUuid('550e8400-e29b-41d4-a716-446655440000'), true);
  });

  it('accepts upper-case hex', () => {
    assert.equal(isUuid('550E8400-E29B-41D4-A716-446655440000'), true);
  });

  it('rejects non-string', () => {
    assert.equal(isUuid(null), false);
    assert.equal(isUuid(undefined), false);
    assert.equal(isUuid(12345), false);
    assert.equal(isUuid({}), false);
  });

  it('rejects malformed strings', () => {
    assert.equal(isUuid(''), false);
    assert.equal(isUuid('not-a-uuid'), false);
    assert.equal(isUuid('550e8400-e29b-41d4-a716'), false);
    // wrong version digit (UUID v6 — not in our pattern)
    assert.equal(isUuid('550e8400-e29b-61d4-a716-446655440000'), false);
    // SQL injection attempt
    assert.equal(isUuid("'; DROP TABLE cast_posts; --"), false);
  });

  it('UUID_PATTERN exposes the regex for reuse', () => {
    assert.ok(UUID_PATTERN.test('550e8400-e29b-41d4-a716-446655440000'));
  });
});
