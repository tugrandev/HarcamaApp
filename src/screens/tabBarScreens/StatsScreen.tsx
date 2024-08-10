// StatsScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { getExpenses } from '../../database/database'; // Lütfen doğru yolu belirtin
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

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
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
            <Text style={styles.statValue}>{totalIncome.toFixed(2)} TRY</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statTitle}>Toplam Gider:</Text>
            <Text style={styles.statValue}>{totalExpenses.toFixed(2)} TRY</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statTitle}>Net Bakiye:</Text>
            <Text
              style={[
                styles.statValue,
                { color: totalIncome - totalExpenses >= 0 ? 'green' : 'red' },
              ]}
            >
              {(totalIncome - totalExpenses).toFixed(2)} TRY
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
});

export default StatsScreen;
