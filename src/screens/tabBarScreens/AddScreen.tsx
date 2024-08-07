import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const SalaryDetailsScreen: React.FC = () => {
  const [isIncome, setIsIncome] = useState(true);
  const [account, setAccount] = useState('Maaş Hesabım');
  const [amount, setAmount] = useState('25.000');
  const [currency, setCurrency] = useState('TRY');
  const [repeatFrequency, setRepeatFrequency] = useState('Sürekli');
  const [date, setDate] = useState(new Date('2024-07-25'));
  const [status, setStatus] = useState('Tamamlandı');
  const [note, setNote] = useState('Yeni dönem maaş');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const renderPicker = (
    value: string,
    setValue: (value: string) => void,
    items: string[]
  ) => (
    <Picker
      selectedValue={value}
      onValueChange={(itemValue) => setValue(itemValue)}
      style={styles.picker}
    >
      {items.map((item) => (
        <Picker.Item key={item} label={item} value={item} />
      ))}
    </Picker>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isIncome && styles.activeToggle]}
          onPress={() => setIsIncome(true)}
        >
          <Text style={[styles.toggleText, isIncome && styles.activeToggleText]}>Gelir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isIncome && styles.activeToggle]}
          onPress={() => setIsIncome(false)}
        >
          <Text style={[styles.toggleText, !isIncome && styles.activeToggleText]}>Gider</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hesaplarım</Text>
            {renderPicker(account, setAccount, ['Maaş Hesabım', 'Diğer Hesap 1', 'Diğer Hesap 2'])}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Başlık</Text>
            <TextInput
              style={styles.input}
              value="Maaş Ödemesi"
              onChangeText={(text) => {/* Handle title change */}}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tutar</Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              {renderPicker(currency, setCurrency, ['TRY', 'USD', 'EUR', 'GBP'])}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tekrar Sayısı</Text>
            {renderPicker(repeatFrequency, setRepeatFrequency, ['Sürekli', 'Bir kez', 'Haftalık', 'Aylık', 'Yıllık'])}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tarih</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setDatePickerOpen(true)}>
              <Text>{date.toLocaleDateString('tr-TR')}</Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          {datePickerOpen && (
            <DatePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setDatePickerOpen(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Durum</Text>
            {renderPicker(status, setStatus, ['Tamamlandı', 'Beklemede', 'İptal Edildi'])}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Not</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Etiketler</Text>
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Maaş</Text>
                <TouchableOpacity>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.addTagButton}>
              <Text style={styles.addTagText}>Yeni etiket ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    fontSize: 24,
  },
  iconButton: {
    marginLeft: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 8,
  },
  toggleButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  toggleText: {
    fontSize: 16,
  },
  activeToggleText: {
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  amountContainer: {
    flexDirection: 'row',
  },
  amountInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  dateButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'green',
    marginRight: 4,
  },
  closeIcon: {
    color: 'green',
    fontSize: 16,
  },
  addTagButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addTagText: {
    color: 'blue',
  },
});

export default SalaryDetailsScreen;
