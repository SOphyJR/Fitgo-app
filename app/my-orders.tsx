import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { auth } from '@/config/firebase';
import { api } from '@/config/api';

const STATUS_COLORS: Record<string, string> = {
  pending: '#FF8C42',
  paid: '#3b82f6',
  preparing: '#FF3C2E',
  on_the_way: '#8b5cf6',
  delivered: '#22c55e',
};

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userData = await api.getUser(user.uid);
      if (!userData.error) {
        const data = await api.getCustomerOrders(userData.id);
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
        <View style={{ width: 50 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#FF3C2E" size="large" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyText}>No orders yet</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderTop}>
                <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.orderStore}>🏪 {order.store_name || 'FitGo Store'}</Text>
              <Text style={styles.orderAddress}>📍 {order.delivery_address}</Text>
              <View style={styles.orderBottom}>
                <Text style={styles.orderTotal}>ETB {parseFloat(order.total_amount).toLocaleString()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[order.status] || '#888') + '20' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] || '#888' }]}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20 },
  back: { fontSize: 15, color: 'rgba(245,243,238,0.5)' },
  title: { fontSize: 20, fontWeight: '800', color: '#F5F3EE' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyText: { fontSize: 16, color: 'rgba(245,243,238,0.4)', marginBottom: 24 },
  shopBtn: { backgroundColor: '#FF3C2E', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 100 },
  shopBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  list: { paddingHorizontal: 20 },
  orderCard: { backgroundColor: '#1C1C1C', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)' },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontSize: 13, color: '#FF3C2E', fontWeight: '700' },
  orderDate: { fontSize: 12, color: 'rgba(245,243,238,0.3)' },
  orderStore: { fontSize: 14, color: 'rgba(245,243,238,0.6)', marginBottom: 4 },
  orderAddress: { fontSize: 13, color: 'rgba(245,243,238,0.4)', marginBottom: 14 },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTotal: { fontSize: 18, fontWeight: '900', color: '#F5F3EE' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100 },
  statusText: { fontSize: 11, fontWeight: '700' },
});