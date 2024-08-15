import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses } from '../../database/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-chart-kit';

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

const StatsScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mostSpentCategory, setMostSpentCategory] = useState<string>('');
  const [leastSpentCategory, setLeastSpentCategory] = useState<string>('');
  const [averageSpending, setAverageSpending] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  const fetchExpenses = () => {
    setLoading(true);
    getExpenses((data) => {
      setExpenses(data);
      processData(data);
      setLoading(false);
    });
  };

  const processData = (data: Expense[]) => {
    let income = 0;
    let expensesTotal = 0;
    const categoryMap: { [key: string]: number } = {};

    data.forEach((item) => {
      if (item.type === 'Gelir') {
        income += item.amount;
      } else if (item.type === 'Gider') {
        expensesTotal += item.amount;
        // Kategoriye göre dağılım
        if (categoryMap[item.category]) {
          categoryMap[item.category] += item.amount;
        } else {
          categoryMap[item.category] = item.amount;
        }
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expensesTotal);

    // En çok ve en az harcama yapılan kategorilerin hesaplanması
    const sortedCategories = Object.entries(categoryMap).sort(([, a], [, b]) => b - a);
    setMostSpentCategory(sortedCategories[0] ? sortedCategories[0][0] : '');
    setLeastSpentCategory(sortedCategories[sortedCategories.length - 1] ? sortedCategories[sortedCategories.length - 1][0] : '');

    // Ortalama harcama miktarı hesaplanması
    const average = expensesTotal / data.filter(item => item.type === 'Gider').length;
    setAverageSpending(average);

    // PieChart için verilerin hazırlanması
    const breakdown = Object.keys(categoryMap).map((key, index) => ({
      name: key,
      amount: categoryMap[key],
      color: chartColors[index % chartColors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));

    setCategoryBreakdown(breakdown);
  };

  const chartColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#66FF66',
    '#FF6666',
    '#66FFFF',
    '#FF66FF',
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Finansal İstatistikler</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.statContainer}>
            <Text style={styles.statTitle}>Toplam Gelir:</Text>
            <Text style={styles.statValue}>{totalIncome.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statTitle}>Toplam Gider:</Text>
            <Text style={styles.statValue}>{totalExpenses.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statTitle}>Net Bakiye:</Text>
            <Text
              style={[
                styles.statValue,
                { color: totalIncome - totalExpenses >= 0 ? 'green' : 'red' },
              ]}
            >
              {(totalIncome - totalExpenses).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </Text>
          </View>

          <Text style={styles.chartHeader}>Kategoriye Göre Gider Dağılımı</Text>
          {categoryBreakdown.length > 0 ? (
            <PieChart
              data={categoryBreakdown}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={chartConfig}
              accessor={'amount'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              absolute
            />
          ) : (
            <Text style={styles.noDataText}>Görüntülenecek veri yok.</Text>
          )}

          {/* İstatistik Kartları */}
          <View style={styles.statisticsContainer}>
            <View style={styles.statBox}>
              <MaterialIcons name="pie-chart" size={24} color="#FF6384" />
              <Text style={styles.statBoxTitle}>En Çok Harcama Yapılan Kategori</Text>
              <Text style={styles.statBoxValue}>{mostSpentCategory || 'Veri Yok'}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialIcons name="category" size={24} color="#36A2EB" />
              <Text style={styles.statBoxTitle}>En Az Harcama Yapılan Kategori</Text>
              <Text style={styles.statBoxValue}>{leastSpentCategory || 'Veri Yok'}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialIcons name="attach-money" size={24} color="#FFCE56" />
              <Text style={styles.statBoxTitle}>Ortalama Harcama</Text>
              <Text style={styles.statBoxValue}>{averageSpending.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#4BC0C0" />
              <Text style={styles.statBoxTitle}>Toplam Harcama</Text>
              <Text style={styles.statBoxValue}>{totalExpenses.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: false,
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
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statTitle: {
    fontSize: 18,
    color: '#333',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
  statisticsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  statBoxTitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  statBoxValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StatsScreen;
