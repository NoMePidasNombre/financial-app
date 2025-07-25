import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen({ route, navigation }) {
    // Usar navigation.addListener para actualizar cuando cambian las props
    const [transactions, setTransactions] = React.useState(route.params?.transactions || []);
    React.useEffect(() => {
        setTransactions(route.params?.transactions || []);
    }, [route.params?.transactions]);

    const { onDelete, onEdit } = route.params || {};

    const handleDelete = (idx) => {
        Alert.alert('Eliminar', '¿Seguro que deseas eliminar esta transacción?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => onDelete && onDelete(idx) },
        ]);
    };

    const handleEdit = (idx, tx) => {
        navigation.navigate('AddTransaction', { tx, idx, onEdit });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <TouchableOpacity onPress={() => route.params?.onClose ? route.params.onClose() : navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Volver</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { flex: 1 }]}>Historial de Transacciones</Text>
            </View>
            <FlatList
                data={transactions}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.item}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.nombre}>{item.nombre}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => handleEdit(index, item)} style={styles.editBtn}>
                                    <Text style={styles.editBtnText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteBtn}>
                                    <Text style={styles.deleteBtnText}>Borrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={[styles.monto, { color: item.monto > 0 ? '#00b894' : '#e74c3c' }]}>${item.monto.toFixed(2)}</Text>
                        {item.categoria && <Text style={styles.categoria}>{item.categoria}</Text>}
                        <Text style={styles.fuente}>{item.fuente}</Text>
                        <Text style={styles.fecha}>{new Date(item.fecha).toLocaleString('es-AR')}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ color: '#fff', textAlign: 'center', marginTop: 32 }}>No hay transacciones</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a2a36', padding: 16 },
    title: { color: '#fff', fontSize: 22, textAlign: 'center' },
    item: { backgroundColor: '#1a234d', borderRadius: 8, padding: 12, marginBottom: 12 },
    nombre: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    monto: { fontSize: 16, fontWeight: 'bold' },
    categoria: { color: '#00b894', fontSize: 14 },
    fuente: { color: '#fff', fontSize: 14 },
    fecha: { color: '#aaa', fontSize: 12 },
    editBtn: { marginRight: 12, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#00b894', borderRadius: 6 },
    editBtnText: { color: '#fff', fontWeight: 'bold' },
    deleteBtn: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#e74c3c', borderRadius: 6 },
    deleteBtnText: { color: '#fff', fontWeight: 'bold' },
    backBtn: { backgroundColor: '#232c5c', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, marginRight: 12 },
    backBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
