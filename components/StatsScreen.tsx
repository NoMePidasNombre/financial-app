import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useBrainyPocketsIntro } from './useBrainyPocketsIntro';
import BottomMenu from './BottomMenu';

const { width, height } = Dimensions.get('window');

export type RootStackParamList = {
  Home: undefined;
  Goals: undefined;
  TransactionHistory: undefined;
  Stats: { autoRedirect?: boolean } | undefined;
  ProfileSelection: undefined;
};

export default function StatsScreen(props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // Eliminar lógica de intro automática
  // Solo mostrar la intro si se navega explícitamente a esta pantalla
  const { showIntro, markSeen } = useBrainyPocketsIntro();

  // No redireccionar automáticamente
  // ...existing code...
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{' Volver'}</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>Brainy Pockets</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ width: '100%' }}>
        <Text style={styles.desc}>
          ¿Querés mejorar tu salud financiera y tomar mejores decisiones con tu dinero?{"\n\n"}
          En Brainy Pockets analizamos tus ingresos y te ayudamos a decidir cuánto destinar a cada categoría, para que puedas alcanzar tus metas y disfrutar del presente sin descuidar tu futuro.
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>
          <Text style={styles.sectionText}>
            1. Te ayudamos a identificar tus gastos fijos, de ocio y de inversión/ahorro.{"\n"}
            2. Te sugerimos un perfil financiero según tus preferencias y objetivos.{"\n"}
            3. Podrás visualizar y ajustar tus metas, y ver tu progreso mes a mes.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías principales:</Text>
          <View style={styles.bulletRow}><Text style={styles.bullet}>🏠</Text><Text style={styles.bold}> Gastos fijos</Text><Text style={styles.normal}> (alquiler, servicios, comida básica)</Text></View>
          <View style={styles.bulletRow}><Text style={styles.bullet}>🎉</Text><Text style={styles.bold}> Ocio</Text><Text style={styles.normal}> (salidas, hobbies, streaming)</Text></View>
          <View style={styles.bulletRow}><Text style={styles.bold}>💰</Text><Text style={styles.bold}> Inversión o ahorro</Text><Text style={styles.normal}> (para el futuro)</Text></View>
        </View>
        <Text style={styles.desc}>¡Vos elegís el perfil que más te identifique y la app te acompaña en el proceso!</Text>
        <TouchableOpacity style={styles.startBtn} onPress={async () => { await markSeen(); navigation.navigate('ProfileSelection'); }}>
          <Text style={styles.startText}>Comenzar</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* No mostrar menú inferior ni superior aquí */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003049',
    alignItems: 'center',
    paddingTop: height * 0.06,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginBottom: 18,
    marginTop: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#013a63',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    width: '90%',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#00b4d8',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  desc: {
    color: '#fff',
    fontSize: 17,
    marginBottom: 18,
    textAlign: 'center',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 18,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  sectionTitle: {
    color: '#00b4d8',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'left',
  },
  sectionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    maxWidth: width * 0.92,
  },
  bullet: {
    fontSize: 20,
    marginRight: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  normal: {
    color: '#fff',
    fontSize: 16,
  },
  startBtn: {
    backgroundColor: '#2196f3',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 54,
    marginTop: 24,
    alignSelf: 'center',
  },
  startText: {
    color: '#fff',
    fontSize: 21,
    fontWeight: 'bold',
  },
});
