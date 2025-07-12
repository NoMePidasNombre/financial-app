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

    // Funciones para editar y borrar transacciones
    function handleDeleteTransaction(idx) {
        setTransactions(prev => prev.filter((_, i) => i !== idx));
    }
    function handleEditTransaction(idx, newTx) {
        setTransactions(prev => prev.map((tx, i) => i === idx ? newTx : tx));
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home">
                    {props => <AppContent {...props} saldo={saldo} gastos={gastos} onAddPress={(type) => props.navigation.navigate('AddTransaction', { onAdd: handleAddTransaction, type })} onHistoryPress={() => props.navigation.navigate('History', { transactions, onDelete: handleDeleteTransaction, onEdit: handleEditTransaction })} />}
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
