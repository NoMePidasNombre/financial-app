import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { parseDecimalInput, isValidDecimalInput } from './utils';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAccept: (monto: number, categoria: string, medio: string, tipo: 'ingreso' | 'gasto') => void;
  styles: any;
  isDarkMode: boolean;
}

const categorias = ['Sueldo', 'Comida', 'Supermercado', 'Alquiler'];
const medios = ['Efectivo', 'Transferencia', 'Bancarizado'];

export default function TransactionModal({ visible, onClose, onAccept, styles, isDarkMode }: Props) {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [medio, setMedio] = useState('');
  const [tipo, setTipo] = useState<'ingreso' | 'gasto'>('ingreso');
  const [categoriaMenu, setCategoriaMenu] = useState(false);
  const [medioMenu, setMedioMenu] = useState(false);

  if (!visible) return null;

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

  return (
    <View style={styles.modalOverlay}>
      <BlurView
        style={styles.absoluteFill}
        intensity={70}
        tint={isDarkMode ? 'dark' : 'light'}
      />
      <View style={styles.customModal}>
        <Text style={styles.modalTitle}>Cargar Nueva Transacción</Text>
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
        {/* Botones Cerrar y Aceptar */}
        <View style={styles.modalButtonRow}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCerrar}>
            <Text style={styles.modalCloseText}>Cerrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalAcceptButton, !puedeAceptar && { opacity: 0.5 }]}
            onPress={handleAceptar}
            disabled={!puedeAceptar}
          >
            <Text style={styles.modalAcceptText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
