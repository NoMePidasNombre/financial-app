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

const styles = {
  modalOverlay: {
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
  customModal: {
    borderRadius: 32,
    minWidth: 320,
    maxWidth: 400,
    width: '90%',
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(26,35,77,0.85)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00b894',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  tipoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  tipoButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  modalCloseButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#aaa',
    marginRight: 8,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: 'bold',
  },
  modalAcceptButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  modalAcceptText: {
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
};

export default function TransactionModal({ visible, onClose, onAccept, styles, isDarkMode, initialData, editMode }: Props) {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [medio, setMedio] = useState('');
  // Usar el tipo inicial de la prop initialData si existe
  const [tipo, setTipo] = useState<'ingreso' | 'gasto'>(initialData?.tipo || 'ingreso');
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
      // Solo resetear tipo si no hay initialData
      if (!initialData?.tipo) setTipo('ingreso');
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
      {/* Blur de fondo, cubre toda la pantalla */}
      <BlurView
        style={styles.absoluteFill}
        intensity={90} // Más intenso
        tint={isDarkMode ? 'dark' : 'light'}
      />
      {/* Capa de color dinámico sobre el blur, pero detrás del modal */}
      <View
        style={[
          styles.absoluteFill,
          {
            backgroundColor: tipo === 'ingreso' ? 'rgba(0,184,148,0.18)' : 'rgba(231,76,60,0.18)',
            zIndex: 1,
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.customModal,
          {
            backgroundColor: isDarkMode
              ? (tipo === 'ingreso' ? 'rgba(0,184,148,0.22)' : 'rgba(231,76,60,0.22)')
              : (tipo === 'ingreso' ? 'rgba(0,184,148,0.18)' : 'rgba(231,76,60,0.18)'),
            borderWidth: 2.5,
            borderColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c',
            shadowColor: tipo === 'ingreso' ? '#00b894' : '#e74c3c',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 24,
            elevation: 24,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
            opacity: opacityAnim,
            zIndex: 2,
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
