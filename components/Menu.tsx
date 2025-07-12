import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function Menu({ styles }: { styles: any }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.menuContainer, { paddingBottom: insets.bottom }]}> 
      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>🏆</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>📊</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>🛒</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
