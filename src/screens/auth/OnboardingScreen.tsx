import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import OnboardingLogo from '../../assets/images/OnboardingLogo.svg'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Onboarding Screen</Text>
      <OnboardingLogo />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
})