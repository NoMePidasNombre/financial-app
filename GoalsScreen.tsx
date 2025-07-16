import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Image, Dimensions, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = {
  pencil: require('./assets/icons/pencil.png'),
  trashcan: require('./assets/icons/trashcan.png'),
  home: require('./assets/icons/home.png'),
  goals: require('./assets/icons/goals.png'),
  plus: require('./assets/icons/plus.png'),
  stats: require('./assets/icons/graphs.png'),
  list: require('./assets/icons/calculate.png'),
  settings: require('./assets/icons/settings.png'),
  notifications: require('./assets/icons/notifications.png'),
  history: require('./assets/icons/history.png'),
  profile: require('./assets/icons/profile.png'),
};

const EMOJIS = ['🏖️', '🚗', '🎁', '👟', '👗', '🏠', '📚', '💻', '🛒', '🍽️', '🎸', '🧸', '🐖'];

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  emoji: string;
  currentAmount: number;
}

const GoalsScreen: React.FC<{ goals: Goal[]; setGoals: (goals: Goal[]) => void; navigation?: any }> = ({ goals, setGoals, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [emoji, setEmoji] = useState('');
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');

  // Función para cerrar el teclado y modales
  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const saveGoal = () => {
    if (!name || !targetAmount || !emoji) return;
    if (editMode && editId) {
      setGoals(goals.map(goal => goal.id === editId ? { ...goal, name, targetAmount: parseFloat(targetAmount), emoji } : goal));
    } else {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          name,
          targetAmount: parseFloat(targetAmount),
          emoji,
          currentAmount: 0,
        },
      ]);
    }
    setName('');
    setTargetAmount('');
    setEmoji('');
    setEditMode(false);
    setEditId(null);
    setModalVisible(false);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const startEditGoal = (goal: Goal) => {
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setEmoji(goal.emoji);
    setEditMode(true);
    setEditId(goal.id);
    setModalVisible(true);
  };

  function handleBottomMenuPress(idx: number) {
    if (!navigation) return;
    if (idx === 0) {
      navigation.navigate('Home'); // Solo navega, la animación ya está definida en el stack
    } else if (idx === 1) {
      navigation.navigate('Goals');
    } else if (idx === 2) {
      // Modal de agregar transacción/meta si lo deseas
    } else if (idx === 3) {
      navigation.navigate('Stats');
    } else if (idx === 4) {
      navigation.navigate('TransactionHistory');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={closeKeyboard} accessible={false}>
      <View style={styles.container}>
        {/* Contenido principal con padding para el menu superior global */}
        <View style={{ flex: 1, paddingTop: 70 + insets.top }}>
          <Text style={styles.title}>Metas</Text>
        <TouchableOpacity style={styles.addBox} onPress={() => { setModalVisible(true); setEditMode(false); setName(''); setTargetAmount(''); setEmoji(''); }}>
          <View style={styles.addBoxContent}>
            <Text style={styles.addBoxIcon}>🏁</Text>
            <Text style={styles.addBoxText}>Añadir nueva meta</Text>
            <View style={styles.addCircle}><Text style={styles.addCircleText}>+</Text></View>
          </View>
        </TouchableOpacity>
      <View style={styles.dottedLine} />
      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalBox}>
            <View style={styles.goalBoxContent}>
              <Text style={styles.goalIcon}>{item.emoji || '🐖'}</Text>
              <Text style={styles.goalName}>{item.name}</Text>
              <View style={styles.goalActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => startEditGoal(item)}>
                  <Image source={ICONS.pencil} style={styles.actionImg} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => deleteGoal(item.id)}>
                  <Image source={ICONS.trashcan} style={styles.actionImg} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#fff', textAlign: 'center', marginTop: 16 }}>No tienes metas creadas.</Text>}
      />
      {/* Modal tipo transacción para añadir/editar meta */}
      {modalVisible && (
        <TouchableWithoutFeedback onPress={() => { setModalVisible(false); setEditMode(false); setEditId(null); closeKeyboard(); }} accessible={false}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{editMode ? 'Editar Meta' : 'Añadir Meta'}</Text>
                <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
                  <View style={{ width: '100%' }}>
                    <TextInput 
                      style={styles.modalInput} 
                      placeholder="Nombre" 
                      value={name} 
                      onChangeText={setName} 
                      placeholderTextColor="#ccc"
                    />
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
                  <View style={{ width: '100%' }}>
                    <TextInput 
                      style={styles.modalInput} 
                      placeholder="Cantidad" 
                      value={targetAmount} 
                      onChangeText={setTargetAmount} 
                      keyboardType="numeric" 
                      placeholderTextColor="#ccc"
                    />
                  </View>
                </TouchableWithoutFeedback>
                <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8, marginTop: 2 }}>Elige un emoji:</Text>
                <View style={styles.emojiList}>
                  {EMOJIS.map(e => (
                    <TouchableOpacity
                      key={e}
                      style={[styles.emojiBtn, emoji === e && styles.emojiBtnSelected]}
                      onPress={() => setEmoji(e)}
                    >
                      <Text style={styles.emojiText}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalBtn} onPress={saveGoal}><Text style={styles.modalBtnText}>{editMode ? 'Guardar' : 'Añadir'}</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#e74c3c' }]} onPress={() => { setModalVisible(false); setEditMode(false); setEditId(null); }}><Text style={styles.modalBtnText}>Cancelar</Text></TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#0a2a36' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 18, color: '#fff', textAlign: 'center', letterSpacing: 0.5 },
  addBox: {
    backgroundColor: 'rgba(26,35,77,0.98)',
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  addBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addBoxIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  addBoxText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },
  addCircle: {
    backgroundColor: '#eaeaea',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  addCircleText: {
    color: '#232c5c',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 44,
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#7bb1c7',
    marginVertical: 12,
    marginHorizontal: 2,
  },
  goalBox: {
    backgroundColor: 'rgba(26,35,77,0.98)',
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  goalBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  goalName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },
  goalActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginLeft: 12,
  },
  actionImg: {
    width: 28,
    height: 28,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,42,54,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: 'rgba(26,35,77,0.98)',
    borderRadius: 18,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#232c5c',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#7bb1c7',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  modalBtn: {
    backgroundColor: '#00b894',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 4,
    minWidth: 110,
    alignItems: 'center',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  emojiList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emojiBtn: {
    padding: 8,
    margin: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(35,44,92,0.5)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  emojiBtnSelected: {
    backgroundColor: '#00e6a0',
    borderColor: '#fff',
  },
  emojiText: {
    fontSize: 28,
  },
});

export default GoalsScreen;
