import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import AppContent from './AppContent';
import TransactionHistoryScreen from './components/TransactionHistoryScreen';
import IngresoModal from './components/IngresoModal';
import GastoModal from './components/GastoModal';
import TipoTransaccionModal from './components/TipoTransaccionModal';
import TransactionEditModal from './components/TransactionEditModal';

const Stack = createStackNavigator();

export default function MainApp() {
  const [transactions, setTransactions] = React.useState([]);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [editData, setEditData] = React.useState(null);

  // Estado para mostrar el modal de selección de tipo y el tipo elegido
  const [showTipoModal, setShowTipoModal] = React.useState(false);
  const [showTransactionModal, setShowTransactionModal] = React.useState(false);
  const [selectedTipo, setSelectedTipo] = React.useState<'ingreso' | 'gasto'>('ingreso');

  // Estado para mostrar el modal de edición
  const [showEditModal, setShowEditModal] = React.useState(false);

  // Handler para el botón +
  const handleAddPress = () => setShowTipoModal(true);

  // Handler para seleccionar tipo
  const handleTipoSelect = (tipo: 'ingreso' | 'gasto') => {
    setSelectedTipo(tipo);
    setShowTipoModal(false);
    setTimeout(() => setShowTransactionModal(true), 200); // Pequeña pausa para transición
  };

  // Handler para cerrar ambos modals
  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTipo('ingreso');
  };

  // Handler para el botón historial
  const navigationRef = React.useRef<any>(null);
  const handleHistoryPress = () => {
    // Limpiar cualquier modal de edición global antes de navegar
    setShowEditModal(false);
    setEditIndex(null);
    setEditData(null);
    if (navigationRef.current) {
      navigationRef.current.navigate('TransactionHistory');
    }
  };

  // Calcular saldo y gastos
  const saldo = transactions.reduce((acc, t) => t.tipo === 'ingreso' ? acc + t.monto : acc - t.monto, 0);
  const gastos = transactions.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + t.monto, 0);

  // Para pasar el setter a AppContent
  const handleSetTransactions = (txs: any[]) => setTransactions(txs);

  // Editar transacción: maneja edición tanto en Home como en historial
  const handleEditTransaction = (index: number, data: any) => {
    const currentRoute = navigationRef.current?.getCurrentRoute?.()?.name;
    if (currentRoute === 'Home') {
      setEditIndex(index);
      setEditData(data);
      setShowEditModal(true);
    } else if (currentRoute === 'TransactionHistory') {
      // Edición desde historial: actualizar directamente el array global
      setTransactions(prev => {
        if (index < 0 || index >= prev.length) return prev;
        return prev.map((tx, i) =>
          i === index ? { ...tx, ...data } : tx
        );
      });
    }
  };

  // Guardar edición
  const handleAcceptEdit = (monto: number, categoria: string, medio: string, tipo: 'ingreso' | 'gasto') => {
    if (editIndex !== null) {
      setTransactions(prev => {
        if (editIndex < 0 || editIndex >= prev.length) return prev;
        // Usar los datos recibidos desde el historial
        return prev.map((tx, i) =>
          i === editIndex ? { ...tx, monto, categoria, medio, tipo } : tx
        );
      });
    }
    setShowEditModal(false);
    setEditIndex(null);
    setEditData(null);
  };

  // Borrar transacción
  const handleDeleteTransaction = (index: number) => {
    const tx = transactions[index];
    const newTxs = [...transactions];
    newTxs.splice(index, 1);
    setTransactions(newTxs);
  };

  // Limpiar edición después de guardar/cancelar
  const clearEdit = () => {
    setEditIndex(null);
    setEditData(null);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          id={undefined}
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="Home"
            children={(props) => (
              <>
                <AppContent
                  {...props}
                  saldo={saldo}
                  gastos={gastos}
                  onAddPress={handleAddPress}
                  onHistoryPress={handleHistoryPress}
                />
                {/* Modal de selección de tipo */}
                <TipoTransaccionModal
                  visible={showTipoModal}
                  onSelect={handleTipoSelect}
                  onClose={() => setShowTipoModal(false)}
                />
                {/* Modal de transacción */}
                {showTransactionModal && (
                  <SafeAreaView style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                  }}>
                    {selectedTipo === 'ingreso' ? (
                      <IngresoModal
                        visible={showTransactionModal}
                        onClose={handleCloseTransactionModal}
                        onAccept={(monto, categoria, medio) => {
                          const now = new Date();
                          const fecha = now.toLocaleDateString('es-AR');
                          const hora = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
                          setTransactions([
                            ...transactions,
                            { monto, categoria, medio, tipo: 'ingreso', fecha, hora },
                          ]);
                          setShowTransactionModal(false);
                          setSelectedTipo('ingreso');
                        }}
                      />
                    ) : (
                      <GastoModal
                        visible={showTransactionModal}
                        onClose={handleCloseTransactionModal}
                        onAccept={(monto, categoria, medio) => {
                          const now = new Date();
                          const fecha = now.toLocaleDateString('es-AR');
                          const hora = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
                          setTransactions([
                            ...transactions,
                            { monto, categoria, medio, tipo: 'gasto', fecha, hora },
                          ]);
                          setShowTransactionModal(false);
                          setSelectedTipo('ingreso');
                        }}
                      />
                    )}
                  </SafeAreaView>
                )}
                {/* Modal de edición de transacción */}
                {showEditModal && (
                  <SafeAreaView style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                  }}>
                    <TransactionEditModal
                      visible={showEditModal}
                      onClose={() => { setShowEditModal(false); setEditIndex(null); setEditData(null); }}
                      onAccept={handleAcceptEdit}
                      styles={{}}
                      isDarkMode={false}
                      initialData={editData}
                      editMode={true}
                    />
                  </SafeAreaView>
                )}
              </>
            )}
          />
          <Stack.Screen
            name="TransactionHistory"
            children={(props) => (
              <TransactionHistoryScreen
                {...props}
                transactions={transactions}
                onClose={() => props.navigation.goBack()}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
