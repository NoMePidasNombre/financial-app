import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        Keyboard.dismiss();
        navigation.goBack();
    };

    // Colores dinámicos
    const colorFondo = tipo === 'remove' ? '#e74c3c' : '#00b894';
    const colorBtn = tipo === 'remove' ? '#c0392b' : '#009e6d';

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right', 'top']}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 32}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={[styles.container, { backgroundColor: colorFondo + '22', minHeight: 500 }]}> 
                            <Text style={[styles.title, { color: colorFondo }]}>{isEdit ? 'Editar' : (tipo === 'remove' ? 'Nuevo Gasto' : 'Nuevo Ingreso')}</Text>
                            <View style={[styles.switchRow, { marginTop: 48 }]}> 
                                <TouchableOpacity style={[styles.switchBtn, tipo === 'add' && { backgroundColor: '#00b894' }]} onPress={() => setTipo('add')}><Text style={styles.switchText}>Ingreso</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.switchBtn, tipo === 'remove' && { backgroundColor: '#e74c3c' }]} onPress={() => setTipo('remove')}><Text style={styles.switchText}>Gasto</Text></TouchableOpacity>
                            </View>
                            <TextInput style={styles.input} placeholder="Monto" keyboardType={Platform.OS === 'ios' ? 'numeric' : 'number-pad'} value={monto} onChangeText={setMonto} returnKeyType="done" onSubmitEditing={Keyboard.dismiss} />
                            {Platform.OS === 'android' && (
                                <TouchableOpacity style={{ marginBottom: 12, alignSelf: 'flex-end', backgroundColor: '#eee', borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 }} onPress={Keyboard.dismiss}>
                                    <Text style={{ color: '#232c5c', fontWeight: 'bold' }}>Listo</Text>
                                </TouchableOpacity>
                            )}
                            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} returnKeyType="done" onSubmitEditing={Keyboard.dismiss} />
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
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => { Keyboard.dismiss(); navigation.goBack(); }}>
                                <Text style={styles.cancelBtnText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
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
