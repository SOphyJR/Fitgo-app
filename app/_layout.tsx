import { registerForPushNotifications } from '@/app/utils/notifications';
import { api } from '@/config/api';
import { auth } from '@/config/firebase';
import { CartProvider } from '@/context/CartContext';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    registerPush();
  }, []);

  const registerPush = async () => {
    const token = await registerForPushNotifications();
    if (token && auth.currentUser) {
      await api.savePushToken(auth.currentUser.uid, token);
    }
  };

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}