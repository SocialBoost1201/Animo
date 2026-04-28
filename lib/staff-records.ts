/** Staff master row shape and UI mapping (non-server, safe to import from client and server). */

export type StaffSlave = {
  id: string;
  name: string;
  family_name: string | null;
  given_name: string | null;
  display_name: string;
  mobile_phone: string | null;
  line_id: string | null;
  role: string | null;
  is_active: boolean;
  created_at: string;
};

export type StaffTableRow = {
  id: string;
  name: string;
  family_name?: string | null;
  given_name?: string | null;
  display_name: string;
  mobile_phone?: string | null;
  line_id?: string | null;
  role?: string | null;
  is_active: boolean;
  created_at: string;
};

export function mapRowToStaffSlave(row: StaffTableRow): StaffSlave {
  return {
    id: row.id,
    name: row.name,
    family_name: row.family_name ?? null,
    given_name: row.given_name ?? null,
    display_name: row.display_name,
    mobile_phone: row.mobile_phone ?? null,
    line_id: row.line_id ?? null,
    role: row.role ?? null,
    is_active: row.is_active,
    created_at: row.created_at,
  };
}
