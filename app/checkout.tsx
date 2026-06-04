import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { api } from '@/config/api';
import { auth } from '@/config/firebase';

import { useCart } from '@/context/CartContext';

export default function Checkout() {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [payMethod, setPayMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

// Inside component:
const { items, total, clearCart } = useCart();
const delivery = 150;
const grandTotal = total + delivery;

const handleOrder = async () => {
  if (!address || !phone) {
    alert('Please fill in delivery address and phone number');
    return;
  }

  if (items.length === 0) {
    alert('Your cart is empty');
    return;
  }

  setLoading(true);

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userData = await api.getUser(currentUser.uid);
    if (!userData || userData.error) {
      alert('User not found. Please log in again.');
      return;
    }

    // 1. Create order first
    const order = await api.createOrder({
      customer_id: userData.id,
      store_id: items[0]?.store_id,
      items: items.map(item => ({
        product_id: item.id,
        quantity: item.qty,
        size: item.size,
        price: item.price,
      })),
      total_amount: grandTotal,
      delivery_address: address,
      delivery_phone: phone,
      payment_method: payMethod,
    });

    // 2. Handle Chapa payment
    if (payMethod === 'chapa') {
      const nameParts = (currentUser.displayName || 'FitGo User').split(' ');

      const payment = await api.initiatePayment({
        amount: grandTotal,
        email: currentUser.email || '',
        first_name: nameParts[0] || 'FitGo',
        last_name: nameParts[1] || 'User',
        tx_ref: order.id,
        phone_number: userData.phone || '',
      });

      if (payment.data?.checkout_url) {
        const { openURL } = await import('expo-linking');
        openURL(payment.data.checkout_url);
        return;
      }
    }

    clearCart();
    router.push(`/tracking?orderId=${order.id}`);
  } catch (e) {
    alert('Failed to place order. Try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* Delivery Address */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.inputWrap}>
          <Text style={styles.label}>FULL ADDRESS</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Bole, near Edna Mall..."
            placeholderTextColor="rgba(245,243,238,0.2)"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>
        <View style={styles.inputWrap}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <TextInput
            style={styles.input}
            placeholder="+251 9..."
            placeholderTextColor="rgba(245,243,238,0.2)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.payMethods}>
          {[
            { id: 'cash', label: 'Cash on Delivery', emoji: '💵' },
            { id: 'telebirr', label: 'Telebirr', emoji: '📱' },
            { id: 'cbe', label: 'CBE Birr', emoji: '🏦' },
          ].map(method => (
            <TouchableOpacity
              key={method.id}
              style={[styles.payCard, payMethod === method.id && styles.payCardActive]}
              onPress={() => setPayMethod(method.id)}
            >
              <Text style={styles.payEmoji}>{method.emoji}</Text>
              <Text style={[styles.payLabel, payMethod === method.id && styles.payLabelActive]}>
                {method.label}
              </Text>
              <View style={[styles.radio, payMethod === method.id && styles.radioActive]}>
                {payMethod === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

       {/* Order Summary */}
<Text style={styles.sectionTitle}>Order Summary</Text>
<View style={styles.summary}>
  {items.map((item, i) => (
    <View key={i} style={styles.summaryItem}>
      <Text style={styles.summaryName}>{item.name} x{item.qty}</Text>
      <Text style={styles.summaryPrice}>ETB {(item.price * item.qty).toLocaleString()}</Text>
    </View>
  ))}
  <View style={styles.divider} />
  <View style={styles.summaryItem}>
    <Text style={styles.summaryLabel}>Delivery</Text>
    <Text style={styles.summaryPrice}>ETB 150</Text>
  </View>
  <View style={styles.summaryItem}>
    <Text style={styles.totalLabel}>Total</Text>
    <Text style={styles.totalPrice}>ETB {grandTotal.toLocaleString()}</Text>
  </View>
</View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Place Order */}
      <View style={styles.bottomBar}>
    <TouchableOpacity
  style={[styles.orderBtn, loading && { opacity: 0.6 }]}
  onPress={handleOrder}
  disabled={loading}
>
  {loading
    ? <ActivityIndicator color="#fff" />
    : <Text style={styles.orderBtnText}>Place Order →</Text>
  }
</TouchableOpacity>
      </View>

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
  back: { fontSize: 15, color: 'rgba(245,243,238,0.5)' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#F5F3EE' },

  scroll: { flex: 1, paddingHorizontal: 24 },

  sectionTitle: {
    fontSize: 18, fontWeight: '800',
    color: '#F5F3EE', marginBottom: 14, marginTop: 8,
  },

  inputWrap: { marginBottom: 14 },
  label: {
    fontSize: 11, fontWeight: '600',
    color: 'rgba(245,243,238,0.4)',
    letterSpacing: 1.5, marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.08)',
    borderRadius: 14, padding: 16,
    color: '#F5F3EE', fontSize: 15, marginBottom: 4,
  },

  payMethods: { gap: 10, marginBottom: 24 },
  payCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1C1C1C', borderRadius: 16,
    padding: 16, gap: 14,
    borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.06)',
  },
  payCardActive: { borderColor: '#FF3C2E', backgroundColor: 'rgba(255,60,46,0.06)' },
  payEmoji: { fontSize: 24 },
  payLabel: { flex: 1, fontSize: 15, color: 'rgba(245,243,238,0.6)', fontWeight: '500' },
  payLabelActive: { color: '#F5F3EE' },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: 'rgba(245,243,238,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: '#FF3C2E' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF3C2E' },

  summary: {
    backgroundColor: '#1C1C1C', borderRadius: 16,
    padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  summaryItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryName: { fontSize: 14, color: 'rgba(245,243,238,0.6)' },
  summaryLabel: { fontSize: 14, color: 'rgba(245,243,238,0.6)' },
  summaryPrice: { fontSize: 14, color: '#F5F3EE', fontWeight: '500' },
  divider: {
    height: 1, backgroundColor: 'rgba(245,243,238,0.06)', marginBottom: 12,
  },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#F5F3EE' },
  totalPrice: { fontSize: 18, fontWeight: '900', color: '#FF3C2E' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1, borderTopColor: 'rgba(245,243,238,0.06)',
    padding: 20, paddingBottom: 32,
  },
  orderBtn: {
    backgroundColor: '#FF3C2E', borderRadius: 100,
    paddingVertical: 16, alignItems: 'center',
  },
  orderBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});