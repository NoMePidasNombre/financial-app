import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { BlurView } from 'expo-blur';

interface Props {
    visible: boolean;
    onSelect: (tipo: 'ingreso' | 'gasto') => void;
    onClose: () => void;
}

export default function TipoTransaccionModal({ visible, onSelect, onClose }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <BlurView style={styles.absoluteFill} intensity={80} tint="dark" />
                <View style={styles.popup}>
                    <Text style={styles.title}>Selecciona el tipo de transacción</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.btn, { backgroundColor: '#00b894' }]} onPress={() => onSelect('ingreso')}>
                            <Text style={styles.btnText}>Ingreso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, { backgroundColor: '#e74c3c' }]} onPress={() => onSelect('gasto')}>
                            <Text style={styles.btnText}>Gasto</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.18)',
    },
    absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 32,
        overflow: 'hidden',
    },
    popup: {
        backgroundColor: 'rgba(26,35,77,0.98)',
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        minWidth: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 20,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 18,
    },
    btn: {
        flex: 1,
        marginHorizontal: 8,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelBtn: {
        marginTop: 8,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    cancelText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
