import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native';
import TransactionEditModal from './TransactionEditModal';

const { width, height } = Dimensions.get('window');

interface Transaction {
  tipo: 'ingreso' | 'gasto';
  categoria: string;
  medio: string;
  monto: number;
  fecha: string;
  hora: string;
}

interface Props {
  transactions: Transaction[];
  onClose: () => void;
  onEdit: (index: number, data: Transaction) => void;
  onDelete: (index: number) => void;
}

const ICONO_BILLETE = '💵';

export default function TransactionHistoryScreen({ transactions, onClose, onEdit, onDelete }: Props) {
  // Estado local para modal de edición
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editIdx, setEditIdx] = React.useState<number | null>(null);
  const [initialData, setInitialData] = React.useState<any>(null);
  const [editMode, setEditMode] = React.useState(false);

  // Abrir modal de edición localmente
  const handleEdit = (idx: number, data: any) => {
    setEditIdx(idx);
    setInitialData(data);
    setEditMode(true);
    setModalVisible(true);
  };

  // Guardar edición y notificar a MainApp
  const handleAceptar = (monto: number, categoria: string, medio: string, tipo: 'ingreso' | 'gasto') => {
    if (editMode && editIdx != null && initialData) {
      if (typeof onEdit === 'function') {
        onEdit(editIdx, { tipo, categoria, medio, monto, fecha: initialData.fecha, hora: initialData.hora });
      }
    }
    setModalVisible(false);
    setEditMode(false);
    setEditIdx(null);
    setInitialData(null);
  };

  // Cerrar modal
  const handleCerrar = () => {
    setModalVisible(false);
    setEditMode(false);
    setEditIdx(null);
    setInitialData(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>HISTORIAL DE TRANSACCIONES</Text>
      </View>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {transactions.length === 0 && (
          <Text style={{ color: '#fff', textAlign: 'center', marginVertical: 20 }}>No hay transacciones registradas.</Text>
        )}
        {transactions.slice().reverse().map((t, idx) => {
          const montoStr = `$${t.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
          const maxCharsInline = 12;
          const montoEnLinea = montoStr.length <= maxCharsInline;
          return (
            <View key={idx} style={styles.transactionItem}>
              <View style={styles.transactionRow}>
                <Text style={styles.icon}>{ICONO_BILLETE}</Text>
                <Text style={[styles.tipo, { color: t.tipo === 'ingreso' ? '#27ae60' : '#e74c3c' }]}>{t.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}</Text>
                <Text style={styles.categoria}>{t.categoria}</Text>
                {montoEnLinea ? (
                  <Text style={styles.monto}>{montoStr}</Text>
                ) : null}
              </View>
              {!montoEnLinea && (
                <View style={styles.montoRow}>
                  <Text style={styles.monto}>{montoStr}</Text>
                </View>
              )}
              <Text style={styles.fecha}>{t.fecha} - {t.hora}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
                <TouchableOpacity
                  style={{ backgroundColor: '#27ae60', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24, marginRight: 16 }}
                  onPress={() => handleEdit(idx, t)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: '#e74c3c', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24 }}
                  onPress={() => onDelete(idx)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Borrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
      {/* Modal de edición local */}
      {modalVisible && (
        <TransactionEditModal
          key={editIdx !== null ? `edit-${editIdx}` : 'edit-modal'}
          visible={modalVisible}
          onClose={handleCerrar}
          onAccept={handleAceptar}
          styles={styles}
          isDarkMode={false}
          initialData={editMode && initialData ? initialData : undefined}
          editMode={editMode}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181F2A',
    paddingTop: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: height * 0.06,
    paddingBottom: 18,
    backgroundColor: '#181F2A',
    borderBottomWidth: 1,
    borderBottomColor: '#0FFFFF22',
    zIndex: 2,
  },
  closeButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  closeText: {
    color: '#0FFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  transactionItem: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#0FFFFF22',
    paddingBottom: 8,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  icon: {
    fontSize: 22,
    marginRight: 8,
  },
  tipo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  categoria: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  monto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  montoRow: {
    width: '100%',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  fecha: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 30,
  },
  // --- MODAL STYLES ---
  customModal: {
    position: 'absolute',
    backgroundColor: '#1A2A3AEE',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.06,
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
