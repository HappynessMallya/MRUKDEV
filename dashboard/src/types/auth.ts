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
 * The Fanisi backend returns a lowercase `roleSlug` (e.g. "admin",
 * "super_admin", "distributor"); the dashboard's RBAC uses the uppercase Role
 * enum. Map known admin/staff slugs onto roles; everything else (customer,
 * distributor, unknown) falls back to the least-privileged VIEWER.
 *
 * NOTE: confirm the exact admin role slug(s) the backend seeds for the `mr-uk`
 * tenant and extend this map accordingly.
 */
export function roleFromSlug(slug: string): Role {
  switch (slug.toLowerCase()) {
    case "super_admin":
    case "superadmin":
    case "owner":
      return "SUPER_ADMIN";
    case "admin":
      return "ADMIN";
    case "editor":
    case "manager":
    case "staff":
      return "EDITOR";
    default:
      return "VIEWER";
  }
}
