import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WalletScreen from '../screens/tabBarScreens/WalletScreen';
import StatsScreen from '../screens/tabBarScreens/StatsScreen';
import CalendarScreen from '../screens/tabBarScreens/CalendarScreen';
import SettingsScreen from '../screens/tabBarScreens/SettingsScreen';
import AddScreen from '../screens/tabBarScreens/AddScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (route, focused) => {
  let iconName;
  let iconSize = 27;
  let IconComponent = Ionicons; // Varsayılan olarak Ionicons kullan

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
      <Tab.Screen name="Cüzdan" component={WalletScreen} />
      <Tab.Screen name="İstatistikler" component={StatsScreen} />
      <Tab.Screen name="Ekle" component={AddScreen} />
      <Tab.Screen name="Takvim" component={CalendarScreen} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
