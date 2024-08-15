import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const initialCategories = [
  { label: 'Yemek', icon: 'fast-food-outline' },
  { label: 'Ulaşım', icon: 'bus-outline' },
  { label: 'Alışveriş', icon: 'cart-outline' },
  { label: 'Fatura', icon: 'receipt-outline' },
  { label: 'Sağlık', icon: 'medkit-outline' },
  { label: 'Eğitim', icon: 'school-outline' },
  { label: 'Diğer', icon: 'ellipsis-horizontal-circle-outline' },
  { label: 'Ekle', icon: 'add-circle-outline' }, // "Ekle" kutusu
];

const CategoryModal = ({ visible, onClose, onSelectCategory }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const inputRef = useRef<TextInput>(null); // Yeni kategori ekleme inputu için referans

  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
      Alert.alert('Hata', 'Kategori ismi boş olamaz');
      return;
    }
    const newCategoryItem = { label: newCategory, icon: 'pricetag-outline' }; // Varsayılan ikon
    setCategories([...categories.slice(0, -1), newCategoryItem, categories[categories.length - 1]]); // "Ekle" butonu en son kalacak şekilde listeyi güncelle
    setNewCategory('');
    setAddModalVisible(false);
  };

  useEffect(() => {
    if (isAddModalVisible) {
      // Yeni kategori modalı görünür olduğunda inputa odaklan
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Kısa bir gecikme, modalın tam olarak açılmasını beklemek için
    }
  }, [isAddModalVisible]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
    >
      <View style={styles.modalContent}>
        <View style={styles.handle} />
        <Text style={styles.modalTitle}>Kategori Seçin</Text>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => {
                if (item.label === 'Ekle') {
                  setAddModalVisible(true); // Ekle butonuna basıldığında yeni modal aç
                } else {
                  onSelectCategory(item.label);
                  onClose();
                }
              }}
            >
              <Ionicons name={item.icon} size={40} color="black" />
              <Text style={styles.categoryLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.label}
          numColumns={3} // 3 sütunlu düzen
        />

        {/* Yeni Kategori Ekle Modalı */}
        <Modal
          isVisible={isAddModalVisible}
          onBackdropPress={() => setAddModalVisible(false)}
          onSwipeComplete={() => setAddModalVisible(false)}
          swipeDirection="down"
          style={styles.addModal}
          propagateSwipe
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.addModalContent}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          >
            <Text style={styles.modalTitle}>Yeni Kategori Ekle</Text>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef} // Inputa referans ekle
                style={styles.input}
                placeholder="Yeni kategori ismi"
                value={newCategory}
                onChangeText={setNewCategory}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                <Ionicons name="checkmark-circle-outline" size={30} color="green" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',  // Modalın ekranın altından yukarı açılmasını sağlar
    margin: 0,  // Kenar boşluklarını sıfırlar
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '60%',  // Ekranın alt yarısını kaplar
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    height: Dimensions.get('window').width / 3 - 20, // Kare kutular
  },
  categoryLabel: {
    marginTop: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  addModal: {
    justifyContent: 'flex-end',  // Modalın ekranın altından yukarı açılmasını sağlar
    margin: 0,  // Kenar boşluklarını sıfırlar
  },
  addModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    justifyContent: 'center', // İçeriği ortalar
  },
  inputRow: {
    flexDirection: 'row',  // Input ve butonu yan yana yerleştirir
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    marginBottom: 20,
  },
  addButton: {
    marginLeft: 10,
    padding: 5, // Butonun çevresindeki boşlukları küçültmek için padding azaltıldı
  },
});

export default CategoryModal;
