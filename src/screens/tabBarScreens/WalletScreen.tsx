import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, View, ActivityIndicator } from 'react-native';
import Card from '../../components/Card';
import { initDB, getExpenses, updateExpense } from '../../database/database'; // Veritabanı işlemleri
import GelirGiderLogo from '../../assets/images/icons/gelirikonu.svg'; // SVG ikonunuzu import edin

const WalletScreen: React.FC = () => {
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true); // Yüklenme durumunu takip eden değişken

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB();
        fetchData();
      } catch (error) {
        console.error("Database initialization error:", error);
      }
    };

    initializeDB();
  }, []);

  const fetchData = () => {
    getExpenses((expenses) => {
      const formattedExpenses = expenses.map((expense) => ({
        id: expense.id,
        type: expense.type,
        account_type: expense.account_type,
        title: expense.title,
        description: expense.description,
        amount: expense.amount ? expense.amount.toString() : "0", // amount değeri null ise "0" olarak göster
        currency: expense.currency,
        repeat_frequency: expense.repeat_frequency,
        date: expense.date,
        note: expense.note,
        category: expense.category,
        image: GelirGiderLogo, // SVG ikonunuzu buraya ekleyin
      }));
      setCardsData(formattedExpenses);
      setLoading(false); // Veriler yüklendiğinde loading durumunu false yap
    });
  };

  const handleSave = (
    id: number,
    type: string,
    account_type: string,
    title: string,
    description: string,
    amount: string,
    currency: string,
    repeat_frequency: string,
    date: string,
    note: string,
    category: string
  ) => {
    // Veritabanında güncelleme işlemi
    updateExpense(id, type, account_type, title, parseFloat(amount), currency, repeat_frequency, date, note, category);
    fetchData(); // Verileri yeniden çekmek için
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Liste boş</Text>
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
        data={cardsData}
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
            image={item.image}
            onSave={handleSave}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyComponent}
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
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});

export default WalletScreen;
