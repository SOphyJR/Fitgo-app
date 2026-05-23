import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.h1}>CREATE{'\n'}<Text style={styles.red}>ACCOUNT.</Text></Text>
      <Text style={styles.sub}>Join FitGo and start shopping locally</Text>

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

      <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/(tabs)/home')}>
        <Text style={styles.btnPrimaryText}>Create Account</Text>
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
  container: {
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 48,
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