import "../../scss/Notification.scss";

export default function NotificationToast({ message, type, isVisible, onClose }) {
  if (!isVisible || !message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}
