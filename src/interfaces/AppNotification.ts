
export const NotificationTypes = {
  WARNING: "Warning",
  ERROR: "Error",
  INFORMATION: "Information"
} as const;

export type NotificationType = typeof NotificationTypes[keyof typeof NotificationTypes];

export const NotificationCategories = {
  OUT_OF_ORDER: "Out of Order",
  VIDEO_PLAYER_FEEDBACK: "Video Player Feedback",
} as const;

export type NotificationCategory = typeof NotificationCategories[keyof typeof NotificationCategories];

export interface AppNotification {
  category: NotificationCategory
  message: string;
  isDismissible: boolean;
  timeout?: number;
  title: string;
  type: NotificationType;
}
