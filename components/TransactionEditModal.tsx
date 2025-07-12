import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { parseDecimalInput, isValidDecimalInput } from './utils';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAccept: (monto: number, categoria: string, medio: string, tipo: 'ingreso' | 'gasto') => void;
  styles: any;
  isDarkMode: boolean;
  initialData?: {
    monto: number;
    categoria: string;
    medio: string;
    tipo: 'ingreso' | 'gasto';
  };
  editMode?: boolean;
}

const categoriasIngreso = ['Sueldo', 'Regalo', 'Bono'];
const categoriasGasto = ['Supermercado', 'Salida', 'Deporte', 'Cuota', 'Expensa'];
const medios = ['Banco', 'Billetera Virtual', 'Efectivo'];

export default function TransactionEditModal({ visible, onClose, onAccept, styles, isDarkMode, initialData, editMode }: Props) {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [medio, setMedio] = useState('');
  const [tipo, setTipo] = useState<'ingreso' | 'gasto'>('ingreso');
  const [categoriaMenu, setCategoriaMenu] = useState(false);
  const [medioMenu, setMedioMenu] = useState(false);

  // Animación
  const scaleAnim = useRef(new Animated.Value(0.2)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(180)).current;
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 180,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShow(false));
    }
  }, [visible]);

  useEffect(() => {
    if (initialData && editMode) {
      setMonto(initialData.monto.toString().replace('.', ','));
      setCategoria(initialData.categoria);
      setMedio(initialData.medio);
      setTipo(initialData.tipo);
    } else if (!visible) {
      setMonto('');
      setCategoria('');
      setMedio('');
      setTipo('ingreso');
    }
  }, [initialData, editMode, visible]);

  const handleAccept = () => {
    const montoNum = parseDecimalInput(monto);
    if (!isValidDecimalInput(monto) || !categoria || !medio) return;
    onAccept(montoNum, categoria, medio, tipo);
  };

  if (!visible) return null;
  // Usar la lista de categorías según el tipo seleccionado
  const categorias = tipo === 'ingreso' ? categoriasIngreso : categoriasGasto;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
      <BlurView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }} intensity={80} tint="dark" />
      <Animated.View
        style={[
          {
            backgroundColor: 'rgba(26,35,77,0.98)',
            borderRadius: 32,
            minWidth: 320,
            maxWidth: 400,
            width: '90%',
            padding: 28,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 24,
            elevation: 24,
            borderWidth: 2.5,
            borderColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c',
            zIndex: 2,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={{ color: tipo === 'ingreso' ? '#00b894' : '#e74c3c', fontSize: 22, fontWeight: 'bold', marginBottom: 18, textAlign: 'center' }}>Editar Transacción</Text>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 10, marginBottom: 4 }}>Monto</Text>
        <TextInput
          style={{ width: '100%', backgroundColor: 'rgba(26,35,77,0.85)', borderRadius: 8, borderWidth: 2, borderColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c', color: '#fff', paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, marginBottom: 10 }}
          value={monto}
          onChangeText={setMonto}
          placeholder="$0,00"
          placeholderTextColor="#aaa"
          keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
          inputMode="decimal"
          maxLength={12}
        />
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 10, marginBottom: 4 }}>Categoría</Text>
        <View style={{ width: '100%', position: 'relative' }}>
          <TouchableOpacity style={{ width: '100%', backgroundColor: 'rgba(26,35,77,0.85)', borderRadius: 8, borderWidth: 2, borderColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c', paddingHorizontal: 14, paddingVertical: 10, marginBottom: 10 }} onPress={() => setCategoriaMenu(!categoriaMenu)}>
            <Text style={{ color: categoria ? '#fff' : '#aaa', fontSize: 16 }}>{categoria || 'Seleccionar categoría'}</Text>
          </TouchableOpacity>
          {categoriaMenu && (
            <View style={{ position: 'absolute', top: 44, left: 0, right: 0, backgroundColor: 'rgba(26,35,77,0.98)', borderRadius: 8, zIndex: 100, paddingVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 8 }}>
              {categorias.map((cat) => (
                <TouchableOpacity key={cat} style={{ paddingVertical: 10, paddingHorizontal: 18 }} onPress={() => { setCategoria(cat); setCategoriaMenu(false); }}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 10, marginBottom: 4 }}>Medio</Text>
        <View style={{ width: '100%', position: 'relative' }}>
          <TouchableOpacity style={{ width: '100%', backgroundColor: 'rgba(26,35,77,0.85)', borderRadius: 8, borderWidth: 2, borderColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c', paddingHorizontal: 14, paddingVertical: 10, marginBottom: 10 }} onPress={() => setMedioMenu(!medioMenu)}>
            <Text style={{ color: medio ? '#fff' : '#aaa', fontSize: 16 }}>{medio || 'Seleccionar medio'}</Text>
          </TouchableOpacity>
          {medioMenu && (
            <View style={{ position: 'absolute', top: 44, left: 0, right: 0, backgroundColor: 'rgba(26,35,77,0.98)', borderRadius: 8, zIndex: 100, paddingVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 8 }}>
              {medios.map((m) => (
                <TouchableOpacity key={m} style={{ paddingVertical: 10, paddingHorizontal: 18 }} onPress={() => { setMedio(m); setMedioMenu(false); }}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 18 }}>
          <TouchableOpacity style={{ borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#aaa', marginRight: 16 }} onPress={onClose}>
            <Text style={{ fontSize: 16, color: '#aaa', fontWeight: 'bold' }}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c' }} onPress={handleAccept}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
