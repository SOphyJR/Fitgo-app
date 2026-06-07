import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const STEPS = [
  {
    id: 1,
    label: 'Head to Store',
    sub: 'Sole Street, Bole',
    emoji: '🛵',
  },
  {
    id: 2,
    label: 'Pick Up Order',
    sub: 'Collect from store',
    emoji: '📦',
  },
  {
    id: 3,
    label: 'Deliver to Customer',
    sub: 'Kazanchis, Addis Ababa',
    emoji: '📍',
  },
];

export default function Delivery() {
  const { orderId } = useLocalSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [delivered, setDelivered] = useState(false);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    startLocationTracking();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const startLocationTracking = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      locationSubscription.current =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
          },
          (newLocation) => {
            setLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            });
          }
        );
    } catch (error) {
      console.log('Location Error:', error);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setDelivered(true);
    }
  };

  if (delivered) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>🎉</Text>

        <Text style={styles.successTitle}>
          Delivered!
        </Text>

        <Text style={styles.successSub}>
          You earned ETB 420
        </Text>

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.replace('/driver')}
        >
          <Text style={styles.doneBtnText}>
            Back to Pickups
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Active Delivery
        </Text>

        <View style={{ width: 50 }} />
      </View>

      {/* Order Card */}
      <View style={styles.orderCard}>
        <Text style={styles.orderId}>
          #{orderId}
        </Text>

        <Text style={styles.orderItem}>
          Jordan 1 Retro
        </Text>

        <View style={styles.orderMeta}>
          <Text style={styles.orderMetaText}>
            👤 Abebe Girma
          </Text>

          <Text style={styles.orderMetaText}>
            📞 +251 91 234 5678
          </Text>
        </View>
      </View>

      {/* Live Map */}
      {location ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          showsMyLocationButton
        >
          <Marker
            coordinate={location}
            title="Your Location"
            description="Current driver position"
          />
        </MapView>
      ) : (
        <View style={styles.mapBox}>
          <Text style={styles.mapEmoji}>📍</Text>
          <Text style={styles.mapText}>
            Loading your location...
          </Text>
        </View>
      )}

      {/* Delivery Steps */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepsTitle}>
          Delivery Steps
        </Text>

        {STEPS.map((step) => {
          const isDone = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <View
              key={step.id}
              style={[
                styles.stepCard,
                isActive &&
                  styles.stepCardActive,
                isDone && styles.stepCardDone,
              ]}
            >
              <Text style={styles.stepEmoji}>
                {step.emoji}
              </Text>

              <View style={styles.stepInfo}>
                <Text
                  style={[
                    styles.stepLabel,
                    isDone &&
                      styles.stepLabelDone,
                  ]}
                >
                  {step.label}
                </Text>

                <Text style={styles.stepSub}>
                  {step.sub}
                </Text>
              </View>

              {isDone && (
                <Text style={styles.stepCheck}>
                  ✓
                </Text>
              )}

              {isActive && (
                <View style={styles.activeDot} />
              )}
            </View>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleNextStep}
        >
          <Text style={styles.actionBtnText}>
            {currentStep === 1 &&
              'I Arrived at Store →'}
            {currentStep === 2 &&
              'Order Picked Up →'}
            {currentStep === 3 &&
              'Mark as Delivered ✓'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
  },

  back: {
    color: 'rgba(245,243,238,0.6)',
    fontSize: 15,
  },

  headerTitle: {
    color: '#F5F3EE',
    fontSize: 18,
    fontWeight: '700',
  },

  orderCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,243,238,0.06)',
  },

  orderId: {
    color: '#FF3C2E',
    fontWeight: '700',
    marginBottom: 6,
  },

  orderItem: {
    color: '#F5F3EE',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },

  orderMeta: {
    flexDirection: 'row',
    gap: 16,
  },

  orderMetaText: {
    color: 'rgba(245,243,238,0.5)',
    fontSize: 13,
  },

  map: {
    height: 220,
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 18,
  },

  mapBox: {
    height: 220,
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 18,
    backgroundColor: '#1C1C1C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },

  mapText: {
    color: 'rgba(245,243,238,0.5)',
  },

  scroll: {
    flex: 1,
    paddingHorizontal: 24,
  },

  stepsTitle: {
    color: '#F5F3EE',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(245,243,238,0.06)',
  },

  stepCardActive: {
    borderColor: '#FF3C2E',
    backgroundColor: 'rgba(255,60,46,0.08)',
  },

  stepCardDone: {
    opacity: 0.5,
  },

  stepEmoji: {
    fontSize: 24,
  },

  stepInfo: {
    flex: 1,
  },

  stepLabel: {
    color: '#F5F3EE',
    fontSize: 15,
    fontWeight: '700',
  },

  stepLabelDone: {
    textDecorationLine: 'line-through',
  },

  stepSub: {
    color: 'rgba(245,243,238,0.5)',
    fontSize: 12,
    marginTop: 4,
  },

  stepCheck: {
    color: '#22c55e',
    fontSize: 18,
    fontWeight: '700',
  },

  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3C2E',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(245,243,238,0.06)',
  },

  actionBtn: {
    backgroundColor: '#FF3C2E',
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },

  actionBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  successContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  successEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },

  successTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#F5F3EE',
  },

  successSub: {
    fontSize: 20,
    color: '#22c55e',
    marginTop: 12,
    marginBottom: 40,
    fontWeight: '700',
  },

  doneBtn: {
    backgroundColor: '#FF3C2E',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 100,
  },

  doneBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});