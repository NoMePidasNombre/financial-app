import React from 'react';
import { View, Text } from 'react-native';

export default function WelcomeMessage({ styles }: { styles: any }) {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>¡BIENVENIDO Tomas!</Text>
    </View>
  );
}
