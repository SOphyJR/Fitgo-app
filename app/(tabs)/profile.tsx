import { api } from '@/config/api';
import { auth } from '@/config/firebase';
import { router } from 'expo-router';
import { deleteUser, signOut } from 'firebase/auth';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
export default function Profile() {
  const user = auth.currentUser;
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      api.getUser(user.uid).then(data => {
        if (!data.error) setUserData(data);
      });
    }
  }, []);
  
const handleDeleteAccount = async () => {
  Alert.alert(
    'Delete Account',
    'Are you sure? This will permanently delete your account. This cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            await api.deleteAccount(currentUser.uid);
            await deleteUser(currentUser);
            router.replace('/');
          } catch (e) {
            Alert.alert('Error', 'Failed to delete account. Please try again.');
          }
        },
      },
    ]
  );
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
         <Text style={styles.name}>{userData?.name || user?.displayName || 'User'}</Text>
<Text style={styles.email}>{user?.email}</Text>
<Text style={styles.phone}>{userData?.phone || ''}</Text>
        </View>

        {/* Menu items */}
        <View style={styles.menu}>
          {[
           { emoji: '📦', label: 'My Orders', onPress: () => router.push('/my-orders') },
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
        
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
  <Text style={styles.deleteBtnText}>Delete Account</Text>
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
  phone: { fontSize: 13, color: 'rgba(245,243,238,0.3)', marginTop: 2 },
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

deleteBtn: {
  marginHorizontal: 24, marginTop: 12,
  borderRadius: 16, padding: 16,
  alignItems: 'center', borderWidth: 1,
  borderColor: 'rgb(250, 17, 0)',
},
deleteBtnText: { color: 'rgb(245, 243, 238)', fontSize: 14 },
});