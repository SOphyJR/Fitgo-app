import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'FitGo Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF3C2E',
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

export async function sendLocalNotification(title: string, body: string, data?: any) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: 'default' },
    trigger: null,
  });
}

export async function sendOrderNotification(status: string, orderNumber: string) {
  const messages: Record<string, { title: string; body: string }> = {
    pending: { title: '✅ Order Placed!', body: `Order #${orderNumber} confirmed. Preparing your items.` },
    preparing: { title: '🔥 Order Preparing', body: `Your order #${orderNumber} is being prepared.` },
    on_the_way: { title: '🛵 Driver On The Way!', body: `Your order #${orderNumber} is on its way!` },
    delivered: { title: '🎉 Order Delivered!', body: `Order #${orderNumber} delivered. Enjoy!` },
    disputed: { title: '⚠️ Dispute Received', body: `Your report for #${orderNumber} is under review.` },
  };

  const msg = messages[status];
  if (msg) await sendLocalNotification(msg.title, msg.body);
}