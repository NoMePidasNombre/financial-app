/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

function TopMenu() {
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
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>⟳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Menu() {
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

function WelcomeMessage() {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>¡BIENVENIDO USER123!</Text>
    </View>
  );
}

// Ajustar el orden de los elementos en las metas
function GoalsCard() {
  return (
    <View style={styles.card}>
      <Text style={[styles.titulo, { textAlign: 'center' }]}>Metas</Text>
      <View style={styles.goalRowContainer}>
        <View style={styles.goalRow}>
          <Text style={styles.goalIcon}>🐖</Text>
          <Text style={styles.goalText}>Inversión</Text>
          <View style={styles.goalProgressBarBackground}>
            <View style={[styles.goalProgressBar, { width: '75%' }]} />
          </View>
        </View>
        <Text style={styles.goalProgressValue}>75000/100000</Text>
      </View>
      <View style={styles.goalRowContainer}>
        <View style={styles.goalRow}>
          <Text style={styles.goalIcon}>🏖️</Text>
          <Text style={styles.goalText}>Vacaciones</Text>
          <View style={styles.goalProgressBarBackground}>
            <View style={[styles.goalProgressBar, { width: '50%' }]} />
          </View>
        </View>
        <Text style={styles.goalProgressValue}>50000/100000</Text>
      </View>
    </View>
  );
}

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  // Datos de ejemplo
  const saldo = 12500.75;
  const gastos = 3200.50;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TopMenu />
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
        <View style={styles.welcomeMessageContainer}> {/* Agregar un contenedor para ajustar la posición */}
          <WelcomeMessage />
        </View>
        <View style={[styles.card, { marginBottom: height * 0.04 }]}>
          <Text style={[styles.titulo, { textAlign: 'center' }]}>Datos Mensuales</Text>
          <Text style={styles.label}>Saldo:</Text>
          <Text style={styles.saldo}>${saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
          <Text style={styles.label}>Gastos:</Text>
          <Text style={styles.gastos}>${gastos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
        </View>
        <GoalsCard />
      </ScrollView>
      <Menu />
      <TouchableOpacity style={styles.centralButton}>
        <Text style={styles.centralIcon}>➕</Text>
      </TouchableOpacity>
    </View>
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
  scrollView: {
    marginTop: height * 0.14, // Ajustar el inicio del ScrollView para que comience completamente alineado con el tamaño del menú superior
  },
  scrollContainer: {
    paddingBottom: height * 0.1, // Asegurar espacio para el menú inferior
    justifyContent: 'center', // Centrar el contenido
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#022B3A',
  },
  card: {
    backgroundColor: '#141F52',
    borderRadius: 16,
    padding: width * 0.08,
    color: '#FFFFFF',
    width: width * 0.9,
  },
  titulo: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: '#FFFFFF',
  },
  label: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    marginTop: height * 0.01,
  },
  saldo: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: height * 0.01,
  },
  gastos: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#141F52',
    paddingVertical: height * 0.02,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  menuGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.3,
  },
  menuButton: {
    padding: width * 0.02,
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
  },
  centralButton: {
    padding: width * 0.06,
    borderRadius: width * 0.15,
    backgroundColor: '#0FFFFF',
    position: 'absolute',
    bottom: height * 0.03,
    alignSelf: 'center',
  },
  centralIcon: {
    color: '#FFFFFF',
    fontSize: width * 0.09,
  },
  topMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#141F52',
    padding: height * 0.02,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  rightMenuGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.3,
  },
  welcomeMessage: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: height * 0.02,
  },
  welcomeContainer: {
    marginTop: height * 0.01, // Reducir margen superior
    marginBottom: height * 0.04,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  welcomeHeader: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: height * 0.03,
  },
  // Estilos para el recuadro de metas
  goalRowContainer: {
    marginVertical: height * 0.01,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02, // Incrementar la separación vertical entre las líneas
  },
  goalIcon: {
    fontSize: width * 0.08,
    marginRight: width * 0.01, // Incrementar la separación horizontal entre el icono y el texto
  },
  goalText: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    flexShrink: 1, // Permitir que el texto se ajuste al espacio disponible
  },
  goalProgressBarBackground: {
    width: '57%',
    height: height * 0.008,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginLeft: width * 0.01, // Incrementar la separación horizontal entre el texto y la barra de progreso
  },
  goalProgressBar: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 4,
  },
  goalProgressValue: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: height * 0.005,
    position: 'absolute', // Posicionar el texto sobre la barra
    top: -height * 0.001, // Ajustar la posición vertical
    left: '65%', // Centrar horizontalmente
    transform: [{ translateX: -width * 0.1 }], // Ajustar para centrar correctamente
  },
  welcomeMessageContainer: {
    marginTop: height * 0.04, // Mover WelcomeMessage más abajo
  },
});
