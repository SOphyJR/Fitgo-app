import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { api } from '@/config/api';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/config/firebase';

const ROLE_HINTS = {
  customer: '009988',
  seller: '112233',
  driver: '221133',
};

export default function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (!phone) { setError('Enter your phone number'); return; }
    setLoading(true);
    setError('');
    try {
      await api.sendPhoneOTP(phone, role);
      setStep('otp');
    } catch (e) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) { setError('Enter the OTP'); return; }
    setLoading(true);
    setError('');
    try {
      const result = await api.verifyPhoneOTP(phone, otp, role);
      if (!result.verified) {
        setError(result.error || 'Invalid OTP');
        return;
      }

      if (result.isNew) {
        // New user — go to register to complete profile
        router.replace({
          pathname: '/register',
          params: { phone, role }
        });
      } else {
        // Existing user — route based on role/status
        const user = result.user;
        if (user.role === 'customer') {
          router.replace('/(tabs)/home');
        } else if (user.status === 'approved') {
          router.replace(user.role === 'seller' ? '/seller' : '/driver');
        } else {
          router.replace('/pending-approval');
        }
      }
    } catch (e) {
      setError('Something went wrong');
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
          <Text style={styles.h1}>ENTER YOUR{'\n'}<Text style={styles.red}>PHONE.</Text></Text>
          <Text style={styles.sub}>We'll send you a verification code</Text>

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
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>I AM A</Text>
            <View style={styles.roleRow}>
              {(['customer', 'seller', 'driver'] as const).map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={styles.roleEmoji}>
                    {r === 'customer' ? '🛍️' : r === 'seller' ? '🏪' : '🛵'}
                  </Text>
                  <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send OTP →</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.switchText}>Use email instead</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.h1}>ENTER{'\n'}<Text style={styles.red}>CODE.</Text></Text>
          <Text style={styles.sub}>Default OTP for {role}:</Text>
          <Text style={styles.hint}>{ROLE_HINTS[role as keyof typeof ROLE_HINTS]}</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputWrap}>
            <Text style={styles.label}>OTP CODE</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP..."
              placeholderTextColor="rgba(245,243,238,0.2)"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify →</Text>}
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
  sub: { fontSize: 15, color: 'rgba(245,243,238,0.45)', marginBottom: 8 },
  hint: { fontSize: 32, fontWeight: '900', color: '#FF3C2E', letterSpacing: 8, marginBottom: 32 },
  error: { color: '#FF3C2E', fontSize: 13, marginBottom: 16, fontWeight: '500' },
  inputWrap: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '600', color: 'rgba(245,243,238,0.4)', letterSpacing: 1.5, marginBottom: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.08)', borderRadius: 14, padding: 16, color: '#F5F3EE', fontSize: 15 },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleBtn: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.08)' },
  roleBtnActive: { borderColor: '#FF3C2E', backgroundColor: 'rgba(255,60,46,0.08)' },
  roleEmoji: { fontSize: 24, marginBottom: 6 },
  roleText: { fontSize: 12, fontWeight: '700', color: 'rgba(245,243,238,0.5)' },
  roleTextActive: { color: '#FF3C2E' },
  btn: { backgroundColor: '#FF3C2E', paddingVertical: 16, borderRadius: 100, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  switchText: { color: 'rgba(245,243,238,0.4)', fontSize: 14, textAlign: 'center' },
});