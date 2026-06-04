import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  return (
    <View style={styles.container}>

      {/* Background big text */}
      <Text style={styles.bgText}>FITGO</Text>

      {/* Badge */}
      <View style={styles.badge}>
        <View style={styles.blink} />
        <Text style={styles.badgeText}>NOW LIVE IN ADDIS ABABA</Text>
      </View>

      {/* Main heading */}
      <Text style={styles.h1}>STYLE.{'\n'}<Text style={styles.red}>DELIVERED.{'\n'}</Text><Text style={styles.ghost}>INSTANTLY.</Text></Text>

      {/* Subtitle */}
      <Text style={styles.sub}>
        Clothes, shoes, and accessories from your favourite local stores — on your doorstep in under 30 minutes.
      </Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/register')}>
        <Text style={styles.btnPrimaryText}>Get Started</Text>
      </TouchableOpacity>

<TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/phone-login')}>
  <Text style={styles.btnPrimaryText}>Get Started with Phone</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/login')}>
  <Text style={styles.btnSecondaryText}>Sign in with Email</Text>
</TouchableOpacity> 

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 48,
    justifyContent: 'flex-end',
  },
  bgText: {
    position: 'absolute',
    bottom: -20,
    right: -10,
    fontSize: 140,
    color: 'rgba(255,255,255,0.03)',
    fontWeight: '900',
    letterSpacing: -4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,60,46,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,60,46,0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    marginBottom: 24,
  },
blink: {
  width: 6, height: 6,
  backgroundColor: '#FF3C2E',
  borderRadius: 3,
  flexShrink: 0,
},
  badgeText: {
    color: '#FF3C2E',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
 h1: {
  fontSize: 58,
  fontWeight: '900',
  color: '#F5F3EE',
  lineHeight: 56,
  letterSpacing: 1,
  marginBottom: 24,
},
  red: {
    color: '#FF3C2E',
  },
 ghost: {
  color: 'rgba(245,243,238,0.15)',
  fontSize: 58,
  fontWeight: '900',
},
  sub: {
    fontSize: 15,
    color: 'rgba(245,243,238,0.5)',
    lineHeight: 24,
    fontWeight: '300',
    marginBottom: 40,
  },
  btnPrimary: {
    backgroundColor: '#FF3C2E',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,243,238,0.1)',
  },
  btnSecondaryText: {
    color: 'rgba(245,243,238,0.6)',
    fontSize: 15,
    fontWeight: '400',
  },
});