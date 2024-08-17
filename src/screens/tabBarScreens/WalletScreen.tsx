import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { getExpensesByDate, getAccounts } from '../../database/database';
import Card from '../../components/Card';
import Summary from '../../components/Summary';
import Harcama from '../../assets/Harcama.svg';
import { Dropdown } from 'react-native-element-dropdown';

interface Expense {
  id: number;
  add_type: string;
  account_type: string;
  category: string;
  amount: number;
  currency: string;
  repeat_frequency: string;
  date: string;
  situation: string;
  note: string;
}

interface Account {
  id: number;
  account_name: string;
  currency: string;
  balance: number;
}

interface WalletScreenProps {
  route: {
    params?: {
      selectedDate?: string;
    };
  };
}

const getAccountIcon = (account: string | null) => {
  switch (account) {
    case 'Maaş Hesabım':
      return 'bank';
    case 'Dolar Hesabım':
      return 'dollar';
    case 'Euro Hesabım':
      return 'euro';
    default:
      return 'bank'; // Varsayılan ikon
  }
};

const WalletScreen: React.FC<WalletScreenProps> = ({ route }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const selectedDate = route.params?.selectedDate || new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD' formatında tarih

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    getAccounts((fetchedAccounts: Account[]) => {
      setAccounts(fetchedAccounts);
    });
  };

  const fetchExpensesByDate = (date: string) => {
    setLoading(true);
    getExpensesByDate(date, (fetchedExpenses: Expense[]) => {
      setExpenses(fetchedExpenses);
      setLoading(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchExpensesByDate(selectedDate);
    }, [selectedDate])
  );

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

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Bu tarihte veri bulunamadı.</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.header}>
        <Harcama width={100} height={30} />
        <TouchableOpacity>
          <Ionicons name="help-circle" size={30} color="black" />
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
            icon: getAccountIcon(account.account_name) // Hesap ikonunu buradan belirliyoruz
          }))}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Hesap Seçiniz"
          value={selectedAccount}
          onChange={item => {
            setSelectedAccount(item.value);
          }}
          renderLeftIcon={() => (
            selectedAccount && (
              <FontAwesome
                name={getAccountIcon(selectedAccount)}
                size={20}
                color="#5c5b5b"
              />
            )
          )}
          renderItem={renderDropdownItem} // Öğeler için render fonksiyonunu buradan özelleştiriyoruz
        />
      </View>

      <View style={styles.summary}>
        <Summary />
      </View>

      <View style={styles.segmentedControlContainer}>
        <SegmentedControl
          values={['Gelir', 'Gider']}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            handleIndexChange(event.nativeEvent.selectedSegmentIndex);
          }}
          style={styles.segmentedControl}
        />
      </View>

      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <Card
            id={item.id}
            add_type={item.add_type}
            account_type={item.account_type}
            amount={item.amount}
            currency={item.currency}
            repeat_frequency={item.repeat_frequency}
            date={item.date}
            note={item.note}
            situation={item.situation}
            category={item.category}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={expenses.length === 0 ? styles.emptyContent : undefined} // Eklendi
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 13,
  },
  summary: {

  },
  accountPickerContainer: {
    marginHorizontal: 15,
    marginVertical: 8,
  },
  dropdown: {
    height: 45,
    borderColor: '#c4c4c4',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5c5b5b',
  },
  dropdownStyle: {
    borderRadius: 12, // Köşeleri yuvarlatmak için
    borderColor: '#c4c4c4',
    borderWidth: 1,
  },
  selectedTextStyle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5c5b5b',
  },
  segmentedControlContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    marginBottom: 0,
    borderRadius: 100,
  },
  segmentedControl: {
    height: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Eklendi: Mesajın tam ortada çıkması için
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  emptyContent: {
    flexGrow: 1, // Eklendi: Mesajın tam ortada çıkması için
    justifyContent: 'center', // Eklendi: Mesajın tam ortada çıkması için
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#5c5b5b',
  },
});

export default WalletScreen;
