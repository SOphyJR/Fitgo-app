import { sendOrderNotification } from '@/app/utils/notifications';
import { api } from '@/config/api';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', emoji: '✅' },
  { key: 'preparing', label: 'Preparing', emoji: '🔥' },
  { key: 'on_the_way', label: 'On The Way', emoji: '🛵' },
  { key: 'delivered', label: 'Delivered', emoji: '🎉' },
];

export default function Tracking() {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [customerLocation, setCustomerLocation] = useState<any>(null);
  const mapRef = useRef<MapView>(null);
  const prevStatus = useRef('');

  useEffect(() => {
    fetchOrder();
    requestLocation();
    // Simulate driver moving - poll every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, []);

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setCustomerLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      // Simulate driver starting 0.01 degrees away
      setDriverLocation({
        latitude: loc.coords.latitude + 0.01,
        longitude: loc.coords.longitude + 0.008,
      });
    }
  };

  const fetchOrder = async () => {
    try {
      if (!orderId) return;
      const data = await api.getOrder(orderId as string);
      if (data && !data.error) {
        if (data.status !== prevStatus.current && prevStatus.current !== '') {
          sendOrderNotification(data.status, data.id.slice(0, 8).toUpperCase());
        }
        prevStatus.current = data.status;
        setOrder(data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order?.status);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FF3C2E" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <View style={styles.mapContainer}>
        {customerLocation ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: customerLocation.latitude,
              longitude: customerLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            {/* Customer marker */}
            <Marker
              coordinate={customerLocation}
              title="Your Location"
              pinColor="#3b82f6"
            />
            {/* Driver marker */}
            {driverLocation && order?.status === 'on_the_way' && (
              <Marker
                coordinate={driverLocation}
                title="Driver"
              >
                <View style={styles.driverMarker}>
                  <Text style={styles.driverMarkerText}>🛵</Text>
                </View>
              </Marker>
            )}
            {/* Route line */}
            {driverLocation && customerLocation && order?.status === 'on_the_way' && (
              <Polyline
                coordinates={[driverLocation, customerLocation]}
                strokeColor="#FF3C2E"
                strokeWidth={3}
                lineDashPattern={[5, 5]}
              />
            )}
          </MapView>
        ) : (
          <View style={[styles.map, styles.mapPlaceholder]}>
            <Text style={styles.mapPlaceholderText}>📍 Enabling location...</Text>
          </View>
        )}

        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        {/* ETA Badge */}
        {order?.status === 'on_the_way' && (
          <View style={styles.etaBadge}>
            <Text style={styles.etaLabel}>ETA</Text>
            <Text style={styles.etaTime}>~18 min</Text>
          </View>
        )}
      </View>

      {/* Order Info Panel */}
      <View style={styles.panel}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>#{order?.id?.slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.orderTotal}>ETB {parseFloat(order?.total_amount || 0).toLocaleString()}</Text>
        </View>

        {/* Status Steps */}
        <View style={styles.steps}>
          {STATUS_STEPS.map((step, i) => {
            const isCompleted = i <= currentStepIndex;
            const isActive = i === currentStepIndex;
            return (
              <View key={step.key} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={[
                    styles.stepDot,
                    isCompleted && styles.stepDotDone,
                    isActive && styles.stepDotActive
                  ]}>
                    <Text style={styles.stepEmoji}>{isCompleted ? '✓' : step.emoji}</Text>
                  </View>
                  {i < STATUS_STEPS.length - 1 && (
                    <View style={[styles.stepLine, isCompleted && styles.stepLineDone]} />
                  )}
                </View>
                <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Delivery address */}
        <View style={styles.addressRow}>
          <Text style={styles.addressEmoji}>📍</Text>
          <Text style={styles.address}>{order?.delivery_address || 'Delivery address'}</Text>
        </View>

        {/* Report button */}
        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() => router.push(`/report-dispute?order_id=${orderId}&against_id=`)}
        >
          <Text style={styles.reportBtnText}>⚠️ Report an Issue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A' },
  mapContainer: { height: '50%', position: 'relative' },
  map: { width: '100%', height: '100%' },
  mapPlaceholder: { backgroundColor: '#1C1C1C', alignItems: 'center', justifyContent: 'center' },
  mapPlaceholderText: { color: 'rgba(245,243,238,0.4)', fontSize: 16 },
  backBtn: { position: 'absolute', top: 56, left: 20, width: 44, height: 44, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  etaBadge: { position: 'absolute', top: 56, right: 20, backgroundColor: '#FF3C2E', borderRadius: 14, padding: 12, alignItems: 'center' },
  etaLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600' },
  etaTime: { color: '#fff', fontSize: 18, fontWeight: '900' },
  driverMarker: { backgroundColor: '#FF3C2E', borderRadius: 20, padding: 6, borderWidth: 2, borderColor: '#fff' },
  driverMarkerText: { fontSize: 18 },
  panel: { flex: 1, backgroundColor: '#0A0A0A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, marginTop: -20 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  orderId: { fontSize: 16, fontWeight: '700', color: '#FF3C2E' },
  orderTotal: { fontSize: 18, fontWeight: '900', color: '#F5F3EE' },
  steps: { gap: 0, marginBottom: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  stepLeft: { alignItems: 'center', width: 36 },
  stepDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1C1C1C', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(245,243,238,0.1)' },
  stepDotDone: { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: '#22c55e' },
  stepDotActive: { backgroundColor: 'rgba(255,60,46,0.15)', borderColor: '#FF3C2E' },
  stepEmoji: { fontSize: 14 },
  stepLine: { width: 2, height: 20, backgroundColor: 'rgba(245,243,238,0.1)', marginTop: 2 },
  stepLineDone: { backgroundColor: '#22c55e' },
  stepLabel: { fontSize: 14, color: 'rgba(245,243,238,0.4)', paddingTop: 8, fontWeight: '500' },
  stepLabelActive: { color: '#F5F3EE', fontWeight: '700' },
  addressRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#1C1C1C', borderRadius: 14, padding: 14, marginBottom: 14 },
  addressEmoji: { fontSize: 16 },
  address: { flex: 1, fontSize: 13, color: 'rgba(245,243,238,0.6)', lineHeight: 20 },
  reportBtn: { padding: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,140,66,0.2)', alignItems: 'center', backgroundColor: 'rgba(255,140,66,0.05)' },
  reportBtnText: { color: '#FF8C42', fontSize: 13, fontWeight: '600' },
});