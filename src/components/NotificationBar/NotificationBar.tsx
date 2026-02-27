import { NotificationTypes, type AppNotification, type NotificationType } from "../../interfaces/AppNotification";
import './NotificationBar.css';

interface NotificationBarProps {
  notifications: Set<AppNotification>;
  removeNotifications: (notifications: AppNotification[]) => void;
}

const NotificationBar = ({ notifications, removeNotifications }: NotificationBarProps) => {


  const getClassNameFromType = (type: NotificationType): string => {
    switch (type) {
      case NotificationTypes.ERROR:
        return 'notification-error';
      case NotificationTypes.WARNING:
        return 'notification-warning';
      case NotificationTypes.INFORMATION:
      default:
        return 'notification-information';
    }
  };
  
  return (
    <>
      <div className="flex-row section-row">
        <div className="flex-column full-width">
          {Array.from(notifications).map((notification, index) => {
              return (
                  <div key={index} className={`flex-row spaced-between-row notification ${getClassNameFromType(notification.type)}`}>
                    <button onClick={() => removeNotifications([notification])}>
                      <span>
                        {notification.message}
                      </span>
                      <span>
                        X
                      </span>
                    </button>
                  </div>
              );
          })}
        </div>
      </div>
    </>
  );
};

export default NotificationBar;
