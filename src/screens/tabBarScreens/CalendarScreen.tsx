import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses } from '../../database/database';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

interface Expense {
  id: number;
  type: string;
  account_type: string;
  title: string;
  amount: number;
  currency: string;
  repeat_frequency: string;
  date: string;
  note: string;
  category: string;
}

const CalendarScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  const fetchExpenses = () => {
    setLoading(true);
    getExpenses((data) => {
      setExpenses(data);
      processDates(data);
      setLoading(false);
    });
  };

  const processDates = (data: Expense[]) => {
    const dates: any = {};
  
    data.forEach((item) => {
      const formattedDate = format(new Date(item.date), 'yyyy-MM-dd');
  
      // Eğer bu tarihte bir gelir veya gider noktası zaten eklenmişse yeniden ekleme
      if (!dates[formattedDate]) {
        dates[formattedDate] = { dots: [] };
      }
  
      // Gelir için yeşil nokta ekleme
      if (item.type === 'Gelir' && !dates[formattedDate].dots.some((dot: any) => dot.color === 'green')) {
        dates[formattedDate].dots.push({
          key: `gelir-${item.id}`,
          color: 'green',
        });
      }
  
      // Gider için kırmızı nokta ekleme
      if (item.type === 'Gider' && !dates[formattedDate].dots.some((dot: any) => dot.color === 'red')) {
        dates[formattedDate].dots.push({
          key: `gider-${item.id}`,
          color: 'red',
        });
      }
    });
  
    setMarkedDates(dates);
  };
  

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    const filteredExpenses = expenses.filter(
      (expense) => format(new Date(expense.date), 'yyyy-MM-dd') === day.dateString
    );
    setSelectedExpenses(filteredExpenses);
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, marked: true, selectedColor: '#00adf5' },
            }}
            markingType={'multi-dot'}
          />

          {selectedExpenses.length > 0 && (
            <View style={styles.expensesContainer}>
              <Text style={styles.selectedDateText}>Seçilen Tarih: {selectedDate}</Text>
              {selectedExpenses.map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <Text style={styles.expenseAmount}>
                    {expense.amount.toFixed(2)} {expense.currency} - {expense.category}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  expensesContainer: {
    marginTop: 20,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseAmount: {
    fontSize: 16,
    color: '#555',
  },
});

export default CalendarScreen;
