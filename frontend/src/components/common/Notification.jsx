import { useNotification } from '../../context/NotificationContext';
import './Notification.css';

export default function Notification() {
  const { notification } = useNotification();

  if (!notification.show) return null;

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  );
}
