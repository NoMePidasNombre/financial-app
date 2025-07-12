import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const categorias = ['Comida', 'Salida', 'Deporte', 'Juntada', 'Compra'];
const fuentes = ['Efectivo', 'Banco', 'Billetera virtual'];

export default function AddTransactionScreen({ navigation, route }) {
    // Si es edición, recibimos tx y idx
    const { type = 'add', tx, idx, onAdd, onEdit } = route.params || {};
    const isEdit = !!tx;
    const [monto, setMonto] = useState(isEdit ? Math.abs(tx.monto).toString() : '');
    const [nombre, setNombre] = useState(isEdit ? tx.nombre : '');
    const [categoria, setCategoria] = useState(isEdit && tx.categoria ? tx.categoria : categorias[0]);
    const [fuente, setFuente] = useState(isEdit ? tx.fuente : fuentes[0]);
    const [tipo, setTipo] = useState(isEdit ? (tx.monto > 0 ? 'add' : 'remove') : type);

    const handleSave = () => {
        if (!monto || !nombre) return;
        const newTx = {
            monto: parseFloat(monto) * (tipo === 'remove' ? -1 : 1),
            nombre,
            categoria: tipo === 'remove' ? categoria : null,
            fuente,
            fecha: isEdit ? tx.fecha : new Date().toISOString(),
        };
        if (isEdit && onEdit) {
            onEdit(idx, newTx);
        } else if (onAdd) {
            onAdd(newTx);
        }
        navigation.goBack();
    };

    // Colores dinámicos
    const colorFondo = tipo === 'remove' ? '#e74c3c' : '#00b894';
    const colorBtn = tipo === 'remove' ? '#c0392b' : '#009e6d';

    return (
        <View style={[styles.container, { backgroundColor: colorFondo + '22' }]}>
            <Text style={[styles.title, { color: colorFondo }]}>{isEdit ? 'Editar' : (tipo === 'remove' ? 'Nuevo Gasto' : 'Nuevo Ingreso')}</Text>
            <View style={styles.switchRow}>
                <TouchableOpacity style={[styles.switchBtn, tipo === 'add' && { backgroundColor: '#00b894' }]} onPress={() => setTipo('add')}><Text style={styles.switchText}>Ingreso</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.switchBtn, tipo === 'remove' && { backgroundColor: '#e74c3c' }]} onPress={() => setTipo('remove')}><Text style={styles.switchText}>Gasto</Text></TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Monto" keyboardType="numeric" value={monto} onChangeText={setMonto} />
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            {tipo === 'remove' && (
                <Picker selectedValue={categoria} style={styles.input} onValueChange={setCategoria}>
                    {categorias.map(c => (<Picker.Item label={c} value={c} key={c} />))}
                </Picker>
            )}
            <Picker selectedValue={fuente} style={styles.input} onValueChange={setFuente}>
                {fuentes.map(f => (<Picker.Item label={f} value={f} key={f} />))}
            </Picker>
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: colorBtn }]} onPress={handleSave}>
                <Text style={styles.addBtnText}>{isEdit ? 'Guardar cambios' : 'Guardar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 22, marginBottom: 16, textAlign: 'center', fontWeight: 'bold' },
    input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 },
    addBtn: { borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 16 },
    addBtnText: { color: '#fff', fontSize: 18 },
    cancelBtn: { marginTop: 8, alignItems: 'center' },
    cancelBtnText: { color: '#aaa', fontSize: 16 },
    switchRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
    switchBtn: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#232c5c', borderRadius: 8, marginHorizontal: 4 },
    switchText: { color: '#fff', fontWeight: 'bold' },
});
