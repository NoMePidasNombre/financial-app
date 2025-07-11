
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopMenu from './components/TopMenu';
import Menu from './components/Menu';
import WelcomeMessage from './components/WelcomeMessage';
import GoalsCard from './components/GoalsCard';
import TransactionModal from './components/TransactionModal';
import TransactionHistoryModal from './components/TransactionHistoryModal';

const { width, height } = Dimensions.get('window');

import { useState } from 'react';
import { TextInput, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  // Estado de datos mensuales
  const [saldo, setSaldo] = useState(12500.75);
  const [gastos, setGastos] = useState(3200.50);
  const [modalVisible, setModalVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Manejar aceptar transacción
  const handleAceptar = (monto: number, categoria: string, medio: string, tipo: 'ingreso' | 'gasto') => {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-AR');
    const hora = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
    setTransactions(prev => [
      { tipo, categoria, medio, monto, fecha, hora },
      ...prev,
    ]);
    if (tipo === 'ingreso') {
      setSaldo(prev => prev + monto);
    } else {
      setSaldo(prev => prev - monto);
      setGastos(prev => prev + monto);
    }
    setModalVisible(false);
  };

  // Manejar cerrar modal
  const handleCerrar = () => {
    setModalVisible(false);
    setHistoryVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TopMenu styles={styles} onHistory={() => setHistoryVisible(true)} />
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
        <View style={styles.welcomeMessageContainer}>
          <WelcomeMessage styles={styles} />
        </View>
        <View style={[styles.card, { marginBottom: height * 0.04 }]}> 
          <Text style={[styles.titulo, { textAlign: 'center' }]}>Datos Mensuales</Text>
          <Text style={styles.label}>Saldo:</Text>
          <Text style={styles.saldo}>${saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
          <Text style={styles.label}>Gastos:</Text>
          <Text style={styles.gastos}>${gastos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
        </View>
        <GoalsCard styles={styles} />
      </ScrollView>
      <Menu styles={styles} />
      <TouchableOpacity style={styles.centralButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.centralIcon}>➕</Text>
      </TouchableOpacity>
      <TransactionModal
        visible={modalVisible}
        onClose={handleCerrar}
        onAccept={handleAceptar}
        styles={{ ...styles, customModal: { ...styles.customModal, top: height * 0.15, bottom: height * 0.12, left: width * 0.1, right: width * 0.1 } }}
        isDarkMode={isDarkMode}
      />
      <TransactionHistoryModal
        visible={historyVisible}
        onClose={handleCerrar}
        styles={{ ...styles, customModal: { ...styles.customModal, top: height * 0.15, bottom: height * 0.12, left: width * 0.1, right: width * 0.1 } }}
        isDarkMode={isDarkMode}
        transactions={transactions}
      />
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
  input: {
    backgroundColor: '#222B3A',
    color: '#fff',
    borderRadius: 10,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.045,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: '#0FFFFF',
    width: '100%',
    minHeight: 40,
    justifyContent: 'center',
  },
  modalLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: 2,
    marginTop: height * 0.01,
    alignSelf: 'flex-start',
  },
  dropdownMenu: {
    // (Deprecated, replaced by dropdownMenuRelative)
  },
  dropdownMenuRelative: {
    // (Deprecated, replaced by dropdownMenuAbsolute)
  },
  dropdownMenuAbsolute: {
    backgroundColor: '#222B3A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0FFFFF',
    width: '100%',
    zIndex: 999,
    position: 'absolute',
    top: '100%',
    left: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dropdownItem: {
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.04,
  },
  dropdownText: {
    color: '#fff',
    fontSize: width * 0.045,
  },
  tipoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: height * 0.015,
  },
  tipoButton: {
    flex: 1,
    paddingVertical: height * 0.014,
    marginHorizontal: width * 0.01,
    borderRadius: 10,
    alignItems: 'center',
  },
  tipoIngreso: {
    backgroundColor: '#27ae60',
  },
  tipoGasto: {
    backgroundColor: '#e74c3c',
  },
  tipoUnselected: {
    backgroundColor: '#222B3A',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  tipoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.02,
  },
  modalAcceptButton: {
    backgroundColor: '#0FFFFF',
    borderRadius: 16,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.08,
    alignItems: 'center',
    marginLeft: width * 0.04,
  },
  modalAcceptText: {
    color: '#141F52',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  // Modal overlay y blur
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  customModal: {
    position: 'absolute',
    backgroundColor: '#1A2A3AEE', // semi-transparente
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.06,
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  modalText: {
    fontSize: width * 0.045,
    color: '#fff',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#0FFFFF',
    borderRadius: 16,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.08,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#141F52',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
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
  historyButton: {
    padding: width * 0.02,
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
  },
  historyIcon: {
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
