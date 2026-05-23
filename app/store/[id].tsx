import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function StoreProfile() {
  const { id } = useLocalSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // decode store name from URL
  const storeName = decodeURIComponent(id as string);

  useEffect(() => {
    fetchStoreProducts();
  }, []);

  const fetchStoreProducts = async () => {
    try {
      const q = query(
        collection(db, 'products'),
        where('sellerName', '==', storeName),
        where('available', '==', true)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Store Banner */}
      <View style={styles.banner}>
        <View style={styles.storeAvatar}>
          <Text style={styles.storeAvatarText}>
            {storeName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.storeName}>{storeName}</Text>
        <Text style={styles.storeSub}>Official Store · Addis Ababa</Text>
        <View style={styles.storeStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{products.length}</Text>
            <Text style={styles.statLbl}>Products</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>⭐ 4.8</Text>
            <Text style={styles.statLbl}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>✓</Text>
            <Text style={styles.statLbl}>Verified</Text>
          </View>
        </View>
      </View>

      {/* Products */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#FF3C2E" size="large" />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyText}>No products yet</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>All Products</Text>
          <View style={styles.grid}>
            {products.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.card}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                {product.imageUrl ? (
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.cardImg}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.cardImgPlaceholder, { backgroundColor: '#FFF0EF' }]}>
                    <Text style={styles.cardEmoji}>{product.emoji || '📦'}</Text>
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.cardPrice}>ETB {product.price?.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

  header: {
    paddingHorizontal: 24, paddingTop: 56, paddingBottom: 8,
  },
  back: { fontSize: 15, color: 'rgba(245,243,238,0.5)' },

  banner: {
    alignItems: 'center', paddingVertical: 24,
    paddingHorizontal: 24, borderBottomWidth: 1,
    borderBottomColor: 'rgba(245,243,238,0.06)',
    marginBottom: 8,
  },
  storeAvatar: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: '#FF3C2E',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  storeAvatarText: { fontSize: 36, fontWeight: '900', color: '#fff' },
  storeName: {
    fontSize: 24, fontWeight: '900',
    color: '#F5F3EE', marginBottom: 4,
  },
  storeSub: { fontSize: 13, color: 'rgba(245,243,238,0.4)', marginBottom: 20 },

  storeStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1C1C1C', borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 24,
    gap: 24, borderWidth: 1,
    borderColor: 'rgba(245,243,238,0.06)',
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#F5F3EE', marginBottom: 2 },
  statLbl: { fontSize: 11, color: 'rgba(245,243,238,0.4)' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(245,243,238,0.08)' },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: 'rgba(245,243,238,0.4)' },

  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: '#F5F3EE',
    paddingHorizontal: 20, marginTop: 16, marginBottom: 14,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20, gap: 12,
  },
  card: {
    width: '47%', backgroundColor: '#1C1C1C',
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  cardImg: { height: 120, width: '100%' },
  cardImgPlaceholder: {
    height: 120, alignItems: 'center', justifyContent: 'center',
  },
  cardEmoji: { fontSize: 48 },
  cardInfo: { padding: 12 },
  cardName: { fontSize: 13, fontWeight: '600', color: '#F5F3EE', marginBottom: 4 },
  cardPrice: { fontSize: 13, color: '#FF3C2E', fontWeight: '700' },
});