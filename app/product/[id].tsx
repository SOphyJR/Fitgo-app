import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
 import { api } from '@/config/api';
import { useCart } from '@/context/CartContext';


const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE_SIZES = ['39', '40', '41', '42', '43', '44'];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
       const [rated, setRated] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  


const fetchProduct = async () => {
  try {
    const data = await api.getProduct(id as string);
    setProduct(data);
  } catch (e) {
    console.log('Error fetching product:', e);
  } finally {
    setLoading(false);
  }
};


  // Inside component:
const { addItem } = useCart();

const handleAddToCart = () => {
  if (!selectedSize) {
    alert('Please select a size');
    return;
  }
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image_url: product.image_url || '',
    emoji: product.emoji || '📦',
    store_id: product.store_id,
    size: selectedSize,
    qty: 1,
  });
  setAdded(true);
  setTimeout(() => setAdded(false), 2000);
};

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FF3C2E" size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundEmoji}>😕</Text>
        <Text style={styles.notFoundText}>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sizes = product.category === 'Shoes' ? SHOE_SIZES : SIZES;

  return (
    <View style={styles.container}>

      {/* Image Area */}
      <View style={styles.imageArea}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.productEmoji}>{product.emoji || '📦'}</Text>
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Title row */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.name}>{product.name}</Text>
          </View>
          <Text style={styles.price}>ETB {product.price?.toLocaleString()}</Text>
        </View>

        {/* Store + Rating */}
        <View style={styles.metaRow}>
          <TouchableOpacity
            style={styles.storeTag}
            onPress={() => router.push(`/store/${encodeURIComponent(product.sellerName)}`)}
          >
            <Text style={styles.storeText}>🏪 {product.sellerName}</Text>
          </TouchableOpacity>
          <View style={styles.ratingTag}>
            <Text style={styles.ratingText}>⭐ 4.8</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.descTitle}>About</Text>
        <Text style={styles.desc}>{product.description}</Text>

        {/* Sizes */}
        <Text style={styles.sizeTitle}>Select Size</Text>
        <View style={styles.sizes}>
          {sizes.map(size => (
            <TouchableOpacity
              key={size}
              style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[styles.sizeBtnText, selectedSize === size && styles.sizeBtnTextActive]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceBox}>
          <Text style={styles.bottomPriceLabel}>Price</Text>
          <Text style={styles.bottomPrice}>ETB {product.price?.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, added && styles.addBtnSuccess]}
          onPress={handleAddToCart}
        >
  
          <Text style={styles.addBtnText}>{added ? '✓ Added!' : 'Add to Cart'}</Text>
        </TouchableOpacity>
   

// After added === true show rating:
{added && !rated && (
  <View style={styles.ratingPrompt}>
    <Text style={styles.ratingTitle}>Rate this store</Text>
    <View style={styles.stars}>
      {[1,2,3,4,5].map(star => (
        <TouchableOpacity key={star} onPress={async () => {
          const userData = await api.getUser(auth.currentUser!.uid);
          await api.rateStore(product.store_id, star, userData.id);
          setRated(true);
        }}>
          <Text style={{ fontSize: 28 }}>⭐</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

  centered: {
    flex: 1, backgroundColor: '#0A0A0A',
    alignItems: 'center', justifyContent: 'center',
  },
  notFoundEmoji: { fontSize: 48, marginBottom: 12 },
  notFoundText: { fontSize: 16, color: 'rgba(245,243,238,0.4)', marginBottom: 16 },
  backLink: { color: '#FF3C2E', fontSize: 15 },

  imageArea: {
    height: 300, backgroundColor: '#1C1C1C',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  back: {
    position: 'absolute', top: 56, left: 20,
    width: 40, height: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  ratingPrompt: { marginTop: 12, backgroundColor: '#1C1C1C', borderRadius: 14, padding: 16, alignItems: 'center' },
ratingTitle: { color: 'rgba(245,243,238,0.6)', fontSize: 13, marginBottom: 10 },
stars: { flexDirection: 'row', gap: 8 },
  backText: { fontSize: 20, color: '#fff', fontWeight: '700' },
  productImage: { width: '100%', height: '100%' },
  productEmoji: { fontSize: 100 },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },

  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  titleLeft: { flex: 1, marginRight: 16 },
  category: {
    fontSize: 11, fontWeight: '600',
    color: '#FF3C2E', letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 6,
  },
  name: { fontSize: 24, fontWeight: '800', color: '#F5F3EE', lineHeight: 28 },
  price: { fontSize: 22, fontWeight: '900', color: '#FF3C2E' },

  metaRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  storeTag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 100, borderWidth: 1,
    borderColor: 'rgba(245,243,238,0.08)',
  },
  storeText: { fontSize: 12, color: 'rgba(245,243,238,0.6)' },
  ratingTag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 100, borderWidth: 1,
    borderColor: 'rgba(245,243,238,0.08)',
  },
  ratingText: { fontSize: 12, color: 'rgba(245,243,238,0.6)' },

  descTitle: { fontSize: 16, fontWeight: '700', color: '#F5F3EE', marginBottom: 8 },
  desc: { fontSize: 14, color: 'rgba(245,243,238,0.5)', lineHeight: 22, marginBottom: 28, fontWeight: '300' },

  sizeTitle: { fontSize: 16, fontWeight: '700', color: '#F5F3EE', marginBottom: 14 },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sizeBtn: {
    width: 52, height: 52, borderRadius: 14, borderWidth: 1.5,
    borderColor: 'rgba(245,243,238,0.1)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  sizeBtnActive: { backgroundColor: '#FF3C2E', borderColor: '#FF3C2E' },
  sizeBtnText: { fontSize: 14, color: 'rgba(245,243,238,0.5)', fontWeight: '600' },
  sizeBtnTextActive: { color: '#fff' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1, borderTopColor: 'rgba(245,243,238,0.06)',
    paddingHorizontal: 24, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingBottom: 32,
  },
  priceBox: { flex: 1 },
  bottomPriceLabel: { fontSize: 11, color: 'rgba(245,243,238,0.4)', marginBottom: 2 },
  bottomPrice: { fontSize: 20, fontWeight: '900', color: '#F5F3EE' },
  addBtn: {
    flex: 2, backgroundColor: '#FF3C2E',
    paddingVertical: 16, borderRadius: 100, alignItems: 'center',
  },
  addBtnSuccess: { backgroundColor: '#22c55e' },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});