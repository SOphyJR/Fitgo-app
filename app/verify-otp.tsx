import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/config/api';

export default function VerifyOTP() {
  const { email, name, role } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (val: string, index: number) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await api.verifyOTP(email as string, code);
      if (result.verified) {
        if (role === 'customer') {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/pending-approval');
        }
      } else {
        setError(result.error || 'Invalid code. Try again.');
      }
    } catch (e) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await api.resendOTP(email as string, name as string);
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      setError('');
    } catch (e) {
      setError('Failed to resend. Try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.emoji}>📧</Text>
      <Text style={styles.h1}>CHECK YOUR{'\n'}<Text style={styles.red}>EMAIL.</Text></Text>
      <Text style={styles.sub}>
        We sent a 6-digit code to{'\n'}
        <Text style={styles.emailText}>{email}</Text>
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* OTP Input boxes */}
      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={el => inputs.current[index] = el}
            style={[styles.otpBox, digit && styles.otpBoxFilled]}
            value={digit}
            onChangeText={val => handleChange(val, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btnPrimary, loading && styles.btnDisabled]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnPrimaryText}>Verify Code</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend} disabled={countdown > 0 || resending}>
        <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
          {resending ? 'Sending...' :
            countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0A0A0A',
    paddingHorizontal: 28, paddingTop: 64,
    paddingBottom: 48,
  },
  back: { marginBottom: 40 },
  backText: { color: 'rgba(245,243,238,0.5)', fontSize: 15 },
  emoji: { fontSize: 56, marginBottom: 20, textAlign: 'center' },
  h1: {
    fontSize: 52, fontWeight: '900',
    color: '#F5F3EE', lineHeight: 50,
    letterSpacing: 1, marginBottom: 16,
    textAlign: 'center',
  },
  red: { color: '#FF3C2E' },
  sub: {
    fontSize: 15, color: 'rgba(245,243,238,0.45)',
    textAlign: 'center', lineHeight: 24, marginBottom: 32,
  },
  emailText: { color: '#F5F3EE', fontWeight: '600' },
  error: {
    color: '#FF3C2E', fontSize: 13,
    textAlign: 'center', marginBottom: 16, fontWeight: '500',
  },
  otpRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 10, marginBottom: 40,
  },
  otpBox: {
    width: 50, height: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.08)',
    borderRadius: 14, textAlign: 'center',
    fontSize: 24, fontWeight: '700', color: '#F5F3EE',
  },
  otpBoxFilled: { borderColor: '#FF3C2E', backgroundColor: 'rgba(255,60,46,0.08)' },
  btnPrimary: {
    backgroundColor: '#FF3C2E', paddingVertical: 16,
    borderRadius: 100, alignItems: 'center', marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  resendText: { color: '#FF3C2E', fontSize: 14, textAlign: 'center', fontWeight: '500' },
  resendDisabled: { color: 'rgba(245,243,238,0.3)' },
});