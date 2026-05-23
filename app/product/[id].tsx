import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Nike Air Force 1', price: 3500, category: 'Shoes', emoji: '👟', bg: '#FFF0EF', store: 'Sole Street', rating: 4.8, reviews: 124, description: 'Classic low-top sneaker with premium leather upper. A timeless silhouette that goes with everything.' },
  { id: 2, name: 'Polo Shirt', price: 850, category: 'Tops', emoji: '👕', bg: '#EEF2FF', store: 'Urban Threads', rating: 4.6, reviews: 89, description: 'Premium cotton polo shirt. Slim fit, breathable fabric. Perfect for casual and semi-formal occasions.' },
  { id: 3, name: 'Leather Bag', price: 1200, category: 'Bags', emoji: '👜', bg: '#EDFFF4', store: 'Addis Leather', rating: 4.9, reviews: 56, description: 'Handcrafted genuine leather bag. Spacious interior with multiple compartments.' },
  { id: 4, name: 'Classic Cap', price: 320, category: 'Caps', emoji: '🧢', bg: '#FFFBEE', store: 'Street Culture', rating: 4.5, reviews: 210, description: 'Adjustable snapback cap. One size fits all. Perfect finishing touch to any outfit.' },
  { id: 5, name: 'Jordan 1 Retro', price: 4200, category: 'Shoes', emoji: '👟', bg: '#FFF0EF', store: 'Sole Street', rating: 4.9, reviews: 302, description: 'Iconic high-top basketball sneaker. Bold colorway, premium materials, legendary comfort.' },
  { id: 6, name: 'Linen Shirt', price: 650, category: 'Tops', emoji: '👔', bg: '#EEF2FF', store: 'Urban Threads', rating: 4.4, reviews: 67, description: 'Lightweight linen shirt perfect for warm weather. Relaxed fit with a clean minimal design.' },
  { id: 7, name: 'Tote Bag', price: 780, category: 'Bags', emoji: '👝', bg: '#EDFFF4', store: 'Addis Leather', rating: 4.7, reviews: 43, description: 'Versatile canvas tote bag. Strong handles, large capacity. Great for daily use.' },
  { id: 8, name: 'Adidas Slides', price: 980, category: 'Shoes', emoji: '🩴', bg: '#FFF0EF', store: 'Sole Street', rating: 4.3, reviews: 178, description: 'Comfortable EVA slides with contoured footbed. Lightweight and easy to wear.' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE_SIZES = ['39', '40', '41', '42', '43', '44'];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const product = PRODUCTS.find(p => p.id === Number(id)) || PRODUCTS[0];
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  const sizes = product.category === 'Shoes' ? SHOE_SIZES : SIZES;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <View style={styles.container}>

      {/* Image Area */}
      <View style={[styles.imageArea, { backgroundColor: product.bg }]}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.productEmoji}>{product.emoji}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Title row */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.name}>{product.name}</Text>
          </View>
          <Text style={styles.price}>ETB {product.price.toLocaleString()}</Text>
        </View>

        {/* Store + Rating */}
        <View style={styles.metaRow}>
          <View style={styles.storeTag}>
            <Text style={styles.storeText}>🏪 {product.store}</Text>
          </View>
          <View style={styles.ratingTag}>
            <Text style={styles.ratingText}>⭐ {product.rating} ({product.reviews})</Text>
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
          <Text style={styles.bottomPrice}>ETB {product.price.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, added && styles.addBtnSuccess]}
          onPress={handleAddToCart}
        >
          <Text style={styles.addBtnText}>{added ? '✓ Added!' : 'Add to Cart'}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

  imageArea: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  back: {
    position: 'absolute',
    top: 56, left: 20,
    width: 40, height: 40,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 20, color: '#0A0A0A', fontWeight: '700' },
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
    width: 52, height: 52,
    borderRadius: 14, borderWidth: 1.5,
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
    paddingVertical: 16, borderRadius: 100,
    alignItems: 'center',
  },
  addBtnSuccess: { backgroundColor: '#22c55e' },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});