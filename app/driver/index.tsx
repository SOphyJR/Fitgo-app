import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';

const AVAILABLE_ORDERS = [
  { id: '#FG-2848', item: 'Jordan 1 Retro', pickup: 'Sole Street, Bole', dropoff: 'Kazanchis, Addis Ababa', amount: 4200, distance: '2.4 km', time: '12 min' },
  { id: '#FG-2849', item: 'Leather Bag', pickup: 'Addis Leather, Piazza', dropoff: 'CMC, Addis Ababa', amount: 1200, distance: '4.1 km', time: '18 min' },
  { id: '#FG-2850', item: 'Polo Shirt x2', pickup: 'Urban Threads, Bole', dropoff: 'Gerji, Addis Ababa', amount: 1700, distance: '3.2 km', time: '15 min' },
];

export default function DriverHome() {
  const [online, setOnline] = useState(true);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/');
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Driver Mode</Text>
          <Text style={styles.headerTitle}>Available Pickups</Text>
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Online toggle */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <View style={[styles.statusDot, { backgroundColor: online ? '#22c55e' : '#888' }]} />
          <Text style={styles.statusText}>{online ? 'You are Online' : 'You are Offline'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.toggleBtn, online && styles.toggleBtnActive]}
          onPress={() => setOnline(!online)}
        >
          <Text style={styles.toggleBtnText}>{online ? 'Go Offline' : 'Go Online'}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>ETB 320</Text>
          <Text style={styles.statLabel}>Today's earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Deliveries today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>⭐ 4.9</Text>
          <Text style={styles.statLabel}>Your rating</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {online ? `${AVAILABLE_ORDERS.length} orders near you` : 'Go online to see orders'}
        </Text>

        {online && AVAILABLE_ORDERS.map((order, i) => (
          <View key={i} style={styles.orderCard}>
            <View style={styles.orderTop}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{order.distance}</Text>
              </View>
            </View>

            <Text style={styles.orderItem}>{order.item}</Text>

            <View style={styles.routeRow}>
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: '#FF3C2E' }]} />
                <Text style={styles.routeText}>{order.pickup}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: '#22c55e' }]} />
                <Text style={styles.routeText}>{order.dropoff}</Text>
              </View>
            </View>

            <View style={styles.orderBottom}>
              <View>
                <Text style={styles.orderEarning}>ETB {Math.round(order.amount * 0.1)}</Text>
                <Text style={styles.orderEarningLabel}>Your earning · {order.time}</Text>
              </View>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => router.push(`/driver/delivery?orderId=${order.id}`)}
              >
                <Text style={styles.acceptBtnText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {!online && (
          <View style={styles.offlineBox}>
            <Text style={styles.offlineEmoji}>😴</Text>
            <Text style={styles.offlineText}>You're offline</Text>
            <Text style={styles.offlineSub}>Toggle online to start receiving orders</Text>
          </View>
        )}

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
    paddingTop: 56, paddingBottom: 16,
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

  statusBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginHorizontal: 24,
    backgroundColor: '#1C1C1C', borderRadius: 16,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontSize: 14, fontWeight: '600', color: '#F5F3EE' },
  toggleBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100,
  },
  toggleBtnActive: { backgroundColor: 'rgba(255,60,46,0.15)' },
  toggleBtnText: { fontSize: 13, color: '#F5F3EE', fontWeight: '600' },

  statsRow: {
    flexDirection: 'row', paddingHorizontal: 24,
    gap: 10, marginBottom: 20,
  },
  statCard: {
    flex: 1, backgroundColor: '#1C1C1C',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  statValue: { fontSize: 16, fontWeight: '800', color: '#F5F3EE', marginBottom: 4 },
  statLabel: { fontSize: 10, color: 'rgba(245,243,238,0.4)' },

  sectionTitle: {
    fontSize: 16, fontWeight: '700',
    color: 'rgba(245,243,238,0.5)',
    paddingHorizontal: 24, marginBottom: 14,
  },

  orderCard: {
    backgroundColor: '#1C1C1C', borderRadius: 20,
    padding: 20, marginHorizontal: 24,
    marginBottom: 14, borderWidth: 1,
    borderColor: 'rgba(245,243,238,0.06)',
  },
  orderTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  orderId: { fontSize: 13, color: '#FF3C2E', fontWeight: '700' },
  distanceBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100,
  },
  distanceText: { fontSize: 12, color: 'rgba(245,243,238,0.6)', fontWeight: '500' },
  orderItem: { fontSize: 17, fontWeight: '800', color: '#F5F3EE', marginBottom: 16 },

  routeRow: { marginBottom: 16, gap: 6 },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  routeText: { fontSize: 13, color: 'rgba(245,243,238,0.55)', flex: 1 },
  routeLine: {
    width: 2, height: 16, backgroundColor: 'rgba(245,243,238,0.1)',
    marginLeft: 3,
  },

  orderBottom: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1, borderTopColor: 'rgba(245,243,238,0.06)',
    paddingTop: 14,
  },
  orderEarning: { fontSize: 20, fontWeight: '900', color: '#22c55e' },
  orderEarningLabel: { fontSize: 11, color: 'rgba(245,243,238,0.4)', marginTop: 2 },
  acceptBtn: {
    backgroundColor: '#FF3C2E', paddingHorizontal: 28,
    paddingVertical: 12, borderRadius: 100,
  },
  acceptBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  offlineBox: { alignItems: 'center', paddingTop: 60 },
  offlineEmoji: { fontSize: 56, marginBottom: 16 },
  offlineText: { fontSize: 20, fontWeight: '800', color: '#F5F3EE', marginBottom: 8 },
  offlineSub: { fontSize: 14, color: 'rgba(245,243,238,0.4)', textAlign: 'center' },
});