import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const categorias = ['Comida', 'Salida', 'Deporte', 'Juntada', 'Compra'];
const fuentes = ['Efectivo', 'Banco', 'Billetera virtual'];

export default function AddTransactionScreen({ navigation, route }) {
    const [monto, setMonto] = useState('');
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState(categorias[0]);
    const [fuente, setFuente] = useState(fuentes[0]);
    const [tipo, setTipo] = useState('add'); // 'add' o 'remove'

    const handleAdd = () => {
        if (!monto || !nombre) return;
        route.params?.onAdd({
            monto: parseFloat(monto) * (tipo === 'remove' ? -1 : 1),
            nombre,
            categoria: tipo === 'remove' ? categoria : null,
            fuente,
            fecha: new Date().toISOString(),
        });
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Añadir/Quitar Transacción</Text>
            <View style={styles.switchRow}>
                <TouchableOpacity style={[styles.switchBtn, tipo === 'add' && styles.activeBtn]} onPress={() => setTipo('add')}><Text style={styles.switchText}>Añadir</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.switchBtn, tipo === 'remove' && styles.activeBtn]} onPress={() => setTipo('remove')}><Text style={styles.switchText}>Quitar</Text></TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Monto" keyboardType="numeric" value={monto} onChangeText={setMonto} />
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            {tipo === 'remove' && (
                <Picker selectedValue={categoria} style={styles.input} onValueChange={setCategoria}>
                    {categorias.map(c => (<Picker.Item key={c} label={c} value={c} />))}
                </Picker>
            )}
            <Picker selectedValue={fuente} style={styles.input} onValueChange={setFuente}>
                {fuentes.map(f => (<Picker.Item key={f} label={f} value={f} />))}
            </Picker>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={styles.addBtnText}>Guardar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a2a36', padding: 24 },
    title: { color: '#fff', fontSize: 22, marginBottom: 16, textAlign: 'center' },
    input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 },
    addBtn: { backgroundColor: '#1a234d', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 16 },
    addBtnText: { color: '#fff', fontSize: 18 },
    switchRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
    switchBtn: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#232c5c', borderRadius: 8, marginHorizontal: 4 },
    activeBtn: { backgroundColor: '#00b894' },
    switchText: { color: '#fff', fontWeight: 'bold' },
});
