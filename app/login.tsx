import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
  if (!email || !password) {
    setError('Please fill in all fields');
    return;
  }
  setLoading(true);
  setError('');
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    
    // get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
    const userData = userDoc.data();

    if (!userData) {
      router.replace('/(tabs)/home');
      return;
    }

    // route based on role and status
    if (userData.role === 'customer') {
      router.replace('/(tabs)/home');
    } else if (userData.role === 'seller') {
      if (userData.status === 'approved') {
        router.replace('/seller');
      } else {
        router.replace('/pending-approval');
      }
    } else if (userData.role === 'driver') {
      if (userData.status === 'approved') {
        router.replace('/driver');
      } else {
        router.replace('/pending-approval');
      }
    }
  } catch (e: any) {
    setError('Invalid email or password');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.h1}>WELCOME{'\n'}<Text style={styles.red}>BACK.</Text></Text>
      <Text style={styles.sub}>Sign in to your FitGo account</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.form}>
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

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btnPrimary, loading && styles.btnDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnPrimaryText}>Sign In</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.switchText}>Don't have an account? <Text style={styles.red}>Register</Text></Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0A0A0A',
    paddingHorizontal: 28, paddingTop: 64,
    paddingBottom: 48, justifyContent: 'center',
  },
  back: { marginBottom: 40 },
  backText: { color: 'rgba(245,243,238,0.5)', fontSize: 15 },
  h1: {
    fontSize: 58, fontWeight: '900',
    color: '#F5F3EE', lineHeight: 56,
    letterSpacing: 1, marginBottom: 12,
  },
  red: { color: '#FF3C2E' },
  sub: { fontSize: 15, color: 'rgba(245,243,238,0.45)', marginBottom: 16 },
  error: {
    color: '#FF3C2E', fontSize: 13,
    marginBottom: 16, fontWeight: '500',
  },
  form: { marginBottom: 32 },
  inputWrap: { marginBottom: 20 },
  label: {
    fontSize: 11, fontWeight: '600',
    color: 'rgba(245,243,238,0.4)',
    letterSpacing: 1.5, marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(245,243,238,0.08)',
    borderRadius: 14, padding: 16,
    color: '#F5F3EE', fontSize: 15,
  },
  forgot: { color: '#FF3C2E', fontSize: 13, textAlign: 'right', marginTop: 4 },
  btnPrimary: {
    backgroundColor: '#FF3C2E', paddingVertical: 16,
    borderRadius: 100, alignItems: 'center', marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  switchText: { color: 'rgba(245,243,238,0.45)', fontSize: 14, textAlign: 'center' },
});