/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  // Datos de ejemplo
  const saldo = 1000.0;
  const gastos = 10000.0;
  const usuario = 'USER123';

  // Iconos para menú superior e inferior (rutas corregidas)
  const topIcons = [
    require('./assets/icons/image 5.png'), // engranaje
    require('./assets/icons/image 9.png'), // campana
    require('./assets/icons/image 3.png'), // reloj
    require('./assets/icons/image 8.png'), // usuario
  ];
  const bottomIcons = [
    require('./assets/icons/image 2.png'), // home
    require('./assets/icons/image 6.png'), // trofeo
    require('./assets/icons/image 4.png'), // más (centro)
    require('./assets/icons/image 10.png'), // estadisticas
    require('./assets/icons/contando 1.png'), // lista
  ];

  return (
    <SafeAreaView style={styles.safeAreaBg}>
      {/* Menú superior fijo */}
      <View style={[styles.topMenu, { paddingTop: insets.top }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {topIcons.map((icon, idx) => (
          <TouchableOpacity key={idx} style={styles.topIconBtn}>
            <Image source={icon} style={styles.topIcon} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </View>
      {/* Contenido principal */}
      <View style={[styles.content, { paddingTop: 70 + insets.top, paddingBottom: 80 + insets.bottom }]}>
        <Text style={styles.bienvenida}>BIENVENIDO {usuario}</Text>
        <View style={styles.cardDatos}>
          <Text style={styles.tituloCard}>Datos Mensuales</Text>
          <View style={styles.filaDatos}>
            <Text style={styles.labelDatos}>Dinero disponible</Text>
            <Text style={styles.saldoDatos}>${saldo.toLocaleString('es-AR', { minimumFractionDigits: 3 })}</Text>
          </View>
          <View style={styles.filaDatos}>
            <Text style={styles.labelDatos}>Gastos</Text>
            <Text style={styles.gastosDatos}>${gastos.toLocaleString('es-AR', { minimumFractionDigits: 3 })}</Text>
          </View>
        </View>
        <View style={styles.cardMetas}>
          <Text style={styles.tituloCard}>METAS</Text>
          <View style={styles.metaBox} />
          <View style={styles.metaBox} />
        </View>
      </View>
      {/* Menú inferior fijo */}
      <View style={[styles.bottomMenu, { paddingBottom: insets.bottom }]}>
        {bottomIcons.map((icon, idx) => (
          <TouchableOpacity key={idx} style={idx === 2 ? styles.centerBtn : styles.bottomIconBtn}>
            <Image source={icon} style={idx === 2 ? styles.centerIcon : styles.bottomIcon} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaBg: {
    flex: 1,
    backgroundColor: '#0a2a36',
  },
  topMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#1a234d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#232c5c',
    zIndex: 10,
  },
  topIconBtn: {
    marginLeft: 18,
  },
  topIcon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  bienvenida: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 24,
    marginTop: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  cardDatos: {
    backgroundColor: '#1a234d',
    borderRadius: 12,
    padding: 18,
    marginBottom: 32,
    width: '90%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#232c5c',
  },
  tituloCard: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  filaDatos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#232c5c',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    width: '95%',
  },
  labelDatos: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  saldoDatos: {
    color: '#00b894',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gastosDatos: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardMetas: {
    backgroundColor: '#1a234d',
    borderRadius: 12,
    padding: 18,
    width: '90%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#232c5c',
  },
  metaBox: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#232c5c',
    borderRadius: 4,
    height: 40,
    width: '95%',
    marginVertical: 10,
  },
  bottomMenu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a234d',
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
    tintColor: '#fff', // Cambiado a blanco
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
