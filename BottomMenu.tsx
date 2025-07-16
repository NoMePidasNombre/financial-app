import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = {
  home: require('./assets/icons/home.png'),
  goals: require('./assets/icons/goals.png'),
  plus: require('./assets/icons/plus.png'),
  stats: require('./assets/icons/graphs.png'),
  list: require('./assets/icons/calculate.png'),
};

const bottomIcons = [
  { icon: ICONS.home, key: 'home' },
  { icon: ICONS.goals, key: 'goals' },
  { icon: ICONS.plus, key: 'plus' },
  { icon: ICONS.stats, key: 'stats' },
  { icon: ICONS.list, key: 'list' },
];

export default function BottomMenu({ onPress, activeIndex }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomMenu, { paddingBottom: insets.bottom }]}> 
      {bottomIcons.map((item, idx) => (
        <TouchableOpacity
          key={item.key}
          style={idx === 2 ? styles.centerBtn : styles.bottomIconBtn}
          onPress={() => onPress(idx)}
        >
          <Image source={item.icon} style={idx === 2 ? styles.centerIcon : [styles.bottomIcon, activeIndex === idx && styles.activeIcon]} resizeMode="contain" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomMenu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26,35,77,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#232c5c',
    zIndex: 10,
  },
  bottomIconBtn: {
    flex: 1,
    alignItems: 'center',
  },
  bottomIcon: {
    width: 32,
    height: 32,
    tintColor: '#fff',
  },
  activeIcon: {
    tintColor: '#00e6a0',
  },
  centerBtn: {
    backgroundColor: '#fff',
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  centerIcon: {
    width: 36,
    height: 36,
    tintColor: '#1a234d',
  },
});
