import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const ORDERS = [
  { id: '#FG-2847', item: 'Nike Air Force 1', customer: 'Abebe Girma', address: 'Bole, Addis Ababa', status: 'Delivered', amount: 3500, time: '2 hrs ago' },
  { id: '#FG-2846', item: 'Polo Shirt x2', customer: 'Tigist Haile', address: 'Kazanchis, Addis Ababa', status: 'On the Way', amount: 1700, time: '3 hrs ago' },
  { id: '#FG-2845', item: 'Leather Bag', customer: 'Dawit Bekele', address: 'Piazza, Addis Ababa', status: 'Preparing', amount: 1200, time: '4 hrs ago' },
  { id: '#FG-2844', item: 'Classic Cap', customer: 'Sara Tesfaye', address: 'CMC, Addis Ababa', status: 'Delivered', amount: 320, time: '5 hrs ago' },
  { id: '#FG-2843', item: 'Jordan 1 Retro', customer: 'Yonas Alemu', address: 'Gerji, Addis Ababa', status: 'Preparing', amount: 4200, time: '6 hrs ago' },
];

const STATUS_COLORS: Record<string, string> = {
  'Delivered': '#22c55e',
  'On the Way': '#FF8C42',
  'Preparing': '#FF3C2E',
};

export default function SellerOrders() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Orders</Text>
        <Text style={styles.headerCount}>{ORDERS.length} orders</Text>
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filters}>
        {['All', 'Preparing', 'On the Way', 'Delivered'].map(f => (
          <TouchableOpacity key={f} style={[styles.filter, f === 'All' && styles.filterActive]}>
            <Text style={[styles.filterText, f === 'All' && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {ORDERS.map((order, i) => (
          <View key={i} style={styles.orderCard}>
            <View style={styles.orderTop}>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderTime}>{order.time}</Text>
            </View>
            <Text style={styles.orderItem}>{order.item}</Text>
            <Text style={styles.orderCustomer}>👤 {order.customer}</Text>
            <Text style={styles.orderAddress}>📍 {order.address}</Text>
            <View style={styles.orderBottom}>
              <Text style={styles.orderAmount}>ETB {order.amount.toLocaleString()}</Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] + '20' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] }]}>
                  {order.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
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
  back: { fontSize: 15, color: 'rgba(245,243,238,0.5)' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#F5F3EE' },
  headerCount: { fontSize: 13, color: 'rgba(245,243,238,0.4)' },


  filters: { paddingHorizontal: 24, gap: 8 },
 filtersScroll: { marginBottom: 16, maxHeight: 44 },
filter: {
  paddingHorizontal: 18, paddingVertical: 8,
  borderRadius: 100, borderWidth: 1,
  borderColor: 'rgba(245,243,238,0.1)',
  height: 36,
  alignItems: 'center',
  justifyContent: 'center',
},
  filterActive: { backgroundColor: '#FF3C2E', borderColor: '#FF3C2E' },
  filterText: { fontSize: 13, color: 'rgba(245,243,238,0.5)', fontWeight: '500' },
  filterTextActive: { color: '#fff' },

  list: { flex: 1, paddingHorizontal: 20 },
  orderCard: {
    backgroundColor: '#1C1C1C', borderRadius: 16,
    padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  orderTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: { fontSize: 13, color: '#FF3C2E', fontWeight: '700' },
  orderTime: { fontSize: 12, color: 'rgba(245,243,238,0.3)' },
  orderItem: { fontSize: 16, fontWeight: '700', color: '#F5F3EE', marginBottom: 8 },
  orderCustomer: { fontSize: 13, color: 'rgba(245,243,238,0.5)', marginBottom: 4 },
  orderAddress: { fontSize: 13, color: 'rgba(245,243,238,0.5)', marginBottom: 14 },
  orderBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  orderAmount: { fontSize: 18, fontWeight: '900', color: '#F5F3EE' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  statusText: { fontSize: 12, fontWeight: '700' },
});