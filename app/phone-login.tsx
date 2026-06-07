import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { api } from '@/config/api';

const DEFAULT_OTPS: Record<string, string> = {
  customer: '009988',
  seller: '112233',
  driver: '221133',
};

export default function PhoneLogin() {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExisting, setIsExisting] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 9) {
      setError('Enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Check if user exists with this phone
      const existing = await api.getUserByPhone(phone);
      setIsExisting(!existing.error);
      setStep('otp');
    } catch (e) {
      setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) { setError('Enter the OTP'); return; }
    const expected = DEFAULT_OTPS[role];
    if (otp !== expected) {
      setError(`Invalid OTP. Use ${expected} for ${role}`);
      return;
    }
    setError('');

    if (isExisting) {
      // Existing user — sign in and route
      setLoading(true);
      try {
        const userData = await api.getUserByPhone(phone);
        // Sign in with generated credentials
        const fakeEmail = `${phone.replace(/\D/g, '')}@fitgo.app`;
        await signInWithEmailAndPassword(auth, fakeEmail, `fitgo_${phone.replace(/\D/g, '')}_2026`);
        routeByRole(userData);
      } catch (e) {
        setError('Account not found. Please register.');
        setIsExisting(false);
        setStep('otp');
      } finally {
        setLoading(false);
      }
    } else {
      // New user — go to profile step
      setStep('profile');
    }
  };

  const handleCreateAccount = async () => {
    if (!name.trim()) { setError('Enter your full name'); return; }
    setLoading(true);
    setError('');
    try {
      // Create Firebase account using phone as fake email
      const fakeEmail = `${phone.replace(/\D/g, '')}@fitgo.app`;
      const fakePassword = `fitgo_${phone.replace(/\D/g, '')}_2026`;

      const userCred = await createUserWithEmailAndPassword(auth, fakeEmail, fakePassword);
      await updateProfile(userCred.user, { displayName: name });

      // Save to PostgreSQL
      await api.createUser({
        firebase_uid: userCred.user.uid,
        name,
        email: fakeEmail,
        phone,
        role,
      });

      // Route based on role
      if (role === 'customer') {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/pending-approval');
      }
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setError('Phone already registered. Please sign in.');
        setStep('phone');
      } else {
        setError('Failed to create account. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const routeByRole = (userData: any) => {
    if (userData.role === 'customer') {
      router.replace('/(tabs)/home');
    } else if (userData.status === 'approved') {
      router.replace(userData.role === 'seller' ? '/seller' : '/driver');
    } else {
      router.replace('/pending-approval');
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => {
        if (step === 'otp') setStep('phone');
        else if (step === 'profile') setStep('otp');
        else router.back();
      }}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* STEP 1 — PHONE */}
      {step === 'phone' && (
        <>
          <Text style={styles.h1}>ENTER YOUR{'\n'}<Text style={styles.red}>PHONE.</Text></Text>
          <Text style={styles.sub}>Enter your phone number to get started</Text>

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
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Continue →</Text>
            }
          </TouchableOpacity>
        </>
      )}

      {/* STEP 2 — OTP */}
      {step === 'otp' && (
        <>
          <Text style={styles.h1}>ENTER{'\n'}<Text style={styles.red}>CODE.</Text></Text>
          <Text style={styles.sub}>
            {isExisting ? 'Welcome back! Enter your OTP to sign in.' : 'Enter the default OTP for your role.'}
          </Text>

          {/* OTP Hint Card */}
          <View style={styles.hintCard}>
            <Text style={styles.hintLabel}>YOUR OTP ({role.toUpperCase()})</Text>
            <Text style={styles.hintCode}>{DEFAULT_OTPS[role]}</Text>
            <Text style={styles.hintNote}>This is your default OTP during MVP phase</Text>
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
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Verify →</Text>
            }
          </TouchableOpacity>
        </>
      )}

      {/* STEP 3 — PROFILE (new users only) */}
      {step === 'profile' && (
        <>
          <Text style={styles.h1}>YOUR{'\n'}<Text style={styles.red}>NAME.</Text></Text>
          <Text style={styles.sub}>Almost done! Just tell us your name.</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputWrap}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Abebe Girma"
              placeholderTextColor="rgba(245,243,238,0.2)"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoFocus
            />
          </View>

          {/* Summary card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phone</Text>
              <Text style={styles.summaryValue}>{phone}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Role</Text>
              <Text style={styles.summaryValue}>
                {role === 'customer' ? '🛍️' : role === 'seller' ? '🏪' : '🛵'} {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleCreateAccount}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Create Account →</Text>
            }
          </TouchableOpacity>

          {role !== 'customer' && (
            <View style={styles.approvalNote}>
              <Text style={styles.approvalNoteText}>
                ⏳ As a {role}, your account will be reviewed by the FitGo admin before you can start.
              </Text>
            </View>
          )}
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#0A0A0A', flex: 1 },
  container: { paddingHorizontal: 28, paddingTop: 64, paddingBottom: 48 },
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
  hintCode: { fontSize: 44, fontWeight: '900', color: '#FF3C2E', letterSpacing: 12, marginBottom: 8 },
  hintNote: { fontSize: 11, color: 'rgba(245,243,238,0.3)', textAlign: 'center' },

  summaryCard: {
    backgroundColor: '#1C1C1C', borderRadius: 16,
    padding: 16, marginBottom: 24, gap: 10,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13, color: 'rgba(245,243,238,0.4)' },
  summaryValue: { fontSize: 13, color: '#F5F3EE', fontWeight: '600' },

  inputWrap: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '600', color: 'rgba(245,243,238,0.4)', letterSpacing: 1.5, marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1.5,
    borderColor: 'rgba(245,243,238,0.08)', borderRadius: 14,
    padding: 16, color: '#F5F3EE', fontSize: 15,
  },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleBtn: {
    flex: 1, alignItems: 'center', padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14, borderWidth: 1.5,
    borderColor: 'rgba(245,243,238,0.08)',
  },
  roleBtnActive: { borderColor: '#FF3C2E', backgroundColor: 'rgba(255,60,46,0.08)' },
  roleEmoji: { fontSize: 24, marginBottom: 6 },
  roleText: { fontSize: 12, fontWeight: '700', color: 'rgba(245,243,238,0.5)' },
  roleTextActive: { color: '#FF3C2E' },
  btn: {
    backgroundColor: '#FF3C2E', paddingVertical: 16,
    borderRadius: 100, alignItems: 'center', marginBottom: 16,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  approvalNote: {
    backgroundColor: 'rgba(255,140,66,0.08)', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: 'rgba(255,140,66,0.2)',
  },
  approvalNoteText: { fontSize: 12, color: '#FF8C42', lineHeight: 18, textAlign: 'center' },
});