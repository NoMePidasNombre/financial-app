import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppContent from './AppContent';
import TransactionHistoryScreen from './components/TransactionHistoryScreen';

const Stack = createStackNavigator();

export default function MainApp() {
  const [transactions, setTransactions] = React.useState([]);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [editData, setEditData] = React.useState(null);

  // Para pasar el setter a AppContent
  const handleSetTransactions = (txs: any[]) => setTransactions(txs);

  // Editar transacción: abre modal en Home con datos
  const handleEditTransaction = (index: number, data: any) => {
    setEditIndex(index);
    setEditData(data);
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
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="Home">
            {props => (
              <AppContent
                {...props}
                transactions={transactions}
                setTransactions={handleSetTransactions}
                editIndex={editIndex}
                editData={editData}
                clearEdit={clearEdit}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="TransactionHistory">
            {props => (
              <TransactionHistoryScreen
                {...props}
                transactions={transactions}
                onClose={() => props.navigation.goBack()}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
