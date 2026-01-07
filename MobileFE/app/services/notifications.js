import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token!');
      return null;
    }
    
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync();
      token = tokenData.data;
      
      console.log('Push token:', token);
      await AsyncStorage.setItem('pushToken', token);
      
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export function setupNotificationListeners(navigationCallback) {
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('User tapped notification:', response);
    const data = response.notification.request.content.data;
    
    if (navigationCallback && data?.screen) {
      navigationCallback(data.screen, data.params || {});
    }
  });

  return () => {
    if (notificationListener) {
      notificationListener.remove();
    }
    if (responseListener) {
      responseListener.remove();
    }
  };
}

export async function getStoredPushToken() {
  try {
    return await AsyncStorage.getItem('pushToken');
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

