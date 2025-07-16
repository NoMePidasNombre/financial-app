import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomMenu from './BottomMenu';

const { width, height } = Dimensions.get('window');

const ICONS = {
  settings: require('../assets/icons/settings.png'),
  notifications: require('../assets/icons/notifications.png'),
  history: require('../assets/icons/history.png'),
  profile: require('../assets/icons/profile.png'),
  home: require('../assets/icons/home.png'),
  goals: require('../assets/icons/goals.png'),
  plus: require('../assets/icons/plus.png'),
  stats: require('../assets/icons/graphs.png'),
  list: require('../assets/icons/calculate.png'),
};

const profiles = [
  {
    label: 'Conservador',
    description: [
      'Ideal para un futuro sólido.',
      'Se prioriza el ahorro y la inversión pero menos ocio.'
    ],
  },
  {
    label: 'Equilibrado',
    description: [
      'Balance entre ahorro, inversión y disfrute.',
      'Permite disfrutar del presente sin descuidar el futuro.'
    ],
  },
  {
    label: 'Disfrute Presente',
    description: [
      'Enfocado en experiencias y ocio.',
      'Menor prioridad al ahorro, más gasto en el presente.'
    ],
  },
];

// Definir los nombres de las rutas permitidas
export type RootStackParamList = {
  Home: undefined;
  Goals: undefined;
  TransactionHistory: undefined;
  Stats: undefined;
  ProfileSelection: undefined;
};

export default function ProfileSelectionScreen() {
  // Tipar el hook de navegación
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // Handlers menú inferior
  function handleBottomMenuPress(idx: number) {
    if (idx === 0) navigation.navigate('Home');
    else if (idx === 1) navigation.navigate('Goals');
    else if (idx === 2) {/* abrir modal de transacción si aplica */}
    else if (idx === 3) navigation.navigate('Stats');
    else if (idx === 4) navigation.navigate('TransactionHistory');
  }
  // Handlers menú superior
  function handleTopMenuPress(idx: number) {
    if (idx === 0) {/* settings */}
    else if (idx === 1) {/* notifications */}
    else if (idx === 2) navigation.navigate('TransactionHistory');
    else if (idx === 3) {/* profile */}
  }

  const topIcons = [
    { icon: ICONS.settings, key: 'settings' },
    { icon: ICONS.notifications, key: 'notifications' },
    { icon: ICONS.history, key: 'history' },
    { icon: ICONS.profile, key: 'profile' },
  ];
  const bottomIcons = [
    { icon: ICONS.home, key: 'home' },
    { icon: ICONS.goals, key: 'goals' },
    { icon: ICONS.plus, key: 'plus' },
    { icon: ICONS.stats, key: 'stats' },
    { icon: ICONS.list, key: 'list' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#003049' }}>
      {/* Menú superior */}
      <View style={{ backgroundColor: '#1a2350', paddingTop: insets.top }}>
        <SafeAreaView style={styles.topMenu}> 
          <TouchableOpacity key={topIcons[0].key} style={styles.topIconBtn} onPress={() => handleTopMenuPress(0)}>
            <Image source={topIcons[0].icon} style={styles.topIcon} resizeMode="contain" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          {topIcons.slice(1).map((item, idx) => (
            <TouchableOpacity key={item.key} style={styles.topIconBtn} onPress={() => handleTopMenuPress(idx + 1)}>
              <Image source={item.icon} style={styles.topIcon} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: height * 0.04 }}>
        {profiles.map((p, idx) => (
          <View key={p.label} style={styles.profileBtn}>
            <TouchableOpacity onPress={() => setOpenIdx(openIdx === idx ? null : idx)}>
              <View style={styles.profileRow}>
                <Text style={styles.profileText}>{p.label}</Text>
                <Text style={styles.arrow}>{openIdx === idx ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {openIdx === idx && (
              <View style={styles.detailsBox}>
                {p.description.map((d, i) => (
                  <Text key={i} style={styles.detailText}>• {d}</Text>
                ))}
                <TouchableOpacity style={styles.calcBtn}>
                  <Text style={styles.calcText}>Calcular</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity style={{ marginTop: 18, alignSelf: 'center' }} onPress={() => navigation.navigate('Stats', { autoRedirect: false })}>
          <Text style={{ color: '#468faf', fontSize: 16, textDecorationLine: 'underline' }}>¿Cómo funciona?</Text>
        </TouchableOpacity>
      </View>
      <BottomMenu
        navigation={navigation}
        currentRoute={navigation?.getState?.()?.routes?.[navigation?.getState?.()?.index]?.name}
        onAddPress={undefined}
        onGoalsPress={() => navigation.navigate('Goals')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2350',
    paddingHorizontal: 12,
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: '#232c5c',
    justifyContent: 'flex-start',
  },
  topIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginLeft: 0,
  },
  topIcon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
  profileBtn: {
    backgroundColor: '#468fafbb',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '85%',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  profileText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '500',
  },
  arrow: {
    color: '#fff',
    fontSize: 22,
    marginLeft: 12,
  },
  detailsBox: {
    marginTop: 14,
    marginBottom: 6,
    width: '100%',
  },
  detailText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 2,
  },
  calcBtn: {
    backgroundColor: '#468faf',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 14,
    alignSelf: 'center',
  },
  calcText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomMenu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a2350',
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
