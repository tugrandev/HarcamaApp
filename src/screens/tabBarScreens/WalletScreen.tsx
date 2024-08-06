import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, View } from 'react-native';
import Card from '../../components/Card';
import { data } from '../../database/data';

const WalletScreen = () => {
  const [cardsData, setCardsData] = useState(data);

  const handleSave = (id, title, description, amount) => {
    const updatedData = cardsData.map(card => {
      if (card.id === id) {
        return { ...card, title, description, amount };
      }
      return card;
    });

    setCardsData(updatedData);
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Liste boş</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <FlatList
        data={cardsData}
        renderItem={({ item }) => (
          <Card
            id={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            amount={item.amount}
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
