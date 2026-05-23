import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';

export default function Profile() {
  const user = auth.currentUser;

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.displayName || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Menu items */}
        <View style={styles.menu}>
          {[
            { emoji: '📦', label: 'My Orders', onPress: () => {} },
            { emoji: '❤️', label: 'Saved Items', onPress: () => {} },
            { emoji: '📍', label: 'Delivery Addresses', onPress: () => {} },
            { emoji: '🏪', label: 'Become a Seller', onPress: () => router.push('/seller') },
            { emoji: '🚗', label: 'Become a Driver', onPress: () => router.push('/driver') },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} onPress={item.onPress}>
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#F5F3EE' },

  avatarSection: { alignItems: 'center', paddingVertical: 32 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FF3C2E',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#fff' },
  name: { fontSize: 22, fontWeight: '800', color: '#F5F3EE', marginBottom: 4 },
  email: { fontSize: 14, color: 'rgba(245,243,238,0.4)' },

  menu: { paddingHorizontal: 24, gap: 10 },
  menuItem: {
    backgroundColor: '#1C1C1C', borderRadius: 16,
    padding: 18, flexDirection: 'row',
    alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  menuEmoji: { fontSize: 22 },
  menuLabel: { flex: 1, fontSize: 15, color: '#F5F3EE', fontWeight: '500' },
  menuArrow: { fontSize: 16, color: 'rgba(245,243,238,0.3)' },

  signOutBtn: {
    marginHorizontal: 24, marginTop: 24,
    backgroundColor: 'rgba(255,60,46,0.1)',
    borderRadius: 16, padding: 18,
    alignItems: 'center', borderWidth: 1,
    borderColor: 'rgba(255,60,46,0.2)',
  },
  signOutText: { color: '#FF3C2E', fontSize: 15, fontWeight: '700' },
});