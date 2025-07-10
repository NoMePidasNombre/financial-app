/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity } from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  // Datos de ejemplo
  const saldo = 12500.75;
  const gastos = 3200.50;

  const TopMenu = () => (
    <View style={styles.topMenuContainer}>
      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <View style={styles.rightMenuGroup}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>⟳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const Menu = () => (
    <View style={styles.menuContainer}>
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TopMenu />
      <View style={styles.card}>
        <Text style={styles.titulo}>Resumen financiero</Text>
        <Text style={styles.label}>Saldo:</Text>
        <Text style={styles.saldo}>${saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
        <Text style={styles.label}>Gastos:</Text>
        <Text style={styles.gastos}>${gastos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
      </View>
      <Menu />
      <TouchableOpacity style={styles.centralButton}>
        <Text style={styles.centralIcon}>➕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#022B3A',
  },
  card: {
    backgroundColor: '#141F52',
    borderRadius: 16,
    padding: 32,
    color: '#FFFFFF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
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
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#141F52',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  menuGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 112,
  },
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  centralButton: {
    padding: 25,
    borderRadius: 50,
    backgroundColor: '#0FFFFF',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  centralIcon: {
    color: '#FFFFFF',
    fontSize: 36,
  },
  topMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#141F52',
    padding: 10,
    position: 'absolute',
    top: 40,
    width: '100%',
  },
  rightMenuGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
});

export default App;
