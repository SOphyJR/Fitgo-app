import { Text } from 'react-native';
import { Tabs } from 'expo-router';

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 20, opacity: color === '#FF3C2E' ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          borderTopColor: 'rgba(245,243,238,0.08)',
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#FF3C2E',
        tabBarInactiveTintColor: 'rgba(245,243,238,0.4)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color }) => <TabIcon emoji="🔍" color={color} /> }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart', tabBarIcon: ({ color }) => <TabIcon emoji="🛒" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} /> }} />
    </Tabs>
  );
}