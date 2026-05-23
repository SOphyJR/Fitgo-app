import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

const STEPS = [
  { id: 1, label: 'Head to store', sub: 'Sole Street, Bole', emoji: '🛵' },
  { id: 2, label: 'Pick up order', sub: 'Collect from store', emoji: '📦' },
  { id: 3, label: 'Deliver to customer', sub: 'Kazanchis, Addis Ababa', emoji: '📍' },
];

export default function Delivery() {
  const { orderId } = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [delivered, setDelivered] = useState(false);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      setDelivered(true);
    }
  };

  if (delivered) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>Delivered!</Text>
        <Text style={styles.successSub}>You earned ETB 420</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/driver')}>
          <Text style={styles.doneBtnText}>Back to Pickups</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Delivery</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Order info */}
      <View style={styles.orderCard}>
        <Text style={styles.orderId}>{orderId}</Text>
        <Text style={styles.orderItem}>Jordan 1 Retro</Text>
        <View style={styles.orderMeta}>
          <Text style={styles.orderMetaText}>👤 Abebe Girma</Text>
          <Text style={styles.orderMetaText}>📞 +251 91 234 5678</Text>
        </View>
      </View>

      {/* Map placeholder */}
      <View style={styles.mapBox}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapText}>Live navigation</Text>
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>ETA: 12 min</Text>
        </View>
      </View>

      {/* Steps */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepsTitle}>Delivery Steps</Text>
        {STEPS.map((step, index) => {
          const isDone = step.id < currentStep;
          const isActive = step.id === currentStep;
          return (
            <View key={step.id} style={[
              styles.stepCard,
              isActive && styles.stepCardActive,
              isDone && styles.stepCardDone,
            ]}>
              <Text style={styles.stepEmoji}>{step.emoji}</Text>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepLabel, isDone && styles.stepLabelDone]}>
                  {step.label}
                </Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
              {isDone && <Text style={styles.stepCheck}>✓</Text>}
              {isActive && <View style={styles.activeDot} />}
            </View>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleNextStep}>
          <Text style={styles.actionBtnText}>
            {currentStep === 1 && 'I arrived at store →'}
            {currentStep === 2 && 'Order picked up →'}
            {currentStep === 3 && 'Mark as Delivered ✓'}
          </Text>
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
    paddingTop: 56, paddingBottom: 16,
  },
  back: { fontSize: 15, color: 'rgba(245,243,238,0.5)' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#F5F3EE' },

  orderCard: {
    backgroundColor: '#1C1C1C', borderRadius: 16,
    padding: 18, marginHorizontal: 24, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  orderId: { fontSize: 13, color: '#FF3C2E', fontWeight: '700', marginBottom: 6 },
  orderItem: { fontSize: 18, fontWeight: '800', color: '#F5F3EE', marginBottom: 10 },
  orderMeta: { flexDirection: 'row', gap: 16 },
  orderMetaText: { fontSize: 13, color: 'rgba(245,243,238,0.5)' },

  mapBox: {
    backgroundColor: '#1C1C1C', borderRadius: 20,
    height: 140, marginHorizontal: 24,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, borderWidth: 1,
    borderColor: 'rgba(245,243,238,0.06)', position: 'relative',
  },
  mapEmoji: { fontSize: 40, marginBottom: 6 },
  mapText: { fontSize: 13, color: 'rgba(245,243,238,0.3)' },
  etaBadge: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: '#FF3C2E', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 100,
  },
  etaText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  scroll: { flex: 1, paddingHorizontal: 24 },
  stepsTitle: { fontSize: 16, fontWeight: '700', color: '#F5F3EE', marginBottom: 14 },

  stepCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1C1C1C', borderRadius: 14,
    padding: 16, marginBottom: 10, gap: 14,
    borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.06)',
  },
  stepCardActive: { borderColor: '#FF3C2E', backgroundColor: 'rgba(255,60,46,0.06)' },
  stepCardDone: { opacity: 0.5 },
  stepEmoji: { fontSize: 24 },
  stepInfo: { flex: 1 },
  stepLabel: { fontSize: 15, fontWeight: '700', color: '#F5F3EE', marginBottom: 3 },
  stepLabelDone: { textDecorationLine: 'line-through', color: 'rgba(245,243,238,0.4)' },
  stepSub: { fontSize: 12, color: 'rgba(245,243,238,0.4)' },
  stepCheck: { fontSize: 18, color: '#22c55e', fontWeight: '700' },
  activeDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#FF3C2E',
  },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1, borderTopColor: 'rgba(245,243,238,0.06)',
    padding: 20, paddingBottom: 32,
  },
  actionBtn: {
    backgroundColor: '#FF3C2E', borderRadius: 100,
    paddingVertical: 16, alignItems: 'center',
  },
  actionBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  successContainer: {
    flex: 1, backgroundColor: '#0A0A0A',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successEmoji: { fontSize: 80, marginBottom: 24 },
  successTitle: { fontSize: 48, fontWeight: '900', color: '#F5F3EE', marginBottom: 8 },
  successSub: { fontSize: 20, color: '#22c55e', fontWeight: '700', marginBottom: 48 },
  doneBtn: {
    backgroundColor: '#FF3C2E', paddingHorizontal: 40,
    paddingVertical: 16, borderRadius: 100,
  },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});