/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  // Datos de ejemplo
  const saldo = 1000.0;
  const gastos = 10000.0;
  const usuario = 'USER123';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2a36',
    alignItems: 'center',
    paddingTop: 40,
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
});

export default App;
