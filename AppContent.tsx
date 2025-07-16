import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = {
    settings: require('./assets/icons/settings.png'), // engranaje
    notifications: require('./assets/icons/notifications.png'), // campana
    history: require('./assets/icons/history.png'), // reloj
    profile: require('./assets/icons/profile.png'), // usuario
    home: require('./assets/icons/home.png'), // home
    goals: require('./assets/icons/goals.png'), // trofeo
    plus: require('./assets/icons/plus.png'), // más (centro)
    stats: require('./assets/icons/graphs.png'), // estadisticas
    list: require('./assets/icons/calculate.png'), // lista
};
const BG = require('./assets/icons/brain-outline.png');

export default function AppContent({ saldo, gastos, usuario = 'USER123', onAddPress, onHistoryPress, goals = [], onGoalsPress }) {
    const isDarkMode = useColorScheme() === 'dark';
    const insets = useSafeAreaInsets();
    const { width, height } = Dimensions.get('window');

    const topIcons = [
        { icon: ICONS.settings, key: 'settings' },
        { icon: ICONS.notifications, key: 'notifications' },
        { icon: ICONS.history, key: 'history' },
        { icon: ICONS.profile, key: 'profile' },
    ];
    const bottomIcons = [
        { icon: ICONS.home, key: 'home' },
        { icon: ICONS.goals, key: 'goals' },
        { icon: ICONS.plus, key: 'plus' },
        { icon: ICONS.stats, key: 'stats' },
        { icon: ICONS.list, key: 'list' },
    ];

    function handleTopMenuPress(idx) {
        if (idx === 2) {
            if (onHistoryPress) {
                onHistoryPress();
            } else {
                Alert.alert('Handler no asignado', 'No se pasó onHistoryPress al componente.');
            }
        }
    }
    function handleBottomMenuPress(idx) {
        if (idx === 1) {
            if (onGoalsPress) {
                onGoalsPress();
            }
        } else if (idx === 2) {
            if (onAddPress) {
                onAddPress();
            } else {
                Alert.alert('Handler no asignado', 'No se pasó onAddPress al componente.');
            }
        }
    }

    // Estilos dependientes de dimensiones
    const bgWatermarkStyle = {
        position: "absolute" as const,
        opacity: 0.08,
        zIndex: 0,
        width: width * 0.7,
        height: width * 0.7,
        top: height * 0.18,
        left: width * 0.15,
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0a2a36' }}>
            {/* Marca de agua */}
            <Image source={BG} style={bgWatermarkStyle} resizeMode="contain" />
            <SafeAreaView style={styles.safeAreaBg}>
                {/* Contenido principal - TopMenu ahora es global */}
                <View style={[styles.content, { paddingTop: 70 + insets.top, paddingBottom: 80 + insets.bottom }]}>
                    <Text style={styles.bienvenida}>BIENVENIDO {usuario}</Text>
                    <View style={styles.cardDatos}>
                        <Text style={styles.tituloCard}>Datos Mensuales</Text>
                        <View style={styles.filaDatos}>
                            <Text style={styles.labelDatos}>Dinero disponible</Text>
                            <Text style={styles.saldoDatos}>${saldo?.toLocaleString('es-AR', { minimumFractionDigits: 3 })}</Text>
                        </View>
                        <View style={styles.filaDatos}>
                            <Text style={styles.labelDatos}>Gastos</Text>
                            <Text style={styles.gastosDatos}>${gastos?.toLocaleString('es-AR', { minimumFractionDigits: 3 })}</Text>
                        </View>
                    </View>
                    <View style={styles.cardMetas}>
                        <Text style={styles.tituloCard}>METAS</Text>
                        {goals.slice(-3).reverse().map((goal, idx) => {
                            const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);
                            return (
                                <View key={goal.id} style={styles.metaBoxFilled}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <Text style={styles.metaEmoji}>{goal.emoji}</Text>
                                        <Text style={styles.metaNombre}>{goal.name}</Text>
                                        <Text style={styles.metaDineroFalta}>${(goal.targetAmount - goal.currentAmount).toLocaleString('es-AR', { minimumFractionDigits: 0 })} faltan</Text>
                                    </View>
                                    <View style={styles.metaBarBg}>
                                        <View style={[styles.metaBar, { width: `${progress * 100}%` }]} />
                                    </View>
                                </View>
                            );
                        })}
                        {goals.length === 0 && (
                            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 8 }}>No tienes metas creadas.</Text>
                        )}
                    </View>
                </View>
                {/* Menú inferior eliminado, ahora es global en MainApp */}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeAreaBg: {
        flex: 1,
        backgroundColor: 'rgba(10,42,54,0.85)', // fallback overlay
    },
    content: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
    },
    bienvenida: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 24,
        marginTop: 16,
        letterSpacing: 1,
        textAlign: 'center',
    },
    cardDatos: {
        backgroundColor: 'rgba(26,35,77,0.95)',
        borderRadius: 12,
        padding: 18,
        marginBottom: 32,
        width: '90%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#232c5c',
    },
    tituloCard: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 12,
        textAlign: 'center',
    },
    filaDatos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#232c5c',
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 12,
        width: '95%',
    },
    labelDatos: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    saldoDatos: {
        color: '#00b894',
        fontSize: 18,
        fontWeight: 'bold',
    },
    gastosDatos: {
        color: '#e74c3c',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardMetas: {
        backgroundColor: 'rgba(26,35,77,0.98)',
        borderRadius: 18,
        padding: 22,
        width: '92%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#232c5c',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 24,
    },
    metaBoxFilled: {
        backgroundColor: 'rgba(35,44,92,0.92)',
        borderWidth: 1.5,
        borderColor: '#2e3a5c',
        borderRadius: 10,
        width: '98%',
        marginVertical: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        elevation: 2,
    },
    metaEmoji: {
        fontSize: 26,
        marginRight: 10,
        marginLeft: 2,
    },
    metaNombre: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        flex: 1,
        letterSpacing: 0.2,
    },
    metaDineroFalta: {
        color: '#00e6a0',
        fontSize: 15,
        marginLeft: 10,
        fontWeight: '500',
    },
    metaBarBg: {
        backgroundColor: '#232c5c',
        borderRadius: 6,
        height: 10,
        width: '100%',
        marginTop: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1a234d',
    },
    metaBar: {
        backgroundColor: '#00e6a0',
        height: 10,
        borderRadius: 6,
    },
    bottomMenu: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(26,35,77,0.95)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 2,
        borderTopColor: '#232c5c',
        zIndex: 10,
    },
    bottomIconBtn: {
        flex: 1,
        alignItems: 'center',
    },
    bottomIcon: {
        width: 32,
        height: 32,
        tintColor: '#fff',
    },
    centerBtn: {
        backgroundColor: '#fff',
        borderRadius: 32,
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -24,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },
    centerIcon: {
        width: 36,
        height: 36,
        tintColor: '#1a234d',
    },
});
