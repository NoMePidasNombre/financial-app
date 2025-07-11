import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppContent from './AppContent';
import AddTransactionScreen from './AddTransactionScreen';
import HistoryScreen from './HistoryScreen';

const Stack = createStackNavigator();

export default function MainNavigator() {
    const [transactions, setTransactions] = React.useState([]);

    // Calcular saldo y gastos a partir de las transacciones
    const saldo = transactions.reduce((acc, tx) => acc + tx.monto, 0);
    const gastos = transactions.reduce((acc, tx) => acc + (tx.monto < 0 ? Math.abs(tx.monto) : 0), 0);

    const handleAddTransaction = (tx) => {
        setTransactions((prev) => [tx, ...prev]);
    };

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home">
                    {props => <AppContent {...props} saldo={saldo} gastos={gastos} onAddPress={() => props.navigation.navigate('AddTransaction', { onAdd: handleAddTransaction })} onHistoryPress={() => props.navigation.navigate('History', { transactions })} />}
                </Stack.Screen>
                <Stack.Screen name="AddTransaction">
                    {props => <AddTransactionScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="History">
                    {props => <HistoryScreen {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
