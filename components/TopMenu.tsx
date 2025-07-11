import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Props {
  styles: any;
  onHistory?: () => void;
}

export default function TopMenu({ styles, onHistory }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.topMenuContainer, { paddingTop: insets.top }]}> 
      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <View style={styles.rightMenuGroup}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuButton, styles.historyButton]} onPress={onHistory}>
          <Text style={[styles.menuIcon, styles.historyIcon]}>⟳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
