import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.h1}>WELCOME{'\n'}<Text style={styles.red}>BACK.</Text></Text>
      <Text style={styles.sub}>Sign in to your FitGo account</Text>

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

      <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/(tabs)/home')}>
        <Text style={styles.btnPrimaryText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.switchText}>Don't have an account? <Text style={styles.red}>Register</Text></Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 48,
    justifyContent: 'center',
  },
  back: { marginBottom: 40 },
  backText: { color: 'rgba(245,243,238,0.5)', fontSize: 15 },
  h1: {
    fontSize: 58, fontWeight: '900',
    color: '#F5F3EE', lineHeight: 56,
    letterSpacing: 1, marginBottom: 12,
  },
  red: { color: '#FF3C2E' },
  sub: { fontSize: 15, color: 'rgba(245,243,238,0.45)', marginBottom: 40 },
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
    borderRadius: 14,
    padding: 16,
    color: '#F5F3EE',
    fontSize: 15,
  },
  forgot: {
    color: '#FF3C2E', fontSize: 13,
    textAlign: 'right', marginTop: 4,
  },
  btnPrimary: {
    backgroundColor: '#FF3C2E',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  switchText: {
    color: 'rgba(245,243,238,0.45)',
    fontSize: 14, textAlign: 'center',
  },
});