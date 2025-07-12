import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Easing } from 'react-native';
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

  if (!show) return null;

  return (
    <View style={styles.modalOverlay}>
      <Animated.View
        style={[
          styles.customModal,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.modalTitle}>EDITAR TRANSACCIÓN</Text>
        <Text style={styles.modalLabel}>Monto</Text>
        <TextInput
          style={styles.input}
          value={monto}
          onChangeText={setMonto}
          placeholder="$0,00"
          placeholderTextColor="#aaa"
          keyboardType="decimal-pad"
          maxLength={12}
        />
        <Text style={styles.modalLabel}>Categoría</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setCategoriaMenu(!categoriaMenu)}
        >
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
        <Text style={styles.modalLabel}>Medio</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setMedioMenu(!medioMenu)}
        >
          <Text style={{ color: medio ? '#fff' : '#aaa' }}>{medio || 'Seleccionar medio'}</Text>
        </TouchableOpacity>
        {medioMenu && (
          <View style={styles.dropdownMenuAbsolute}>
            {medios.map((med) => (
              <TouchableOpacity key={med} style={styles.dropdownItem} onPress={() => { setMedio(med); setMedioMenu(false); }}>
                <Text style={styles.dropdownText}>{med}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.tipoRow}>
          <TouchableOpacity
            style={[styles.tipoButton, tipo === 'ingreso' ? styles.tipoIngreso : styles.tipoUnselected]}
            onPress={() => setTipo('ingreso')}
          >
            <Text style={styles.tipoButtonText}>Ingreso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tipoButton, tipo === 'gasto' ? styles.tipoGasto : styles.tipoUnselected]}
            onPress={() => setTipo('gasto')}
          >
            <Text style={styles.tipoButtonText}>Gasto</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalButtonRow}>
          <TouchableOpacity style={styles.modalAcceptButton} onPress={handleAccept}>
            <Text style={styles.modalAcceptText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
