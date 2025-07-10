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
  const saldo = 12500.75;
  const gastos = 3200.50;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.card}>
        <Text style={styles.titulo}>Resumen financiero</Text>
        <Text style={styles.label}>Saldo:</Text>
        <Text style={styles.saldo}>${saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
        <Text style={styles.label}>Gastos:</Text>
        <Text style={styles.gastos}>${gastos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    width: 320,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  label: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  saldo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  gastos: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
});

export default App;
