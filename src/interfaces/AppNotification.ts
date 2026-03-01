
export const NotificationTypes = {
  WARNING: "Warning",
  ERROR: "Error",
  INFORMATION: "Information"
} as const;

export type NotificationType = typeof NotificationTypes[keyof typeof NotificationTypes];

export interface AppNotification {
  message: string;
  isDismissible: boolean;
  title: string;
  type: NotificationType;
}
