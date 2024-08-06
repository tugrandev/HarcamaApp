import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WalletScreen from '../screens/tabBarScreens/WalletScreen';
import StatsScreen from '../screens/tabBarScreens/StatsScreen';
import CalendarScreen from '../screens/tabBarScreens/CalendarScreen';
import SettingsScreen from '../screens/tabBarScreens/SettingsScreen';
import WalletIcon from '../assets/images/icons/tabBarIcons/wallet.svg';
import WalletIconFocused from '../assets/images/icons/tabBarIcons/wallet-focused.svg';
import StatsIcon from '../assets/images/icons/tabBarIcons/stats.svg';
import StatsIconFocused from '../assets/images/icons/tabBarIcons/stats-focused.svg';
import CalendarIcon from '../assets/images/icons/tabBarIcons/calendar.svg';
import CalendarIconFocused from '../assets/images/icons/tabBarIcons/calendar-focused.svg';
import SettingsIcon from '../assets/images/icons/tabBarIcons/settings.svg';
import SettingsIconFocused from '../assets/images/icons/tabBarIcons/settings-focused.svg';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (route, focused) => {
  let IconComponent;

  if (route.name === 'Cüzdan') {
    IconComponent = focused ? WalletIconFocused : WalletIcon;
  } else if (route.name === 'İstatistikler') {
    IconComponent = focused ? StatsIconFocused : StatsIcon;
  } else if (route.name === 'Takvim') {
    IconComponent = focused ? CalendarIconFocused : CalendarIcon;
  } else if (route.name === 'Ayarlar') {
    IconComponent = focused ? SettingsIconFocused : SettingsIcon;
  }

  return <IconComponent width={29} height={29} />;
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabBarIcon(route, focused),
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.grey,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        }
      })}
    >
      <Tab.Screen name="Cüzdan" component={WalletScreen} />
      <Tab.Screen name="İstatistikler" component={StatsScreen} />
      <Tab.Screen name="Takvim" component={CalendarScreen} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
