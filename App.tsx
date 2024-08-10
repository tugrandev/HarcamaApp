import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './src/navigator/MainTabNavigator';
import { initDB } from './src/database/database'; // Veritabanını import edin
import { View, ActivityIndicator } from 'react-native';

function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDB();
        setDbInitialized(true); // Veritabanı başlatıldıysa, durumu güncelle
      } catch (error) {
        console.error("Error initializing database: ", error);
      }
    };

    initializeDatabase();
  }, []);

  if (!dbInitialized) {
    // Veritabanı başlatılmadıysa, bir yükleniyor animasyonu gösterin
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}

export default App;
