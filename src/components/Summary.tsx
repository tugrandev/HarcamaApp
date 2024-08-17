import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Summary = () => {
  return (
    <View style={styles.container}>

      <TouchableOpacity>
        <View style={styles.monthContainer}>
          <Text style={styles.month}>Ağustos</Text>
          <Ionicons name="chevron-down" size={20} color={'#c4c4c4'} style={styles.icon} />
        </View>
      </TouchableOpacity>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>$3,827.05</Text>
        <Ionicons name="stats-chart" size={24} color="green" />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <View style={styles.iconBackgroundGreen}>
            <Ionicons name="arrow-down" size={20} color="white" />
          </View>
          <Text style={styles.detailValue}>$9,225</Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.iconBackgroundRed}>
            <Ionicons name="arrow-up" size={20} color="white" />
          </View>
          <Text style={styles.detailValue}>$5,398</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  monthContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  month: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 3,
    marginTop: 7,
    color: '#c4c4c4',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackgroundGreen: {
    backgroundColor: 'green',
    borderRadius: 20,
    padding: 10,
    marginBottom: 5,
  },
  iconBackgroundRed: {
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 10,
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
  },
  detailValue: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Summary;
