import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import WalletScreen from '../screens/tabBarScreens/WalletScreen'

const Stack = createStackNavigator()

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Wallet" component={WalletScreen} /> 
    </Stack.Navigator>
  )
}
