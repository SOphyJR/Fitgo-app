import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { api } from '@/config/api';
const [trialWarning, setTrialWarning] = useState('');

const checkSellerTrial = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const userData = await api.getUser(currentUser.uid);

    if (!userData || userData.error) return;

    const trial = await api.checkTrial(userData.id);

    if (trial.requiresPayment) {
      Alert.alert(
        '⚠️ Trial Expired',
        'Your 30-day free trial has ended. Pay the ETB 1,000 registration fee to continue selling on FitGo.',
        [
          {
            text: 'Pay Now',
            onPress: () => router.push('/seller/pay-registration'),
          },
          {
            text: 'Later',
            style: 'cancel',
          },
        ]
      );
    } else if (!trial.trialExpired) {
      const daysLeft = Math.ceil(
        (new Date(trial.trial_ends_at).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysLeft <= 7) {
        setTrialWarning(`⚠️ ${daysLeft} days left in your free trial`);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  checkSellerTrial();
}, []);

const STATS = [
  { label: 'Total Orders', value: '124', emoji: '📦' },
  { label: 'Revenue', value: 'ETB 48,200', emoji: '💰' },
  { label: 'Products', value: '18', emoji: '👕' },
  { label: 'Pending', value: '3', emoji: '⏳' },
];

const RECENT_ORDERS = [
  { id: '#FG-2847', item: 'Nike Air Force 1', status: 'Delivered', amount: 3500 },
  { id: '#FG-2846', item: 'Polo Shirt x2', status: 'On the Way', amount: 1700 },
  { id: '#FG-2845', item: 'Leather Bag', status: 'Preparing', amount: 1200 },
  { id: '#FG-2844', item: 'Classic Cap', status: 'Delivered', amount: 320 },
];

const STATUS_COLORS: Record<string, string> = {
  'Delivered': '#22c55e',
  'On the Way': '#FF8C42',
  'Preparing': '#FF3C2E',
};

export default function SellerDashboard() {
  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/');
  };
  

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Welcome back 👋</Text>
          <Text style={styles.headerTitle}>Seller Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/seller/add-product')}
          >
            <Text style={styles.actionEmoji}>➕</Text>
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/seller/orders')}
          >
            <Text style={styles.actionEmoji}>📋</Text>
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/seller/orders')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>

          {RECENT_ORDERS.map((order, i) => (
            <View key={i} style={styles.orderCard}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderItem}>{order.item}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>ETB {order.amount.toLocaleString()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] + '20' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] }]}>
                    {order.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 24,
    paddingTop: 56, paddingBottom: 20,
  },
  headerSub: { fontSize: 13, color: 'rgba(245,243,238,0.4)', marginBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#F5F3EE' },
  signOutBtn: {
    backgroundColor: 'rgba(255,60,46,0.12)',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, borderWidth: 1,
    borderColor: 'rgba(255,60,46,0.3)',
  },
  signOutText: { color: '#FF3C2E', fontSize: 13, fontWeight: '600' },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20, gap: 12, marginBottom: 20,
  },
  statCard: {
    width: '47%', backgroundColor: '#1C1C1C',
    borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  statEmoji: { fontSize: 28, marginBottom: 12 },
  statValue: { fontSize: 22, fontWeight: '900', color: '#F5F3EE', marginBottom: 4 },
  statLabel: { fontSize: 12, color: 'rgba(245,243,238,0.4)' },

  actions: {
    flexDirection: 'row', paddingHorizontal: 20,
    gap: 12, marginBottom: 28,
  },
  actionBtn: {
    flex: 1, backgroundColor: '#FF3C2E',
    borderRadius: 16, padding: 20,
    alignItems: 'center', gap: 8,
  },
  actionEmoji: { fontSize: 28 },
  actionText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  section: { paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#F5F3EE' },
  seeAll: { fontSize: 13, color: '#FF3C2E', fontWeight: '600' },

  orderCard: {
    backgroundColor: '#1C1C1C', borderRadius: 14,
    padding: 16, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  orderLeft: { flex: 1 },
  orderId: { fontSize: 12, color: '#FF3C2E', fontWeight: '700', marginBottom: 4 },
  orderItem: { fontSize: 14, color: '#F5F3EE', fontWeight: '500' },
  orderRight: { alignItems: 'flex-end', gap: 6 },
  orderAmount: { fontSize: 14, fontWeight: '800', color: '#F5F3EE' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  statusText: { fontSize: 11, fontWeight: '700' },
});