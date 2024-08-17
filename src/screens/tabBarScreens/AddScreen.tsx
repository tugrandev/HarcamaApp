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
import { useNavigation, useRoute } from '@react-navigation/native';
import { insertExpense, getAccounts } from '../../database/database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CategoryModal from '../../components/CategoryModal';
import AccountBottomSheet from '../../components/AccountBottomSheet';
import { Dropdown } from 'react-native-element-dropdown';

interface Account {
  id: number;
  account_name: string;
  currency: string;
  balance: number;
}

const getCategoryIcon = (category: string | null) => {
  switch (category) {
    case 'Yemek':
      return 'fast-food-outline';
    case 'Ulaşım':
      return 'bus-outline';
    case 'Eğlence':
      return 'game-controller-outline';
    case 'Sağlık':
      return 'medkit-outline';
    case 'Alışveriş':
      return 'cart-outline';
    case 'Fatura':
      return 'receipt-outline';
    case 'Eğitim':
      return 'school-outline';
    case 'Diğer':
      return 'ellipsis-horizontal-circle-outline';
    default:
      return 'pricetag-outline'; // Varsayılan ikon
  }
};


const currencyIcons = {
  'TRY': 'try',
  'USD': 'usd',
  'EUR': 'euro',
  'GBP': 'gbp',
};

const getRepeatIcon = (repeatFrequency: string) => {
  switch (repeatFrequency) {
    case 'Bir kez':
      return 'clock-o';
    case 'Aylık':
      return 'calendar';
    case 'Haftalık':
      return 'calendar-check-o';
    case 'Yıllık':
      return 'calendar-plus-o';
    case 'Sürekli':
      return 'refresh';
    default:
      return 'repeat';
  }
};

const getAccountIcon = (account: string | null) => {
  switch (account) {
    case 'Maaş Hesabım':
      return 'bank';
    case 'Dolar Hesabım':
      return 'dollar';
    case 'Euro Hesabım':
      return 'euro';
    default:
      return 'bank';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Tamamlandı':
      return 'check';
    case 'Beklemede':
      return 'hourglass-half';
    default:
      return 'question';
  }
};

