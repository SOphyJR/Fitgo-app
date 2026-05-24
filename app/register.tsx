import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { api } from '@/config/api';

export default function Register() {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
const handleRegister = async () => {
  if (!name || !email || !phone || !password) {
    setError('Please fill in all fields');
    return;
  }
  if (password.length < 6) {
    setError('Password must be at least 6 characters');
    return;
  }
  setLoading(true);
  setError('');
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: name });
    await setDoc(doc(db, 'users', userCred.user.uid), {
      name,
      email,
      phone,
      role,
      status: role === 'customer' ? 'active' : 'pending',
      createdAt: new Date().toISOString(),
    });

    // Save to PostgreSQL backend
await api.createUser({
  firebase_uid: userCred.user.uid,
  name,
  email,
  phone,
  role,
});
    // redirect based on role
    if (role === 'customer') {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/pending-approval');
    }
  } catch (e: any) {
    if (e.code === 'auth/email-already-in-use') {
      setError('Email already registered');
    } else {
      setError('Something went wrong. Try again.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.h1}>CREATE{'\n'}<Text style={styles.red}>ACCOUNT.</Text></Text>
      <Text style={styles.sub}>Join FitGo and start shopping locally</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.form}>
        <View style={styles.inputWrap}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Abebe Girma"
            placeholderTextColor="rgba(245,243,238,0.2)"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputWrap}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="rgba(245,243,238,0.2)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
        <View style={styles.inputWrap}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="rgba(245,243,238,0.2)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>
      {/* Role Selection */}
<View style={styles.inputWrap}>
  <Text style={styles.label}>I WANT TO</Text>
  <View style={styles.roleRow}>
    <TouchableOpacity
      style={[styles.roleBtn, role === 'customer' && styles.roleBtnActive]}
      onPress={() => setRole('customer')}
    >
      <Text style={styles.roleEmoji}>🛍️</Text>
      <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>Shop</Text>
      <Text style={styles.roleSubText}>Buy products</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.roleBtn, role === 'seller' && styles.roleBtnActive]}
      onPress={() => setRole('seller')}
    >
      <Text style={styles.roleEmoji}>🏪</Text>
      <Text style={[styles.roleText, role === 'seller' && styles.roleTextActive]}>Sell</Text>
      <Text style={styles.roleSubText}>List products</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.roleBtn, role === 'driver' && styles.roleBtnActive]}
      onPress={() => setRole('driver')}
    >
      <Text style={styles.roleEmoji}>🛵</Text>
      <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>Deliver</Text>
      <Text style={styles.roleSubText}>Earn money</Text>
    </TouchableOpacity>
  </View>
</View>

      <TouchableOpacity
        style={[styles.btnPrimary, loading && styles.btnDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnPrimaryText}>Create Account</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.switchText}>
          Already have an account? <Text style={styles.red}>Sign In</Text>
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#0A0A0A' },
  container: { paddingHorizontal: 28, paddingTop: 64, paddingBottom: 48 },
  back: { marginBottom: 40 },
  backText: { color: 'rgba(245,243,238,0.5)', fontSize: 15 },
  h1: {
    fontSize: 58, fontWeight: '900',
    color: '#F5F3EE', lineHeight: 56,
    letterSpacing: 1, marginBottom: 12,
  },
  red: { color: '#FF3C2E' },
  sub: { fontSize: 15, color: 'rgba(245,243,238,0.45)', marginBottom: 16 },
  error: { color: '#FF3C2E', fontSize: 13, marginBottom: 16, fontWeight: '500' },
  form: { marginBottom: 32 },
  inputWrap: { marginBottom: 20 },
  label: {
    fontSize: 11, fontWeight: '600',
    color: 'rgba(245,243,238,0.4)',
    letterSpacing: 1.5, marginBottom: 8,
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
roleText: { fontSize: 13, fontWeight: '700', color: 'rgba(245,243,238,0.5)', marginBottom: 2 },
roleTextActive: { color: '#FF3C2E' },
roleSubText: { fontSize: 10, color: 'rgba(245,243,238,0.3)', textAlign: 'center' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.08)',
    borderRadius: 14, padding: 16,
    color: '#F5F3EE', fontSize: 15,
  },
  btnPrimary: {
    backgroundColor: '#FF3C2E', paddingVertical: 16,
    borderRadius: 100, alignItems: 'center', marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  switchText: { color: 'rgba(245,243,238,0.45)', fontSize: 14, textAlign: 'center' },
});