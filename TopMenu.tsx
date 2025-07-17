import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = {
  settings: require('./assets/icons/settings.png'),
  notifications: require('./assets/icons/notifications.png'),
  history: require('./assets/icons/history.png'),
  profile: require('./assets/icons/profile.png'),
};

const topIcons = [
  { icon: ICONS.settings, key: 'settings' },
  { icon: ICONS.notifications, key: 'notifications' },
  { icon: ICONS.history, key: 'history' },
  { icon: ICONS.profile, key: 'profile' },
];

export default function TopMenu({ onPress }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.topMenu, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      {/* Engranaje a la izquierda */}
      <TouchableOpacity 
        key={topIcons[0].key} 
        style={styles.topIconBtn} 
        onPress={() => onPress(0)}
      >
        <Image source={topIcons[0].icon} style={styles.topIcon} resizeMode="contain" />
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      {/* Otros iconos a la derecha */}
      {topIcons.slice(1).map((item, idx) => (
        <TouchableOpacity 
          key={item.key} 
          style={styles.topIconBtn} 
          onPress={() => onPress(idx + 1)}
        >
          <Image source={item.icon} style={styles.topIcon} resizeMode="contain" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26,35,77,0.95)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#232c5c',
    zIndex: 1000,
  },
  topIconBtn: {
    padding: 8,
    marginHorizontal: 4,
  },
  topIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});
