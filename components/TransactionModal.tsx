import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Animated, Easing } from 'react-native';
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


const categorias = ['Sueldo', 'Comida', 'Supermercado', 'Alquiler'];
const medios = ['Efectivo', 'Transferencia', 'Bancarizado'];

export default function TransactionModal({ visible, onClose, onAccept, styles, isDarkMode, initialData, editMode }: Props) {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [medio, setMedio] = useState('');
  const [tipo, setTipo] = useState<'ingreso' | 'gasto'>('ingreso');
  const [categoriaMenu, setCategoriaMenu] = useState(false);
  const [medioMenu, setMedioMenu] = useState(false);

  // Animación desde el botón central
  const scaleAnim = useRef(new Animated.Value(0.2)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(180)).current; // Empieza más abajo
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
      ]).start();
    } else if (show) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.2,
          duration: 220,
          useNativeDriver: true,
          easing: Easing.in(Easing.exp),
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 180,
          duration: 220,
          useNativeDriver: true,
          easing: Easing.in(Easing.exp),
        }),
      ]).start(() => setShow(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Cargar datos iniciales si es edición
  React.useEffect(() => {
    if (editMode && initialData) {
      setMonto(initialData.monto.toString().replace('.', ','));
      setCategoria(initialData.categoria);
      setMedio(initialData.medio);
      setTipo(initialData.tipo);
    } else if (visible && !editMode) {
      setMonto('');
      setCategoria('');
      setMedio('');
      setTipo('ingreso');
    }
  }, [editMode, initialData, visible]);

  if (!show) return null;


  const montoValido = !!monto && isValidDecimalInput(monto) && parseDecimalInput(monto) > 0;
  const categoriaValida = !!categoria;
  const medioValido = !!medio;
  const puedeAceptar = montoValido && categoriaValida && medioValido;

  const handleAceptar = () => {
    if (!puedeAceptar) return;
    onAccept(parseDecimalInput(monto), categoria, medio, tipo);
    setMonto('');
    setCategoria('');
    setMedio('');
    setTipo('ingreso');
    setCategoriaMenu(false);
    setMedioMenu(false);
  };

  const handleCerrar = () => {
    setMonto('');
    setCategoria('');
    setMedio('');
    setTipo('ingreso');
    setCategoriaMenu(false);
    setMedioMenu(false);
    onClose();
  };


  // Colores según tipo
  const bgColor = tipo === 'ingreso' ? '#00b89422' : '#e74c3c22';
  const titleColor = tipo === 'ingreso' ? '#00b894' : '#e74c3c';
  const ingresoBtnColor = tipo === 'ingreso' ? '#00b894' : '#232c5c';
  const gastoBtnColor = tipo === 'gasto' ? '#e74c3c' : '#232c5c';
  const guardarBtnColor = tipo === 'ingreso' ? '#009e6d' : '#c0392b';

  return (
    <View style={styles.modalOverlay}>
      <BlurView
        style={styles.absoluteFill}
        intensity={70}
        tint={isDarkMode ? 'dark' : 'light'}
      />
      <Animated.View
        style={[
          styles.customModal,
          {
            backgroundColor: bgColor,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={[styles.modalTitle, { color: titleColor }]}>Cargar Nueva Transacción</Text>
        {/* Monto */}
        <Text style={styles.modalLabel}>Monto</Text>
        <TextInput
          style={styles.input}
          value={monto}
          onChangeText={text => {
            // Permitir solo números, coma y máximo un separador
            if (text === '' || /^\d*(,\d{0,2})?$/.test(text)) setMonto(text);
          }}
          placeholder="$0,00"
          placeholderTextColor="#aaa"
          keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
          inputMode="decimal"
          maxLength={12}
          returnKeyType="done"
        />
        {/* Categoría */}
        <Text style={styles.modalLabel}>Categoría</Text>
        <View style={{ width: '100%', position: 'relative' }}>
          <TouchableOpacity style={styles.input} onPress={() => setCategoriaMenu(!categoriaMenu)}>
            <Text style={{ color: categoria ? '#fff' : '#aaa' }}>{categoria || 'Seleccionar categoría'}</Text>
          </TouchableOpacity>
          {categoriaMenu && (
            <View style={styles.dropdownMenuAbsolute}>
              {categorias.map((cat) => (
                <TouchableOpacity key={cat} style={styles.dropdownItem} onPress={() => { setCategoria(cat); setCategoriaMenu(false); }}>
                  <Text style={styles.dropdownText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* Medio */}
        <Text style={styles.modalLabel}>Medio</Text>
        <View style={{ width: '100%', position: 'relative' }}>
          <TouchableOpacity style={styles.input} onPress={() => setMedioMenu(!medioMenu)}>
            <Text style={{ color: medio ? '#fff' : '#aaa' }}>{medio || 'Seleccionar medio'}</Text>
          </TouchableOpacity>
          {medioMenu && (
            <View style={styles.dropdownMenuAbsolute}>
              {medios.map((m) => (
                <TouchableOpacity key={m} style={styles.dropdownItem} onPress={() => { setMedio(m); setMedioMenu(false); }}>
                  <Text style={styles.dropdownText}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* Tipo: Ingreso/Gasto */}
        <View style={styles.tipoRow}>
          <TouchableOpacity
            style={[styles.tipoButton, { backgroundColor: ingresoBtnColor }]}
            onPress={() => setTipo('ingreso')}
          >
            <Text style={[styles.tipoButtonText, { color: '#fff' }]}>Ingreso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tipoButton, { backgroundColor: gastoBtnColor }]}
            onPress={() => setTipo('gasto')}
          >
            <Text style={[styles.tipoButtonText, { color: '#fff' }]}>Gasto</Text>
          </TouchableOpacity>
        </View>
        {/* Botones Cerrar y Aceptar */}
        <View style={[styles.modalButtonRow, { justifyContent: 'center' }]}> 
          <TouchableOpacity
            style={[
              styles.modalCloseButton,
              {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: '#aaa',
                marginRight: 16,
              },
            ]}
            onPress={handleCerrar}
          >
            <Text style={[styles.modalCloseText, { color: '#aaa' }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalAcceptButton,
              { backgroundColor: guardarBtnColor },
              !puedeAceptar && { opacity: 0.5 },
            ]}
            onPress={handleAceptar}
            disabled={!puedeAceptar}
          >
            <Text style={[styles.modalAcceptText, { color: '#fff' }]}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
