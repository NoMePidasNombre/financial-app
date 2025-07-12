import React from 'react';
import { View, Text } from 'react-native';

export default function GoalsCard({ styles }: { styles: any }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.titulo, { textAlign: 'center' }]}>Metas</Text>
      <View style={styles.goalRowContainer}>
        <View style={styles.goalRow}>
          <Text style={styles.goalIcon}>🐖</Text>
          <Text style={styles.goalText}>Inversión</Text>
          <View style={styles.goalProgressBarBackground}>
            <View style={[styles.goalProgressBar, { width: '75%' }]} />
          </View>
        </View>
        <Text style={styles.goalProgressValue}>75000/100000</Text>
      </View>
      <View style={styles.goalRowContainer}>
        <View style={styles.goalRow}>
          <Text style={styles.goalIcon}>🏖️</Text>
          <Text style={styles.goalText}>Vacaciones</Text>
          <View style={styles.goalProgressBarBackground}>
            <View style={[styles.goalProgressBar, { width: '50%' }]} />
          </View>
        </View>
        <Text style={styles.goalProgressValue}>50000/100000</Text>
      </View>
    </View>
  );
}
