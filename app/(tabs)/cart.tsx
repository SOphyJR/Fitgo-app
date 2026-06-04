import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Image } from 'react-native';

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const delivery = 150;
  const grandTotal = total + delivery;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerCount}>{items.length} items</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add some items to get started</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.shopBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
            {items.map(item => (
             <View key={`${item.id}-${item.size}`} style={styles.cartItem}>
                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={styles.itemImg} resizeMode="cover" />
                ) : (
                  <View style={[styles.itemImg, { backgroundColor: '#FFF0EF', alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSize}>Size: {item.size}</Text>
                  <Text style={styles.itemPrice}>ETB {(item.price * item.qty).toLocaleString()}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNum}>{item.qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>ETB {total.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>ETB {delivery}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>ETB {grandTotal.toLocaleString()}</Text>
              </View>
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => router.push('/checkout')}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Text style={styles.checkoutTotal}>ETB {grandTotal.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#F5F3EE' },
  headerCount: { fontSize: 14, color: 'rgba(245,243,238,0.4)' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#F5F3EE', marginBottom: 8 },
  emptySub: { fontSize: 14, color: 'rgba(245,243,238,0.4)', marginBottom: 32, textAlign: 'center' },
  shopBtn: {
    backgroundColor: '#FF3C2E', paddingHorizontal: 32,
    paddingVertical: 14, borderRadius: 100,
  },
  shopBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  list: { flex: 1, paddingHorizontal: 20 },

  cartItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1C1C1C', borderRadius: 16,
    padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
    gap: 12,
  },
  itemImg: {
    width: 72, height: 72, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  itemEmoji: { fontSize: 36 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#F5F3EE', marginBottom: 4 },
  itemSize: { fontSize: 12, color: 'rgba(245,243,238,0.4)', marginBottom: 6 },
  itemPrice: { fontSize: 15, fontWeight: '800', color: '#FF3C2E' },

  itemActions: { alignItems: 'flex-end', gap: 10 },
  removeBtn: {
    width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
  },
  removeBtnText: { fontSize: 13, color: 'rgba(245,243,238,0.3)' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, color: '#F5F3EE', fontWeight: '600' },
  qtyNum: { fontSize: 15, fontWeight: '700', color: '#F5F3EE', minWidth: 20, textAlign: 'center' },

  summary: {
    backgroundColor: '#1C1C1C', borderRadius: 16,
    padding: 20, marginTop: 8,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#F5F3EE', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: 'rgba(245,243,238,0.45)' },
  summaryValue: { fontSize: 14, color: '#F5F3EE', fontWeight: '500' },
  totalRow: {
    borderTopWidth: 1, borderTopColor: 'rgba(245,243,238,0.08)',
    paddingTop: 12, marginBottom: 0, marginTop: 4,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#F5F3EE' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#FF3C2E' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1, borderTopColor: 'rgba(245,243,238,0.06)',
    padding: 20, paddingBottom: 32,
  },
  checkoutBtn: {
    backgroundColor: '#FF3C2E', borderRadius: 100,
    paddingVertical: 16, paddingHorizontal: 24,
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  checkoutTotal: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '600' },
});