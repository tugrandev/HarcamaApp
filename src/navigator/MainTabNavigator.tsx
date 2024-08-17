import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import WalletScreen from '../screens/tabBarScreens/WalletScreen';
import StatsScreen from '../screens/tabBarScreens/StatsScreen';
import CalendarScreen from '../screens/tabBarScreens/CalendarScreen';
import SettingsScreen from '../screens/tabBarScreens/SettingsScreen';
import AddScreen from '../screens/tabBarScreens/AddScreen';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (route, focused) => {
  let iconName;
  let iconSize = 27;
  let IconComponent = Ionicons;

  if (route.name === 'Cüzdan') {
    iconName = focused ? 'wallet-outline' : 'wallet-outline';
    IconComponent = Ionicons;
  } else if (route.name === 'İstatistikler') {
    iconName = focused ? 'barschart' : 'barschart';
    IconComponent = AntDesign;
  } else if (route.name === 'Ekle') {
    iconName = focused ? 'pluscircleo' : 'pluscircleo';
    iconSize = 29;
    IconComponent = AntDesign;
  } else if (route.name === 'Takvim') {
    iconName = focused ? 'calendar-clear-outline' : 'calendar-clear-outline';
    IconComponent = Ionicons;
  } else if (route.name === 'Ayarlar') {
    iconName = focused ? 'setting' : 'setting';
    IconComponent = AntDesign;
  }

  return <IconComponent name={iconName} size={iconSize} color={focused ? colors.blue : colors.grey} />;
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabBarIcon(route, focused),
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.grey,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Cüzdan" component={WalletScreen} options={{ headerShown: false }} />
      <Tab.Screen name="İstatistikler" component={StatsScreen} options={{ headerTitle: 'İstatistikler' }} />
      <Tab.Screen
        name="Ekle"
        component={AddScreen}
        options={({ navigation }) => ({
          headerTitle: 'Ekle',
          headerStyle: {
            backgroundColor: colors.blue,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // Kaydet butonuna tıklandığında save parametresi ile birlikte Ekle ekranını tetikle
                navigation.navigate('Ekle', { save: true });
              }}
              style={{ marginRight: 10 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kaydet</Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Tab.Screen name="Takvim" component={CalendarScreen} options={{ headerTitle: 'Takvim' }} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} options={{ headerTitle: 'Ayarlar' }} />
    </Tab.Navigator>
  );
}
