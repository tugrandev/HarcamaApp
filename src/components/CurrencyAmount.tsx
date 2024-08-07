import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { currencySymbol } from '../utils/currencySymbol';

type CurrencyAmountProps = {
  amount: string;
  currency: string;
};

const CurrencyAmount: React.FC<CurrencyAmountProps> = ({ amount, currency }) => {
  const symbol = currencySymbol(currency);
  return <Text style={styles.amountStyle}>{`${symbol} ${amount}`}</Text>;
};

const styles = StyleSheet.create({
  amountStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CurrencyAmount;
