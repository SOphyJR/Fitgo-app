import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { api } from '@/config/api';

const CATEGORIES = ['All', 'Shoes', 'Tops', 'Bags', 'Caps'];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

const fetchProducts = async () => {
  try {
    const data = await api.getProducts();
    setProducts(data);
  } catch (e) {
    console.log('Error fetching products:', e);
  } finally {
    setLoading(false);
  }
};
  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.location}>📍 Bole, Addis Ababa</Text>
          <Text style={styles.headerTitle}>FitGo</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/(tabs)/cart')}>
          <Text style={styles.cartEmoji}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search clothes, shoes..."
            placeholderTextColor="rgba(245,243,238,0.3)"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTag}>LIMITED OFFER</Text>
            <Text style={styles.bannerTitle}>Up to 30% off{'\n'}on all shoes</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Shop Now →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerEmoji}>👟</Text>
        </View>

        {/* Stores section */}
<Text style={styles.storesTitle}>Browse by Store</Text>
<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storesList}>
  {[...new Set(products.map((p: any) => p.sellerName).filter(Boolean))].map((store: any) => (
    <TouchableOpacity
      key={store}
      style={styles.storeChip}
      onPress={() => router.push(`/store/${encodeURIComponent(store)}`)}
    >
      <View style={styles.storeChipAvatar}>
        <Text style={styles.storeChipAvatarText}>{store.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.storeChipName}>{store}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catsScroll}
          contentContainerStyle={styles.cats}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.cat, activeCategory === cat && styles.catActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.gridHeader}>
          <Text style={styles.gridTitle}>Products</Text>
          <Text style={styles.gridCount}>{filtered.length} items</Text>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#FF3C2E" size="large" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map(product => (
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
                  <View style={[styles.cardImgPlaceholder, { backgroundColor: product.bg || '#FFF0EF' }]}>
                    <Text style={styles.cardEmoji}>{product.emoji || '📦'}</Text>
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{product.name}</Text>
                  <Text style={styles.cardPrice}>ETB {product.price?.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 56, paddingBottom: 16,
  },
  location: { fontSize: 12, color: 'rgba(245,243,238,0.45)', marginBottom: 2 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#F5F3EE', letterSpacing: 1 },
  cartBtn: {
    width: 44, height: 44, backgroundColor: '#FF3C2E',
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  cartEmoji: { fontSize: 20 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 20, borderRadius: 14,
    paddingHorizontal: 14, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 14, color: '#F5F3EE', fontSize: 14 },

  banner: {
    backgroundColor: '#FF3C2E',
    marginHorizontal: 20, borderRadius: 20,
    padding: 24, marginBottom: 24,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: { flex: 1 },
  bannerTag: {
    fontSize: 10, fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5, marginBottom: 8,
  },
  storesTitle: {
  fontSize: 18, fontWeight: '700', color: '#F5F3EE',
  paddingHorizontal: 20, marginBottom: 12, marginTop: 8,
},
storesList: { paddingHorizontal: 20, gap: 10 },
storeChip: {
  alignItems: 'center', gap: 8,
  backgroundColor: '#1C1C1C',
  borderRadius: 16, padding: 14,
  borderWidth: 1, borderColor: 'rgba(245,243,238,0.06)',
  minWidth: 90,
},
storeChipAvatar: {
  width: 44, height: 44, borderRadius: 14,
  backgroundColor: '#FF3C2E',
  alignItems: 'center', justifyContent: 'center',
},
storeChipAvatarText: { fontSize: 20, fontWeight: '900', color: '#fff' },
storeChipName: { fontSize: 12, color: '#F5F3EE', fontWeight: '600', textAlign: 'center' },
  bannerTitle: {
    fontSize: 22, fontWeight: '900',
    color: '#fff', lineHeight: 26, marginBottom: 16,
  },
  bannerBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, alignSelf: 'flex-start',
  },
  bannerBtnText: { color: '#FF3C2E', fontSize: 13, fontWeight: '700' },
  bannerEmoji: { fontSize: 64 },

  catsScroll: { marginBottom: 8 },
  cats: { paddingHorizontal: 20, gap: 8 },
  cat: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 100, borderWidth: 1,
    borderColor: 'rgba(245,243,238,0.1)',
  },
  catActive: { backgroundColor: '#FF3C2E', borderColor: '#FF3C2E' },
  catText: { fontSize: 13, color: 'rgba(245,243,238,0.5)', fontWeight: '500' },
  catTextActive: { color: '#fff' },

  gridHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    marginTop: 16, marginBottom: 14,
  },
  gridTitle: { fontSize: 18, fontWeight: '700', color: '#F5F3EE' },
  gridCount: { fontSize: 13, color: 'rgba(245,243,238,0.4)' },

  centered: { padding: 48, alignItems: 'center' },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: 'rgba(245,243,238,0.4)' },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20, gap: 12, paddingBottom: 32,
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