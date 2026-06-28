/** Roles mirror the backend's RBAC. Order is least → most privileged. */
export const ROLES = ["VIEWER", "EDITOR", "ADMIN", "SUPER_ADMIN"] as const;

export type Role = (typeof ROLES)[number];

/** Numeric rank for "at least this role" checks. */
export const ROLE_RANK: Record<Role, number> = {
  VIEWER: 0,
  EDITOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export function hasAtLeastRole(role: Role, required: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

/**
 * The Fanisi backend returns a lowercase `roleSlug`; the dashboard's RBAC uses
 * the uppercase Role enum. Confirmed tenant roles are exactly `admin`, `staff`,
 * `distributor`, `customer` (no editor/super_admin at the tenant level —
 * super_admin is a separate platform role). `admin` is the highest tenant role,
 * so it maps to the dashboard's top role for full access; distributors/customers
 * are not admin-dashboard users → least-privileged VIEWER.
 */
export function roleFromSlug(slug: string): Role {
  switch (slug.toLowerCase()) {
    case "admin":
      return "SUPER_ADMIN";
    case "staff":
      return "EDITOR";
    default:
      // distributor, customer, anything unknown
      return "VIEWER";
  }
}
