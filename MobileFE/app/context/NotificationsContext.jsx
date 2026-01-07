import { createContext, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { registerForPushNotificationsAsync, setupNotificationListeners } from '../services/notifications';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext({});

export function NotificationsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const notificationListenerRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotificationsAsync();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const navigateToScreen = (screen, params) => {
        if (screen === 'messages') {
          router.push('/messages');
        } else if (screen === 'znamky') {
          router.push('/znamky');
        } else if (screen === 'rozvrh') {
          router.push('/rozvrh');
        } else if (screen === 'message-detail' && params?.messageId) {
          router.push({
            pathname: '/message-detail',
            params: { messageId: params.messageId },
          });
        } else if (screen === 'grade-detail' && params?.gradeId) {
          router.push({
            pathname: '/grade-detail',
            params: { gradeId: params.gradeId },
          });
        } else if (screen === 'subject-detail' && params?.subjectId) {
          router.push({
            pathname: '/subject-detail',
            params: { subjectId: params.subjectId },
          });
        }
      };

      const cleanup = setupNotificationListeners(navigateToScreen);
      notificationListenerRef.current = cleanup;
      
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [isAuthenticated, router]);

  return (
    <NotificationsContext.Provider value={{}}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}

