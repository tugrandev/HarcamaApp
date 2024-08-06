import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CardModal from './CardModal';

type CardProps = {
  id: number;
  title: string;
  description: string;
  image: React.ComponentType<any>;
  amount?: string;
  onSave: (id: number, title: string, description: string, amount: string) => void;
};

const Card = ({ id, title, description, image: GelirGiderLogo, amount, onSave }: CardProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSave = (newTitle, newDescription, newAmount) => {
    onSave(id, newTitle, newDescription, newAmount);
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <View style={styles.GelirGiderLogoContainer}>
          <GelirGiderLogo style={styles.GelirGiderLogoImage} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
            {description}
          </Text>
        </View>
        <View style={styles.tutarContainer}>
          <Text style={styles.tutarStyle}>{amount}</Text>
        </View>
      </TouchableOpacity>

      <CardModal
        visible={modalVisible}
        onClose={handleCloseModal}
        title={title}
        description={description}
        amount={amount}
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
  GelirGiderLogoContainer: {
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
  GelirGiderLogoImage: {
    width: 40,
    height: 40,
  },
  tutarStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tutarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Card;
