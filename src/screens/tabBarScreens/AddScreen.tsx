import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, useRoute } from '@react-navigation/native';
import { insertExpense } from '../../database/database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CategoryModal from '../../components/CategoryModal';
import AccountBottomSheet from '../../components/AccountBottomSheet'; // Yeni bottom sheet bileşenini içeri aktar

const AddScreen: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isIncome = selectedIndex === 0;

  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState('');
  const [repeatFrequency, setRepeatFrequency] = useState('');
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false); // Bottom sheet görünürlüğü için state

  const [inputErrors, setInputErrors] = useState({
    account: false,
    amount: false,
    category: false,
    currency: false,
    repeatFrequency: false,
    date: false,
    status: false,
  });

  const navigation = useNavigation();
  const route = useRoute();

  const validateForm = () => {
    const errors = {
      account: !account,
      amount: !amount,
      category: !category,
      currency: !currency,
      repeatFrequency: !repeatFrequency,
      date: !date,
      status: !status,
    };

    setInputErrors(errors);

    return !Object.values(errors).includes(true);
  };

  const resetForm = () => {
    setAccount('');
    setAmount('');
    setCategory('');
    setCurrency('');
    setRepeatFrequency('');
    setDate(new Date());
    setStatus('');
    setNote('');
    setInputErrors({
      account: false,
      amount: false,
      category: false,
      currency: false,
      repeatFrequency: false,
      date: false,
      status: false,
    });
  };

  const saveExpense = () => {
    if (validateForm()) {
      const type = isIncome ? 'Gelir' : 'Gider';

      insertExpense(
        type,
        account,
        category,
        parseFloat(amount),
        currency,
        repeatFrequency,
        date.toISOString().split('T')[0],
        note,
        category
      );

      Alert.alert('Başarılı', 'Kayıt başarıyla tamamlandı.');
      resetForm();
    } else {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
    }
  };

  useEffect(() => {
    if (route.params?.save) {
      saveExpense();
      navigation.setParams({ save: false });
    }
  }, [route.params?.save]);

  const handleAccountSave = (newAccount: string) => {
    // Yeni hesap kaydedildiğinde hesap listesine ekle ve bottom sheet'i kapat
    setAccount(newAccount);
    setAccountModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraHeight={100}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.segment, isIncome && styles.activeIncomeSegment]}
            onPress={() => setSelectedIndex(0)}
          >
            <Text style={[styles.segmentText, isIncome && styles.activeSegmentText]}>Gelir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, !isIncome && styles.activeExpenseSegment]}
            onPress={() => setSelectedIndex(1)}
          >
            <Text style={[styles.segmentText, !isIncome && styles.activeSegmentText]}>Gider</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hesaplarım</Text>
            <View style={styles.accountPickerContainer}>
              <View style={styles.pickerWrapper}>
                <RNPickerSelect
                  onValueChange={(value) => setAccount(value)}
                  items={[
                    { label: 'Maaş Hesabım', value: 'Maaş Hesabım' },
                    { label: 'Diğer Hesap 1', value: 'Diğer Hesap 1' },
                    { label: 'Diğer Hesap 2', value: 'Diğer Hesap 2' },
                  ]}
                  value={account}
                  placeholder={{ label: 'Bir hesap seçin', value: null }}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => setAccountModalVisible(true)}>
                <View style={styles.addIconContainer}>
                  <Ionicons name="add-circle-outline" size={24} color="blue" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kategori</Text>
            <TouchableOpacity
              style={[styles.input, inputErrors.category && styles.inputError]}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text>{category || "Kategori seçin"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tutar</Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={[
                  styles.amountInput,
                  inputErrors.amount && styles.inputError,
                ]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Tutar giriniz"
              />
              <RNPickerSelect
                onValueChange={(value) => setCurrency(value)}
                items={[
                  { label: "TRY", value: "TRY" },
                  { label: "USD", value: "USD" },
                  { label: "EUR", value: "EUR" },
                  { label: "GBP", value: "GBP" },
                ]}
                value={currency}
                placeholder={{ label: "Para birimi seçin", value: null }}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tekrar Sayısı</Text>
            <RNPickerSelect
              onValueChange={(value) => setRepeatFrequency(value)}
              items={[
                { label: "Bir kez", value: "Bir kez" },
                { label: "Aylık", value: "Aylık" },
                { label: "Haftalık", value: "Haftalık" },
                { label: "Yıllık", value: "Yıllık" },
                { label: "Sürekli", value: "Sürekli" },
              ]}
              value={repeatFrequency}
              placeholder={{ label: "Tekrar sıklığı seçin", value: null }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tarih</Text>
            <TouchableOpacity
              style={[styles.dateButton, inputErrors.date && styles.inputError]}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text>{date.toLocaleDateString("tr-TR")}</Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={datePickerVisible}
            mode="date"
            date={date}
            onConfirm={(selectedDate) => {
              setDatePickerVisible(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
            onCancel={() => setDatePickerVisible(false)}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Durum</Text>
            <RNPickerSelect
              onValueChange={(value) => setStatus(value)}
              items={[
                { label: "Tamamlandı", value: "Tamamlandı" },
                { label: "Beklemede", value: "Beklemede" },
                { label: "İptal Edildi", value: "İptal Edildi" },
              ]}
              value={status}
              placeholder={{ label: "Durum seçin", value: null }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Not</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Not ekleyin"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Etiketler</Text>
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Maaş</Text>
                <TouchableOpacity>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.addTagButton}>
              <Text style={styles.addTagText}>Yeni etiket ekle</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAwareScrollView>

      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSelectCategory={(selectedCategory) => setCategory(selectedCategory)}
      />

      <AccountBottomSheet
        isVisible={accountModalVisible}
        onClose={() => setAccountModalVisible(false)}
        onSave={handleAccountSave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    padding: 4,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  activeIncomeSegment: {
    backgroundColor: "#4CAF50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  activeExpenseSegment: {
    backgroundColor: "#F44336",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    color: "#757575",
  },
  activeSegmentText: {
    color: "white",
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountInput: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#cccccc",
    marginRight: 5,
  },
  dateButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  calendarIcon: {
    fontSize: 20,
  },
  accountPickerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerWrapper: {
    flex: 1, // Picker'ın tüm boşluğu kaplaması için
  },
  addButton: {
    marginLeft: 8, // Butonu picker'a yaklaştırmak için margin ekleniyor
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  addIconContainer: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  tag: {
    backgroundColor: "#e8f5e9",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "green",
    marginRight: 4,
  },
  closeIcon: {
    color: "green",
    fontSize: 16,
  },
  addTagButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addTagText: {
    color: "blue",
  },
  inputError: {
    borderColor: "red",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  inputAndroid: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
};

export default AddScreen;
