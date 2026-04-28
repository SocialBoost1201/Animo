/**
 * Classify server action return from submitRecruitApplication without using `in` / truthy patterns that can throw.
 */
export function classifyRecruitSubmitResult(
  result: unknown,
):
  | { outcome: 'error'; message: string }
  | { outcome: 'success' }
  | { outcome: 'unknown' } {
  if (result === null || result === undefined) {
    return { outcome: 'unknown' };
  }
  if (typeof result !== 'object') {
    return { outcome: 'unknown' };
  }
  const r = result as Record<string, unknown>;
  const errVal = r.error;
  if (typeof errVal === 'string' && errVal.length > 0) {
    return { outcome: 'error', message: errVal };
  }
  if (r.success === true) {
    return { outcome: 'success' };
  }
  return { outcome: 'unknown' };
}
