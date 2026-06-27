export type NotificationCategory =
  | "Approvals"
  | "System"
  | "Inquiries"
  | "Products";

export interface AppNotification {
  id: string;
  title: string;
  category: NotificationCategory;
  /** ISO timestamp; formatted relatively in the UI. */
  createdAt: string;
  read: boolean;
  href?: string;
}
