import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CardModal from './CardModal';
import CurrencyAmount from './CurrencyAmount'; // CurrencyAmount bileşenini import edin

// SVG ikonlarınızı import edin
import GelirIkonu from '../assets/images/icons/gelirikonu.svg';
import GiderIkonu from '../assets/images/icons/giderikonu.svg';

type CardProps = {
  id: number;
  add_type: string;
  account_type: string;
  category: string;
  amount: string;
  currency: string;
  repeat_frequency: string;
  date: string;
  situation: string;
  note: string;
  onSave: (
    id: number,
    add_type: string,
    account_type: string,
    category: string,
    amount: string,
    currency: string,
    repeat_frequency: string,
    date: string,
    situation: string,
    note: string,
  ) => void;
};

const Card: React.FC<CardProps> = ({
  id,
  add_type,
  account_type,
  category,
  amount,
  currency,
  repeat_frequency,
  date,
  situation,
  note,
  onSave
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSave = (
    new_add_type: string,
    new_account_type: string,
    new_category: string,
    new_amount: string,
    new_currency: string,
    new_repeat_frequency: string,
    new_date: string,
    new_situation: string,
    new_note: string
  ) => {
    onSave(
      id,
      new_add_type,
      new_account_type,
      new_category,
      new_amount,
      new_currency,
      new_repeat_frequency,
      new_date,
      new_situation,
      new_note,
    );
    setModalVisible(false); // Modal'ı kapat
  };

  // Gelir veya gider türüne göre ikonu seçin
  const IconComponent = add_type === 'Gelir' ? GelirIkonu : GiderIkonu;

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <View style={styles.imageContainer}>
          <IconComponent width={40} height={40} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.note} numberOfLines={1} ellipsizeMode="tail">
            {note}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <CurrencyAmount amount={amount} currency={currency} />
        </View>
      </TouchableOpacity>

      <CardModal
        visible={modalVisible}
        onClose={handleCloseModal}
        add_type={add_type}
        account_type={account_type}
        category={category}
        amount={amount}
        currency={currency}
        repeat_frequency={repeat_frequency}
        date={date}
        situation={situation}
        note={note}
        onSave={handleSave}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    margin: 14,
    marginVertical: 8,
    shadowColor: '#ACACAC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 10,
    height: 80,
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: 30,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  note: {
    marginTop: 8,
    fontSize: 14,
    marginBottom: 4,
  },
  image: {
    width: 40,
    height: 40,
  },
  amountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Card;
