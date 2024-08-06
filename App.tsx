import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './src/navigator/MainTabNavigator';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}

export default App;
