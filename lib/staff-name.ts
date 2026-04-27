/** Combine 苗字 + 名 into a single 氏名 for the legacy `staffs.name` column. */
export function combineStaffFullName(family: string, given: string): string {
  return [family.trim(), given.trim()]
    .filter((part) => part.length > 0)
    .join(' ');
}

export function splitStaffFullName(full: string): { family: string; given: string } {
  const t = full.trim();
  const i = t.indexOf(' ');
  if (i === -1) {
    return { family: t, given: '' };
  }
  return { family: t.slice(0, i), given: t.slice(i + 1).trim() };
}
