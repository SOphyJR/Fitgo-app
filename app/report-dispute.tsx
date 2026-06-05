import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { auth } from '@/config/firebase';
import { api } from '@/config/api';

const DISPUTE_TYPES = [
  { id: 'not_delivered', label: 'Order not delivered', emoji: '📦' },
  { id: 'wrong_item', label: 'Wrong item delivered', emoji: '❌' },
  { id: 'damaged', label: 'Item damaged', emoji: '💔' },
  { id: 'scam', label: 'Scam / Fraud', emoji: '🚨' },
  { id: 'driver_issue', label: 'Driver misconduct', emoji: '🛵' },
  { id: 'other', label: 'Other issue', emoji: '⚠️' },
];

export default function ReportDispute() {
  const { order_id, against_id } = useLocalSearchParams();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!type || !description) {
      setError('Please select issue type and describe the problem');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const userData = await api.getUser(currentUser.uid);

      await api.reportDispute({
        order_id: order_id as string,
        reported_by: userData.id,
        reported_against: against_id as string,
        type,
        description,
      });

      setSuccess(true);
      setTimeout(() => router.back(), 2000);
    } catch (e) {
      setError('Failed to submit report. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>Report Submitted</Text>
        <Text style={styles.successSub}>Our team will review this within 24 hours. If confirmed, action will be taken.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Report Issue</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.sectionTitle}>What happened?</Text>
        <View style={styles.typeGrid}>
          {DISPUTE_TYPES.map(dt => (
            <TouchableOpacity
              key={dt.id}
              style={[styles.typeCard, type === dt.id && styles.typeCardActive]}
              onPress={() => setType(dt.id)}
            >
              <Text style={styles.typeEmoji}>{dt.emoji}</Text>
              <Text style={[styles.typeLabel, type === dt.id && styles.typeLabelActive]}>{dt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Describe the issue</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Explain what happened in detail..."
          placeholderTextColor="rgba(245,243,238,0.2)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ False reports may result in account suspension. Only report genuine issues.</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Submit Report</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20 },
  back: { fontSize: 15, color: 'rgba(245,243,238,0.5)' },
  title: { fontSize: 18, fontWeight: '700', color: '#F5F3EE' },
  scroll: { flex: 1, paddingHorizontal: 24 },
  error: { color: '#FF3C2E', fontSize: 13, marginBottom: 16, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#F5F3EE', marginBottom: 14, marginTop: 8 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  typeCard: { width: '47%', backgroundColor: '#1C1C1C', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.06)' },
  typeCardActive: { borderColor: '#FF3C2E', backgroundColor: 'rgba(255,60,46,0.08)' },
  typeEmoji: { fontSize: 28, marginBottom: 8 },
  typeLabel: { fontSize: 12, color: 'rgba(245,243,238,0.5)', textAlign: 'center', fontWeight: '500' },
  typeLabelActive: { color: '#FF3C2E' },
  textarea: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.08)', borderRadius: 14, padding: 16, color: '#F5F3EE', fontSize: 14, height: 120, textAlignVertical: 'top', marginBottom: 16 },
  warningBox: { backgroundColor: 'rgba(255,140,66,0.1)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,140,66,0.2)', marginBottom: 16 },
  warningText: { fontSize: 12, color: '#FF8C42', lineHeight: 18 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0A0A0A', borderTopWidth: 1, borderTopColor: 'rgba(245,243,238,0.06)', padding: 20, paddingBottom: 32 },
  btn: { backgroundColor: '#FF3C2E', borderRadius: 100, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  successContainer: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center', padding: 40 },
  successEmoji: { fontSize: 72, marginBottom: 20 },
  successTitle: { fontSize: 28, fontWeight: '900', color: '#F5F3EE', marginBottom: 12 },
  successSub: { fontSize: 14, color: 'rgba(245,243,238,0.45)', textAlign: 'center', lineHeight: 22 },
});