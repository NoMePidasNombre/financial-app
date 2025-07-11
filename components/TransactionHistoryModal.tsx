import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';

interface Transaction {
  tipo: 'ingreso' | 'gasto';
  categoria: string;
  medio: string;
  monto: number;
  fecha: string; // dd/mm/aaaa
  hora: string;  // hh:mm
}

interface Props {
  visible: boolean;
  onClose: () => void;
  styles: any;
  isDarkMode: boolean;
  transactions: Transaction[];
}

const ICONO_BILLETE = '💵';

export default function TransactionHistoryModal({ visible, onClose, styles, isDarkMode, transactions }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <BlurView
        style={styles.absoluteFill}
        intensity={70}
        tint={isDarkMode ? 'dark' : 'light'}
      />
      <View style={styles.customModal}>
        <Text style={styles.modalTitle}>HISTORIAL DE TRANSACCIONES</Text>
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 20 }}>
          {transactions.length === 0 && (
            <Text style={{ color: '#fff', textAlign: 'center', marginVertical: 20 }}>No hay transacciones registradas.</Text>
          )}
          {transactions.map((t, idx) => {
            // Formatear monto y decidir si cabe en una línea
            const montoStr = `$${t.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
            // Aproximar el ancho máximo disponible para el monto (en caracteres)
            const maxCharsInline = 12; // Ajusta según el diseño real
            const montoEnLinea = montoStr.length <= maxCharsInline;
            return (
              <View key={idx} style={{ marginBottom: 18, borderBottomWidth: 1, borderBottomColor: '#0FFFFF22', paddingBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: montoEnLinea ? 2 : 0, flexWrap: 'wrap' }}>
                  <Text style={{ fontSize: 22, marginRight: 8 }}>{ICONO_BILLETE}</Text>
                  <Text style={{
                    color: t.tipo === 'ingreso' ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginRight: 8,
                  }}>{t.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}</Text>
                  <Text style={{ color: '#fff', fontSize: 16, marginRight: 8 }}>{t.categoria}</Text>
                  {montoEnLinea ? (
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{montoStr}</Text>
                  ) : null}
                </View>
                {!montoEnLinea && (
                  <View style={{ width: '100%', alignItems: 'center', marginTop: 2, marginBottom: 2 }}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{montoStr}</Text>
                  </View>
                )}
                <Text style={{ color: '#aaa', fontSize: 12, marginLeft: 30 }}>
                  {t.fecha} - {t.hora}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <TouchableOpacity style={[styles.modalCloseButton, { alignSelf: 'center', marginTop: 10 }]} onPress={onClose}>
          <Text style={styles.modalCloseText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
