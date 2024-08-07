import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CardModal from './CardModal';
import { SvgProps } from 'react-native-svg';
import CurrencyAmount from './CurrencyAmount'; // CurrencyAmount bileşenini import edin

// SVG ikonlarınızı import edin
import GelirIkonu from '../assets/images/icons/gelirikonu.svg';
import GiderIkonu from '../assets/images/icons/giderikonu.svg';

type CardProps = {
  id: number;
  type: string;
  account_type: string;
  title: string;
  description: string;
  amount: string;
  currency: string;
  repeat_frequency: string;
  date: string;
  note: string;
  category: string;
  onSave: (
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
  ) => void;
};

const Card: React.FC<CardProps> = ({
  id,
  type,
  account_type,
  title,
  description,
  amount,
  currency,
  repeat_frequency,
  date,
  note,
  category,
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
    newType: string,
    newAccountType: string,
    newTitle: string,
    newDescription: string,
    newAmount: string,
    newCurrency: string,
    newRepeatFrequency: string,
    newDate: string,
    newNote: string,
    newCategory: string
  ) => {
    onSave(
      id,
      newType,
      newAccountType,
      newTitle,
      newDescription,
      newAmount,
      newCurrency,
      newRepeatFrequency,
      newDate,
      newNote,
      newCategory
    );
    setModalVisible(false); // Modal'ı kapat
  };

  // Gelir veya gider türüne göre ikonu seçin
  const IconComponent = type === 'Gelir' ? GelirIkonu : GiderIkonu;

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <View style={styles.imageContainer}>
          <IconComponent width={40} height={40} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
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
        type={type}
        account_type={account_type}
        title={title}
        description={description}
        amount={amount}
        currency={currency}
        repeat_frequency={repeat_frequency}
        date={date}
        note={note}
        category={category}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  description: {
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
