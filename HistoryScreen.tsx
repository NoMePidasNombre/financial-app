import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen({ route }) {
    const { transactions = [] } = route.params || {};
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Historial de Transacciones</Text>
            <FlatList
                data={transactions}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.nombre}>{item.nombre}</Text>
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
    title: { color: '#fff', fontSize: 22, marginBottom: 16, textAlign: 'center' },
    item: { backgroundColor: '#1a234d', borderRadius: 8, padding: 12, marginBottom: 12 },
    nombre: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    monto: { fontSize: 16, fontWeight: 'bold' },
    categoria: { color: '#00b894', fontSize: 14 },
    fuente: { color: '#fff', fontSize: 14 },
    fecha: { color: '#aaa', fontSize: 12 },
});
