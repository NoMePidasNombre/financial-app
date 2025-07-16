import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';

interface Props {
    visible: boolean;
    onClose: () => void;
    onAccept: (monto: number, categoria: string, medio: string, tipo: 'ingreso' | 'gasto') => void;
    initialTipo?: 'ingreso' | 'gasto';
}

const categoriasIngreso = ['Sueldo', 'Regalo', 'Bono'];
const categoriasGasto = ['Supermercado', 'Salida', 'Deporte', 'Cuota', 'Expensa'];
const medios = ['Banco', 'Billetera Virtual', 'Efectivo'];

export default function IngresoModal({ visible, onClose, onAccept, initialTipo = 'ingreso' }: Props) {
    const [monto, setMonto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [medio, setMedio] = useState('');
    const [tipo, setTipo] = useState<'ingreso' | 'gasto'>(initialTipo);
    const [categoriaMenu, setCategoriaMenu] = useState(false);
    const [medioMenu, setMedioMenu] = useState(false);

    useEffect(() => {
        if (visible) {
            setMonto('');
            setCategoria('');
            setMedio('');
            setTipo(initialTipo);
            setCategoriaMenu(false);
            setMedioMenu(false);
        }
    }, [visible, initialTipo]);

    // Limpiar selecciones cuando cambia el tipo
    useEffect(() => {
        if (tipo !== initialTipo) {
            setCategoria('');
            setCategoriaMenu(false);
        }
    }, [tipo]);

    // Función para cerrar todos los menús y teclado
    const closeAllMenus = () => {
        setCategoriaMenu(false);
        setMedioMenu(false);
        Keyboard.dismiss();
    };

    // Obtener categorías según el tipo
    const categorias = tipo === 'ingreso' ? categoriasIngreso : categoriasGasto;

    // Animación
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;
    const puedeAceptar = !!monto && !!categoria && !!medio && parseFloat(monto.replace(',', '.')) > 0;

    return (
        <TouchableWithoutFeedback onPress={closeAllMenus} accessible={false}>
            <View style={styles.overlay}>
                <BlurView style={styles.absoluteFill} intensity={80} tint="dark" />
                <View style={[
                    styles.modal, 
                    { 
                        shadowColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c',
                        borderColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c'
                    }
                ]}>
                    <Animated.View style={{
                        transform: [{ scale: scaleAnim }], 
                        opacity: opacityAnim,
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <Text style={[styles.title, { color: tipo === 'ingreso' ? '#00b894' : '#e74c3c' }]}>Cargar Nueva Transacción</Text>

                        <Text style={styles.label}>Monto</Text>
                        <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
                            <View style={{ width: '100%' }}>
                                <TextInput
                                    style={[styles.input, { borderColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c' }]}
                                    value={monto}
                                    onChangeText={setMonto}
                                    placeholder="$0,00"
                                    placeholderTextColor="#aaa"
                                    keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                                    inputMode="decimal"
                                    maxLength={12}
                                    onFocus={() => {
                                        setCategoriaMenu(false);
                                        setMedioMenu(false);
                                    }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <Text style={styles.label}>Categoría</Text>
                        <View style={{ width: '100%', position: 'relative' }}>
                            <TouchableOpacity 
                                style={[styles.input, { borderColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c' }]} 
                                onPress={() => {
                                    closeAllMenus();
                                    setCategoriaMenu(!categoriaMenu);
                                }}
                            >
                                <Text style={{ color: categoria ? '#fff' : '#aaa' }}>{categoria || 'Seleccionar categoría'}</Text>
                            </TouchableOpacity>
                            {categoriaMenu && (
                                <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
                                    <View style={styles.dropdownMenuAbsolute}>
                                        {categorias.map((cat) => (
                                            <TouchableOpacity key={cat} style={styles.dropdownItem} onPress={() => { setCategoria(cat); setCategoriaMenu(false); }}>
                                                <Text style={styles.dropdownText}>{cat}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                        </View>
                        <Text style={styles.label}>Medio</Text>
                        <View style={{ width: '100%', position: 'relative' }}>
                            <TouchableOpacity 
                                style={[styles.input, { borderColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c' }]} 
                                onPress={() => {
                                    closeAllMenus();
                                    setMedioMenu(!medioMenu);
                                }}
                            >
                                <Text style={{ color: medio ? '#fff' : '#aaa' }}>{medio || 'Seleccionar medio'}</Text>
                            </TouchableOpacity>
                            {medioMenu && (
                                <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
                                    <View style={styles.dropdownMenuAbsolute}>
                                        {medios.map((m) => (
                                            <TouchableOpacity key={m} style={styles.dropdownItem} onPress={() => { setMedio(m); setMedioMenu(false); }}>
                                                <Text style={styles.dropdownText}>{m}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                        </View>
                        
                        {/* Botones de tipo */}
                        <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
                            <View style={styles.tipoContainer}>
                                <TouchableOpacity 
                                    style={[styles.tipoButton, tipo === 'ingreso' && styles.tipoButtonActive, { borderColor: '#00b894', backgroundColor: tipo === 'ingreso' ? '#00b894' : 'transparent' }]}
                                    onPress={() => {
                                        closeAllMenus();
                                        setTipo('ingreso');
                                        setCategoria('');
                                    }}
                                >
                                    <Text style={[styles.tipoText, { color: tipo === 'ingreso' ? '#fff' : '#00b894' }]}>Ingreso</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.tipoButton, tipo === 'gasto' && styles.tipoButtonActive, { borderColor: '#e74c3c', backgroundColor: tipo === 'gasto' ? '#e74c3c' : 'transparent' }]}
                                    onPress={() => {
                                        closeAllMenus();
                                        setTipo('gasto');
                                        setCategoria('');
                                    }}
                                >
                                    <Text style={[styles.tipoText, { color: tipo === 'gasto' ? '#fff' : '#e74c3c' }]}>Gasto</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.acceptBtn, 
                                        { backgroundColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c' },
                                        !puedeAceptar && { opacity: 0.5 }
                                    ]}
                                    onPress={() => puedeAceptar && onAccept(parseFloat(monto.replace(',', '.')), categoria, medio, tipo)}
                                    disabled={!puedeAceptar}
                                >
                                    <Text style={styles.acceptText}>Guardar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
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
    modal: {
        backgroundColor: 'rgba(26,35,77,0.98)',
        borderRadius: 32,
        minWidth: 320,
        maxWidth: 400,
        width: '90%',
        padding: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 24,
        borderWidth: 2.5,
        // borderColor y shadowColor se aplicarán dinámicamente
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 18,
        textAlign: 'center',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginTop: 10,
        marginBottom: 4,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(26,35,77,0.85)',
        borderRadius: 8,
        borderWidth: 2,
        color: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 18,
    },
    cancelBtn: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#aaa',
        marginRight: 16,
    },
    cancelText: {
        fontSize: 16,
        color: '#aaa',
        fontWeight: 'bold',
    },
    acceptBtn: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor se define dinámicamente según el tipo
    },
    acceptText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    dropdownMenuAbsolute: {
        position: 'absolute',
        top: 44,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(26,35,77,0.98)',
        borderRadius: 8,
        zIndex: 100,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    dropdownText: {
        color: '#fff',
        fontSize: 16,
    },
    tipoContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        borderRadius: 8,
        overflow: 'hidden',
        width: '100%',
    },
    tipoButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        marginHorizontal: 4,
        borderRadius: 8,
    },
    tipoButtonActive: {
        // Este estilo se aplicará dinámicamente
    },
    tipoText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
