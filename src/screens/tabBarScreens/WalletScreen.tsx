import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, View, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpensesByDate } from '../../database/database';
import Card from '../../components/Card';

interface Expense {
  id: number;
  type: string;
  account_type: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  repeat_frequency: string;
  date: string;
  note: string;
  category: string;
}

interface WalletScreenProps {
  route: {
    params?: {
      selectedDate?: string;
    };
  };
}

const WalletScreen: React.FC<WalletScreenProps> = ({ route }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const selectedDate = route.params?.selectedDate || new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD' formatında tarih

  const fetchExpensesByDate = (date: string) => {
    setLoading(true);
    getExpensesByDate(date, (fetchedExpenses: Expense[]) => {
      setExpenses(fetchedExpenses);
      setLoading(false);
    });
  };

  // useFocusEffect kullanarak ekran odaklandığında verileri yenileyin
  useFocusEffect(
    useCallback(() => {
      fetchExpensesByDate(selectedDate);
    }, [selectedDate])
  );

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
      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <Card
            id={item.id}
            type={item.type}
            account_type={item.account_type}
            title={item.title}
            description={item.description}
            amount={item.amount}
            currency={item.currency}
            repeat_frequency={item.repeat_frequency}
            date={item.date}
            note={item.note}
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
});

export default WalletScreen;
