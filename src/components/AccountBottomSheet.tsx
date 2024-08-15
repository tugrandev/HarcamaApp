import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';

interface AccountBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (accountName: string) => void;
}

const AccountBottomSheet: React.FC<AccountBottomSheetProps> = ({ isVisible, onClose, onSave }) => {
  const [accountName, setAccountName] = useState('');
  const inputRef = useRef<TextInput>(null); // Input referansı oluştur

  const handleSave = () => {
    if (accountName.trim()) {
      onSave(accountName.trim());
      setAccountName('');
    } else {
      Alert.alert('Hata', 'Lütfen geçerli bir hesap adı giriniz.');
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Modal görünür olduğunda inputa odaklan
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Kısa bir gecikme, modalın tam olarak açılmasını beklemek için
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.handle} />
          <Text style={styles.title}>Yeni Hesap Ekle</Text>
          <TextInput
            ref={inputRef} // Inputa referans ekle
            style={styles.input}
            placeholder="Hesap Adı"
            value={accountName}
            onChangeText={setAccountName}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AccountBottomSheet;
