import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import * as ImagePicker from 'expo-image-picker';

const CATEGORIES = ['Shoes', 'Tops', 'Bags', 'Caps', 'Accessories'];
const EMOJIS: Record<string, string> = {
  Shoes: '👟', Tops: '👕', Bags: '👜', Caps: '🧢', Accessories: '⌚'
};

const CLOUD_NAME = 'dolwdgbdn';
const UPLOAD_PRESET = 'vdt16fwe';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'product.jpg',
      } as any);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch (e) {
      setError('Image upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !description || !category) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'products'), {
        name,
        price: Number(price),
        description,
        category,
        emoji: EMOJIS[category],
        imageUrl: imageUrl || '',
        sellerId: auth.currentUser?.uid,
        sellerName: auth.currentUser?.displayName,
        createdAt: new Date().toISOString(),
        available: true,
      });
      setSuccess(true);
      setTimeout(() => router.back(), 1500);
    } catch (e) {
      setError('Failed to add product. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.successMsg}>✓ Product added!</Text> : null}

        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderEmoji}>📷</Text>
              <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
            </View>
          )}
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>PRODUCT NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Nike Air Force 1"
            placeholderTextColor="rgba(245,243,238,0.2)"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>PRICE (ETB)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3500"
            placeholderTextColor="rgba(245,243,238,0.2)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your product..."
            placeholderTextColor="rgba(245,243,238,0.2)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>CATEGORY</Text>
          <View style={styles.categories}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, category === cat && styles.catBtnActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.catEmoji}>{EMOJIS[cat]}</Text>
                <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitBtn, (loading || uploading) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading || uploading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitBtnText}>Add Product to Store</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 24,
    paddingTop: 56, paddingBottom: 20,
  },
  back: { fontSize: 15, color: 'rgba(245,243,238,0.5)' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#F5F3EE' },
  scroll: { flex: 1, paddingHorizontal: 24 },
  error: { color: '#FF3C2E', fontSize: 13, marginBottom: 16, fontWeight: '500' },
  successMsg: { color: '#22c55e', fontSize: 14, marginBottom: 16, fontWeight: '600' },

  imagePicker: {
    height: 200, borderRadius: 20,
    overflow: 'hidden', marginBottom: 24,
    borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.08)',
    borderStyle: 'dashed',
  },
  imagePreview: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  imagePlaceholderEmoji: { fontSize: 40, marginBottom: 10 },
  imagePlaceholderText: { fontSize: 14, color: 'rgba(245,243,238,0.3)' },
  uploadingOverlay: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  uploadingText: { color: '#fff', fontSize: 13 },

  inputWrap: { marginBottom: 20 },
  label: {
    fontSize: 11, fontWeight: '600',
    color: 'rgba(245,243,238,0.4)',
    letterSpacing: 1.5, marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5, borderColor: 'rgba(245,243,238,0.08)',
    borderRadius: 14, padding: 16,
    color: '#F5F3EE', fontSize: 15,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 100, borderWidth: 1.5,
    borderColor: 'rgba(245,243,238,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  catBtnActive: { backgroundColor: '#FF3C2E', borderColor: '#FF3C2E' },
  catEmoji: { fontSize: 16 },
  catText: { fontSize: 13, color: 'rgba(245,243,238,0.5)', fontWeight: '500' },
  catTextActive: { color: '#fff' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1, borderTopColor: 'rgba(245,243,238,0.06)',
    padding: 20, paddingBottom: 32,
  },
  submitBtn: {
    backgroundColor: '#FF3C2E', borderRadius: 100,
    paddingVertical: 16, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});