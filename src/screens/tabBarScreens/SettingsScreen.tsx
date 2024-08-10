// SettingsScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('TRY');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Türkçe');

  const handleDarkModeToggle = () => {
    setIsDarkMode((previousState) => !previousState);
    // Burada tema ayarlarını saklamak için bir işlemi başlatabilirsiniz.
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    // Burada seçili para birimini kaydetmek için bir işlemi başlatabilirsiniz.
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    // Burada seçili dili kaydetmek için bir işlemi başlatabilirsiniz.
  };

  const handleResetApp = () => {
    Alert.alert(
      "Uygulamayı Sıfırla",
      "Uygulamayı sıfırlamak istediğinize emin misiniz? Tüm veriler silinecektir.",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Evet",
          onPress: () => {
            // Uygulama verilerini sıfırlama işlemi
            Alert.alert("Uygulama sıfırlandı.");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* Tema Ayarı */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Karanlık Mod</Text>
        <Switch
          onValueChange={handleDarkModeToggle}
          value={isDarkMode}
        />
      </View>

      {/* Para Birimi Ayarı */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Para Birimi</Text>
        <View style={styles.optionsContainer}>
          {['TRY', 'USD', 'EUR'].map((currency) => (
            <TouchableOpacity
              key={currency}
              style={[
                styles.optionButton,
                selectedCurrency === currency && styles.selectedOption,
              ]}
              onPress={() => handleCurrencyChange(currency)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedCurrency === currency && styles.selectedOptionText,
                ]}
              >
                {currency}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dil Ayarı */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dil</Text>
        <View style={styles.optionsContainer}>
          {['Türkçe', 'English'].map((language) => (
            <TouchableOpacity
              key={language}
              style={[
                styles.optionButton,
                selectedLanguage === language && styles.selectedOption,
              ]}
              onPress={() => handleLanguageChange(language)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedLanguage === language && styles.selectedOptionText,
                ]}
              >
                {language}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Uygulamayı Sıfırla */}
      <TouchableOpacity style={styles.resetButton} onPress={handleResetApp}>
        <Text style={styles.resetButtonText}>Uygulamayı Sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
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
    marginBottom: 20,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  settingText: {
    fontSize: 18,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionButton: {
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    backgroundColor: '#00adf5',
    borderColor: '#00adf5',
  },
  selectedOptionText: {
    color: '#fff',
  },
  resetButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
