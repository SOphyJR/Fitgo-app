import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { auth } from '@/config/firebase';
import { api } from '@/config/api';

export default function PayRegistration() {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const userData = await api.getUser(currentUser.uid);

      const payment = await api.initiatePayment({
        amount: 1000,
        email: currentUser.email || '',
        first_name: userData.name?.split(' ')[0] || 'Seller',
        last_name: userData.name?.split(' ')[1] || '',
        tx_ref: `REG-${userData.id}`,
        phone_number: userData.phone || '',
      });

      if (payment.data?.checkout_url) {
        const { openURL } = await import('expo-linking');
        openURL(payment.data.checkout_url);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💳</Text>
      <Text style={styles.h1}>REGISTRATION{'\n'}<Text style={styles.red}>FEE.</Text></Text>
      <Text style={styles.sub}>Your 30-day free trial has ended. Pay the one-time registration fee to continue selling on FitGo.</Text>

      <View style={styles.priceCard}>
        <Text style={styles.priceLabel}>One-time registration fee</Text>
        <Text style={styles.price}>ETB 1,000</Text>
        <Text style={styles.priceNote}>Pay once, sell forever</Text>
      </View>

      <View style={styles.benefits}>
        {['Unlimited product listings', 'Access to FitGo customer base', 'Real-time order management', 'Seller dashboard analytics'].map((b, i) => (
          <View key={i} style={styles.benefit}>
            <Text style={styles.benefitCheck}>✓</Text>
            <Text style={styles.benefitText}>{b}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handlePay} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Pay with Chapa →</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.later}>I'll pay later</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', paddingHorizontal: 28, paddingTop: 80, paddingBottom: 48, alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 20 },
  h1: { fontSize: 48, fontWeight: '900', color: '#F5F3EE', lineHeight: 46, letterSpacing: 1, marginBottom: 16, textAlign: 'center' },
  red: { color: '#FF3C2E' },
  sub: { fontSize: 14, color: 'rgba(245,243,238,0.45)', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  priceCard: { backgroundColor: '#1C1C1C', borderRadius: 20, padding: 24, alignItems: 'center', width: '100%', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,60,46,0.3)' },
  priceLabel: { fontSize: 12, color: 'rgba(245,243,238,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  price: { fontSize: 42, fontWeight: '900', color: '#FF3C2E', marginBottom: 6 },
  priceNote: { fontSize: 12, color: 'rgba(245,243,238,0.3)' },
  benefits: { width: '100%', gap: 12, marginBottom: 32 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitCheck: { color: '#22c55e', fontSize: 16, fontWeight: '700' },
  benefitText: { fontSize: 14, color: 'rgba(245,243,238,0.6)' },
  btn: { width: '100%', backgroundColor: '#FF3C2E', paddingVertical: 16, borderRadius: 100, alignItems: 'center', marginBottom: 14 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  later: { color: 'rgba(245,243,238,0.3)', fontSize: 13 },
});