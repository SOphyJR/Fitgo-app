import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';

export default function PendingApproval() {
  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⏳</Text>
      <Text style={styles.h1}>UNDER{'\n'}<Text style={styles.red}>REVIEW.</Text></Text>
      <Text style={styles.sub}>
        Your application is being reviewed. We'll verify your store details and notify you within 24–48 hours.
      </Text>

      <View style={styles.stepsBox}>
        {[
          { emoji: '✅', label: 'Application submitted', done: true },
          { emoji: '🔍', label: 'Document verification', done: false },
          { emoji: '✉️', label: 'Approval notification', done: false },
          { emoji: '🚀', label: 'Start selling', done: false },
        ].map((step, i) => (
          <View key={i} style={styles.step}>
            <Text style={styles.stepEmoji}>{step.emoji}</Text>
            <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>
              {step.label}
            </Text>
            {step.done && <Text style={styles.stepCheck}>✓</Text>}
          </View>
        ))}
      </View>

      <Text style={styles.contact}>
        Questions? Contact us at{'\n'}
        <Text style={styles.contactEmail}>support@fitgo.com</Text>
      </Text>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0A0A0A',
    paddingHorizontal: 28, paddingTop: 80,
    paddingBottom: 48, alignItems: 'center',
  },
  emoji: { fontSize: 64, marginBottom: 24 },
  h1: {
    fontSize: 52, fontWeight: '900',
    color: '#F5F3EE', lineHeight: 50,
    letterSpacing: 1, marginBottom: 16,
    textAlign: 'center',
  },
  red: { color: '#FF3C2E' },
  sub: {
    fontSize: 15, color: 'rgba(245,243,238,0.45)',
    textAlign: 'center', lineHeight: 24,
    marginBottom: 36, fontWeight: '300',
  },
  stepsBox: {
    width: '100%', backgroundColor: '#1C1C1C',
    borderRadius: 20, padding: 20, marginBottom: 28,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
    gap: 16,
  },
  step: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  stepEmoji: { fontSize: 20 },
  stepLabel: { flex: 1, fontSize: 14, color: 'rgba(245,243,238,0.35)', fontWeight: '500' },
  stepLabelDone: { color: '#F5F3EE' },
  stepCheck: { color: '#22c55e', fontSize: 16, fontWeight: '700' },
  contact: {
    fontSize: 13, color: 'rgba(245,243,238,0.3)',
    textAlign: 'center', lineHeight: 20, marginBottom: 32,
  },
  contactEmail: { color: '#FF3C2E', fontWeight: '600' },
  signOutBtn: {
    width: '100%', backgroundColor: 'rgba(255,60,46,0.1)',
    borderRadius: 16, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,60,46,0.2)',
  },
  signOutText: { color: '#FF3C2E', fontSize: 15, fontWeight: '700' },
});