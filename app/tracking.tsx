import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';

const STEPS = [
  { id: 1, label: 'Order Placed', sub: 'We received your order', emoji: '✅' },
  { id: 2, label: 'Preparing', sub: 'Store is packing your items', emoji: '📦' },
  { id: 3, label: 'On the Way', sub: 'Rider picked up your order', emoji: '🛵' },
  { id: 4, label: 'Delivered', sub: 'Enjoy your order!', emoji: '🎉' },
];

export default function Tracking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [eta, setEta] = useState(28);

  // simulate order progressing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 4) return prev + 1;
        clearInterval(interval);
        return prev;
      });
      setEta(prev => Math.max(0, prev - 7));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
          <Text style={styles.back}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Order ID */}
      <View style={styles.orderIdRow}>
        <Text style={styles.orderIdLabel}>Order ID</Text>
        <Text style={styles.orderId}>#FG-2847</Text>
      </View>

      {/* Map placeholder */}
      <View style={styles.mapBox}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapText}>Live map coming soon</Text>
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>
            {currentStep === 4 ? '🎉 Delivered!' : `🛵 ETA: ${eta} min`}
          </Text>
        </View>
      </View>

      {/* Steps */}
      <View style={styles.stepsBox}>
        <Text style={styles.stepsTitle}>Order Status</Text>
        {STEPS.map((step, index) => {
          const isDone = step.id <= currentStep;
          const isActive = step.id === currentStep;
          return (
            <View key={step.id} style={styles.stepRow}>
              {/* Line */}
              <View style={styles.stepLeft}>
                <View style={[
                  styles.stepDot,
                  isDone && styles.stepDotDone,
                  isActive && styles.stepDotActive,
                ]}>
                  <Text style={styles.stepDotText}>{isDone ? '✓' : ''}</Text>
                </View>
                {index < STEPS.length - 1 && (
                  <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                )}
              </View>
              {/* Content */}
              <View style={styles.stepContent}>
                <Text style={[styles.stepLabel, isDone && styles.stepLabelDone]}>
                  {step.emoji} {step.label}
                </Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Driver info */}
      <View style={styles.driverCard}>
        <View style={styles.driverAvatar}>
          <Text style={styles.driverAvatarText}>👨</Text>
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>Dawit Bekele</Text>
          <Text style={styles.driverSub}>Your delivery rider</Text>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Text style={styles.callBtnText}>📞 Call</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', paddingHorizontal: 24 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 56, paddingBottom: 20,
  },
  back: { fontSize: 15, color: 'rgba(245,243,238,0.5)' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#F5F3EE' },

  orderIdRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  orderIdLabel: { fontSize: 14, color: 'rgba(245,243,238,0.4)' },
  orderId: { fontSize: 15, fontWeight: '700', color: '#FF3C2E' },

  mapBox: {
    backgroundColor: '#1C1C1C', borderRadius: 20,
    height: 160, alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, borderWidth: 1,
    borderColor: 'rgba(245,243,238,0.06)', position: 'relative',
  },
  mapEmoji: { fontSize: 48, marginBottom: 8 },
  mapText: { fontSize: 13, color: 'rgba(245,243,238,0.3)' },
  etaBadge: {
    position: 'absolute', bottom: 14, right: 14,
    backgroundColor: '#FF3C2E', paddingHorizontal: 14,
    paddingVertical: 7, borderRadius: 100,
  },
  etaText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  stepsBox: {
    backgroundColor: '#1C1C1C', borderRadius: 20,
    padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  stepsTitle: { fontSize: 16, fontWeight: '700', color: '#F5F3EE', marginBottom: 20 },

  stepRow: { flexDirection: 'row', gap: 14, marginBottom: 4 },
  stepLeft: { alignItems: 'center', width: 24 },
  stepDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: '#FF3C2E', borderColor: '#FF3C2E' },
  stepDotActive: { backgroundColor: '#FF3C2E', borderColor: '#FF3C2E' },
  stepDotText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  stepLine: { width: 2, flex: 1, backgroundColor: 'rgba(245,243,238,0.08)', marginVertical: 3 },
  stepLineDone: { backgroundColor: '#FF3C2E' },

  stepContent: { flex: 1, paddingBottom: 16 },
  stepLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(245,243,238,0.4)', marginBottom: 2 },
  stepLabelDone: { color: '#F5F3EE' },
  stepSub: { fontSize: 12, color: 'rgba(245,243,238,0.3)' },

  driverCard: {
    backgroundColor: '#1C1C1C', borderRadius: 20,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  driverAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  driverAvatarText: { fontSize: 24 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontWeight: '700', color: '#F5F3EE' },
  driverSub: { fontSize: 12, color: 'rgba(245,243,238,0.4)' },
  callBtn: {
    backgroundColor: 'rgba(255,60,46,0.12)', paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 100,
    borderWidth: 1, borderColor: 'rgba(255,60,46,0.3)',
  },
  callBtnText: { color: '#FF3C2E', fontSize: 13, fontWeight: '600' },
});