import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { api } from '@/config/api';

const DEFAULT_OTPS: Record<string, string> = {
  customer: '009988',
  seller: '112233',
  driver: '221133',
};

export default function Login() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!phone || phone.length < 9) {
      setError('Enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userData = await api.getUserByPhone(phone);
      if (userData.error) {
        setError('Phone not registered. Please sign up first.');
        return;
      }
      setRole(userData.role);
      setStep('otp');
    } catch (e) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!otp) { setError('Enter the OTP'); return; }
    const expected = DEFAULT_OTPS[role];
    if (otp !== expected) {
      setError(`Invalid OTP. Use ${expected} for your role.`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fakeEmail = `${phone.replace(/\D/g, '')}@fitgo.app`;
      const fakePassword = `fitgo_${phone.replace(/\D/g, '')}_2026`;
      await signInWithEmailAndPassword(auth, fakeEmail, fakePassword);

      const userData = await api.getUserByPhone(phone);
      if (userData.role === 'customer') {
        router.replace('/(tabs)/home');
      } else if (userData.status === 'approved') {
        router.replace(userData.role === 'seller' ? '/seller' : '/driver');
      } else {
        router.replace('/pending-approval');
      }
    } catch (e: any) {
      setError('Login failed. Check your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => step === 'otp' ? setStep('phone') : router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {step === 'phone' ? (
        <>
          <Text style={styles.h1}>WELCOME{'\n'}<Text style={styles.red}>BACK.</Text></Text>
          <Text style={styles.sub}>Enter your phone number to sign in</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputWrap}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="+251 9..."
              placeholderTextColor="rgba(245,243,238,0.2)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Continue →</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/phone-login')}>
            <Text style={styles.switchText}>Don't have an account? <Text style={styles.red}>Sign Up</Text></Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.h1}>ENTER{'\n'}<Text style={styles.red}>CODE.</Text></Text>
          <Text style={styles.sub}>Use your default OTP to sign in</Text>

          <View style={styles.hintCard}>
            <Text style={styles.hintLabel}>YOUR OTP ({role.toUpperCase()})</Text>
            <Text style={styles.hintCode}>{DEFAULT_OTPS[role]}</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputWrap}>
            <Text style={styles.label}>ENTER OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="6-digit code..."
              placeholderTextColor="rgba(245,243,238,0.2)"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign In →</Text>}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', paddingHorizontal: 28, paddingTop: 64, paddingBottom: 48 },
  back: { marginBottom: 40 },
  backText: { color: 'rgba(245,243,238,0.5)', fontSize: 15 },
  h1: { fontSize: 52, fontWeight: '900', color: '#F5F3EE', lineHeight: 50, letterSpacing: 1, marginBottom: 12 },
  red: { color: '#FF3C2E' },
  sub: { fontSize: 15, color: 'rgba(245,243,238,0.45)', marginBottom: 24, lineHeight: 22 },
  error: { color: '#FF3C2E', fontSize: 13, marginBottom: 16, fontWeight: '500' },
  hintCard: {
    backgroundColor: 'rgba(255,60,46,0.08)', borderRadius: 16,
    borderWidth: 1.5, borderColor: 'rgba(255,60,46,0.2)',
    padding: 20, alignItems: 'center', marginBottom: 24,
  },
  hintLabel: { fontSize: 11, color: 'rgba(245,243,238,0.4)', letterSpacing: 2, marginBottom: 10, fontWeight: '600' },
  hintCode: { fontSize: 44, fontWeight: '900', color: '#FF3C2E', letterSpacing: 12 },
  inputWrap: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '600', color: 'rgba(245,243,238,0.4)', letterSpacing: 1.5, marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1.5,
    borderColor: 'rgba(245,243,238,0.08)', borderRadius: 14,
    padding: 16, color: '#F5F3EE', fontSize: 15,
  },
  btn: { backgroundColor: '#FF3C2E', paddingVertical: 16, borderRadius: 100, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  switchText: { color: 'rgba(245,243,238,0.45)', fontSize: 14, textAlign: 'center' },
});