const AddScreen: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isIncome = selectedIndex === 0;
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState('');
  const [repeatFrequency, setRepeatFrequency] = useState('');
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);

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

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    getAccounts((fetchedAccounts: Account[]) => {
      setAccounts(fetchedAccounts);
    });
  };

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
    setAccount(null);
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
        account!,
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
    setAccount(newAccount);
    setAccountModalVisible(false);
  };

  const renderDropdownItem = (item: { label: string, value: string, icon?: string }) => {
    return (
      <View style={styles.item}>
        {item.icon && (
          <FontAwesome
            name={item.icon}
            size={18}
            color="#5c5b5b"
            style={styles.icon}
          />
        )}
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
    );
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
            <View style={styles.accountContainer}>
              <Text style={styles.label}>Hesaplarım</Text>
              <TouchableOpacity onPress={() => setAccountModalVisible(true)}>
                <Text style={styles.accountText}>Yeni Hesap Ekle</Text>
              </TouchableOpacity>

            </View>
            <View style={styles.accountPickerContainer}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={accounts.map(account => ({
                  label: account.account_name,
                  value: account.account_name,
                  icon: getAccountIcon(account.account_name)
                }))}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Bir hesap seçin"
                value={account}
                onChange={item => {
                  setAccount(item.value);
                }}
                renderLeftIcon={() => (
                  account && (
                    <FontAwesome
                      name={getAccountIcon(account)}
                      size={20}
                      color="#5c5b5b"
                    />
                  )
                )}
                renderItem={renderDropdownItem}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kategori</Text>
            <TouchableOpacity
              style={[
                styles.input,
                inputErrors.category && styles.inputError,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 45,
                  paddingHorizontal: 10,
                }
              ]}
              onPress={() => setCategoryModalVisible(true)}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={getCategoryIcon(category)} // category için uygun ikonu döndüren fonksiyon
                  size={25}
                  color="#5c5b5b"
                />
              </View>
              <Text style={styles.categoryText}>{category || "Kategori seçin"}</Text>
              <View style={styles.iconContainer}>
                <Ionicons name="chevron-down" size={20} color={'#c4c4c4'} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.amountContainer1}>
            <View style={styles.amountContainer2}>
              <Text style={styles.label}>Tutar</Text>
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
            </View>

            <View style={styles.currencyContainer}>
              <Text style={styles.label}>Para Birimi</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={[
                  { label: "TRY", value: "TRY", icon: currencyIcons["TRY"] },
                  { label: "USD", value: "USD", icon: currencyIcons["USD"] },
                  { label: "EUR", value: "EUR", icon: currencyIcons["EUR"] },
                  { label: "GBP", value: "GBP", icon: currencyIcons["GBP"] },
                ]}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Para birimi seçin"
                value={currency}
                onChange={item => {
                  setCurrency(item.value);
                }}
                renderLeftIcon={() => (
                  currency && (
                    <FontAwesome
                      name={currencyIcons[currency as keyof typeof currencyIcons]}
                      size={20}
                      color="#5c5b5b"
                    />
                  )
                )}
                renderItem={renderDropdownItem}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tekrar Sayısı</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={[
                { label: "Bir kez", value: "Bir kez", icon: 'clock-o' },
                { label: "Aylık", value: "Aylık", icon: 'calendar' },
                { label: "Haftalık", value: "Haftalık", icon: 'calendar-check-o' },
                { label: "Yıllık", value: "Yıllık", icon: 'calendar-plus-o' },
                { label: "Sürekli", value: "Sürekli", icon: 'refresh' },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Tekrar sıklığı seçin"
              value={repeatFrequency}
              onChange={item => {
                setRepeatFrequency(item.value);
              }}
              renderLeftIcon={() => (
                repeatFrequency && (
                  <FontAwesome
                    name={getRepeatIcon(repeatFrequency)}
                    size={20}
                    color="#5c5b5b"
                  />
                )
              )}
              renderItem={renderDropdownItem}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tarih</Text>
            <TouchableOpacity
              style={[styles.dateButton, inputErrors.date && styles.inputError]}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text>{date.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
              <Ionicons name="calendar-clear-outline" size={20} color={'#c4c4c4'} style={styles.calendarIcon} />
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
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={[
                { label: "Tamamlandı", value: "Tamamlandı", icon: getStatusIcon("Tamamlandı") },
                { label: "Beklemede", value: "Beklemede", icon: getStatusIcon("Beklemede") },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Durum seçin"
              value={status}
              onChange={item => {
                setStatus(item.value);
              }}
              renderLeftIcon={() => (
                status && (
                  <FontAwesome
                    name={getStatusIcon(status)}
                    size={20}
                    color="#5c5b5b"
                  />
                )
              )}
              renderItem={renderDropdownItem}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Not</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              value={note}
              onChangeText={setNote}
              placeholder="Not ekleyin"
              multiline
            />
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
        onSave={(newAccountName) => {
          // Hesap kaydetme işlemi
          handleAccountSave(newAccountName);
          setAccountModalVisible(false);
        }}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  amountContainer1: {
    marginBottom: 16,
    flexDirection: "row",
  },
  amountContainer2: {
    flex: 2,
    marginEnd: 10,
    flexDirection: "column",
  },
  amountInput: {
    backgroundColor: "white",
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#c4c4c4',
  },
  toggleContainer: {
    marginTop: 5,
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    padding: 4,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  iconWrapper: {
    width: 30,  // Sabit genişlik
    height: 30, // Sabit yükseklik
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#5c5b5b',
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
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
  accountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 5,
  },
  accountText: {
    color: '#007bff',
    fontSize: 11,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 2,
    padding: 5,
  },
  formContainer: {
    padding: 15,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#5c5b5b",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c4c4c4',
    height: 45,
  },
  dateButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#c4c4c4',
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
  dropdown: {
    height: 43,
    width: '100%',
    borderColor: '#c4c4c4',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    marginLeft: 8,
    fontSize: 14,
    color: '#5c5b5b',
  },
  selectedTextStyle: {
    marginLeft: 8,
    fontSize: 14,
    color: '#5c5b5b',
  },
  currencyContainer: {
    flex: 1,
  },
  inputError: {
    borderColor: "red",
  },
  iconContainer: {
    position: 'absolute',
    right: 7,
    top: 15,
  },
  categoryText: {
    color: '#5c5b5b',
    fontSize: 14,
  },
  noteInput: {
    height: 80,
  }
});

export default AddScreen;
