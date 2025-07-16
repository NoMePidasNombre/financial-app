// ...existing code...
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Platform, Alert } from 'react-native';
import AppContent from './AppContent';
import GoalsScreen from './GoalsScreen';
import TransactionHistoryScreen from './components/TransactionHistoryScreen';
import IngresoModal from './components/IngresoModal';
import TransactionEditModal from './components/TransactionEditModal';
import BottomMenu from './BottomMenu';
import TopMenu from './TopMenu';

const Stack = createStackNavigator();

export default function MainApp() {
  const [goals, setGoals] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [editData, setEditData] = React.useState(null);

  // Estado para mostrar el modal de transacción y el tipo elegido
  const [showTransactionModal, setShowTransactionModal] = React.useState(false);
  const [selectedTipo, setSelectedTipo] = React.useState<'ingreso' | 'gasto'>('ingreso');

  // Estado para mostrar el modal de edición
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  // Handler para el botón +
  const handleAddPress = () => {
    setSelectedTipo('ingreso'); // Siempre abrir como ingreso
    setShowTransactionModal(true); // Abrir directamente el modal de transacción
  };

  // Handler para cerrar ambos modals
  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTipo('ingreso');
  };




  // Handler para el botón historial
  const navigationRef = React.useRef<any>(null);
  // Estado para ocultar el menu específicamente
  const [hideBottomMenu, setHideBottomMenu] = React.useState(false);
  const [hideTopMenu, setHideTopMenu] = React.useState(false);

  // Handler para el TopMenu
  const handleTopMenuPress = (idx: number) => {
    if (idx === 2) { // Historia
      setHideBottomMenu(true);
      setHideTopMenu(true);
      navigationRef.current?.navigate('TransactionHistory');
    }
    // Agregar más funcionalidades según sea necesario
  };

  const handleHistoryPress = () => {
    // Ocultar menu inmediatamente
    setHideBottomMenu(true);
    setHideTopMenu(true);
    // Limpiar cualquier modal de edición global antes de navegar
    setShowEditModal(false);
    setEditIndex(null);
    setEditData(null);
    if (navigationRef.current) {
      navigationRef.current.navigate('TransactionHistory');
    }
  };

  // Forzar re-render al cambiar de ruta para que el BottomMenu desaparezca inmediatamente
// ...existing code...

  // Escuchar cambios de navegación para mostrar/ocultar el menu
  React.useEffect(() => {
    const nav = navigationRef.current;
    if (!nav || !nav.addListener) return;
    
    const updateMenuVisibility = () => {
      const route = nav.getCurrentRoute?.();
      if (route && route.name) {
        console.log('Current route:', route.name);
        setHideBottomMenu(route.name === 'TransactionHistory');
      }
    };
    
    updateMenuVisibility();
    const unsubscribe = nav.addListener('state', updateMenuVisibility);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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

  function handleBottomMenuPress(idx: number) {
    if (idx === 0) {
      setActiveTab(0);
      setHideBottomMenu(false); // Mostrar menu en Home
      setHideTopMenu(false); // Mostrar top menu en Home
      navigationRef.current?.navigate('Home');
    } else if (idx === 1) {
      setActiveTab(1);
      setHideBottomMenu(false); // Mostrar menu en Goals
      setHideTopMenu(false); // Mostrar top menu en Goals
      navigationRef.current?.navigate('Goals');
    } else if (idx === 2) {
      // Abrir directamente el modal de nueva transacción (ingreso)
      setSelectedTipo('ingreso');
      setShowTransactionModal(true);
    } else if (idx === 3) {
      setActiveTab(3);
      setHideBottomMenu(false); // Mostrar menu en Stats
      navigationRef.current?.navigate('Stats');
    } else if (idx === 4) {
      // Botón del ábaco: no hacer nada por ahora, funcionalidad futura
    }
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          id={undefined}
          initialRouteName="Home"
          screenOptions={({ route, navigation }) => ({
            headerShown: false,
            cardStyleInterpolator: (props) => {
              const { current, layouts, next, inverted, closing, index } = props;
              // Si estamos yendo a Home desde Goals, animar desde la izquierda
              if (route.name === 'Home' && navigation.getState().routes[navigation.getState().index - 1]?.name === 'Goals') {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              }
              // Por defecto, animación horizontal iOS
              return CardStyleInterpolators.forHorizontalIOS(props);
            },
            gestureEnabled: true,
          })}
        >
          <Stack.Screen name="Home">
            {props => (
              <AppContent
                {...props}
                saldo={saldo}
                gastos={gastos}
                onAddPress={handleAddPress}
                onHistoryPress={handleHistoryPress}
                goals={goals}
                onGoalsPress={() => navigationRef.current?.navigate('Goals')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Goals">
            {props => (
              <GoalsScreen goals={goals} setGoals={setGoals} navigation={props.navigation} />
            )}
          </Stack.Screen>
          <Stack.Screen name="TransactionHistory">
            {props => (
              <TransactionHistoryScreen
                {...props}
                transactions={transactions}
                onClose={() => {
                  setHideBottomMenu(false); // Mostrar menu al salir del historial
                  setHideTopMenu(false); // Mostrar top menu al salir del historial
                  props.navigation.goBack();
                }}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
        {!hideTopMenu && (
          <TopMenu onPress={handleTopMenuPress} />
        )}
        {!hideBottomMenu && (
          <BottomMenu onPress={handleBottomMenuPress} activeIndex={activeTab} />
        )}
        {/* Modals globales */}
        {showTransactionModal && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}>
            <IngresoModal
              visible={showTransactionModal}
              initialTipo={selectedTipo}
              onClose={handleCloseTransactionModal}
              onAccept={(monto, categoria, medio, tipo) => {
                const now = new Date();
                const fecha = now.toLocaleDateString('es-AR');
                const hora = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
                setTransactions([
                  ...transactions,
                  { monto, categoria, medio, tipo, fecha, hora },
                ]);
                setShowTransactionModal(false);
                setSelectedTipo('ingreso');
              }}
            />
          </View>
        )}
        {showEditModal && (
          <View style={{
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
          </View>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
