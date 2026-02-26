import { Text, View } from '@/components/Themed';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

export default function ConnectivityScreen() {
    const router = useRouter();
    const [garminConnected, setGarminConnected] = React.useState(false);
    const [stravaConnected, setStravaConnected] = React.useState(false);

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Connectivité',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                            <ChevronLeft size={24} color="#0066FF" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.introSection}>
                    <Text style={styles.introText}>
                        Synchronisez vos séances d'entraînement avec vos plateformes préférées pour une analyse plus poussée.
                    </Text>
                </View>

                <View style={styles.serviceBox}>
                    <View style={styles.serviceHeader}>
                        <View style={styles.logoPlaceholder}>
                            <Text style={styles.garminColor}>GARMIN</Text>
                        </View>
                        <Switch
                            value={garminConnected}
                            onValueChange={setGarminConnected}
                            trackColor={{ false: '#CBD5E1', true: '#0066FF' }}
                        />
                    </View>
                    <Text style={styles.serviceName}>Garmin Connect</Text>
                    <Text style={styles.serviceDesc}>
                        Importez automatiquement vos activités réalisées avec votre montre Garmin.
                    </Text>
                </View>

                <View style={styles.serviceBox}>
                    <View style={styles.serviceHeader}>
                        <View style={styles.logoPlaceholder}>
                            <Text style={styles.stravaColor}>STRAVA</Text>
                        </View>
                        <Switch
                            value={stravaConnected}
                            onValueChange={setStravaConnected}
                            trackColor={{ false: '#CBD5E1', true: '#FC4C02' }}
                        />
                    </View>
                    <Text style={styles.serviceName}>Strava</Text>
                    <Text style={styles.serviceDesc}>
                        Publiez vos entraînements planifiés sur Strava et récupérez vos données réelles.
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <ShieldCheck size={20} color="#059669" />
                    <Text style={styles.infoText}>
                        Vos données sont protégées et ne sont utilisées que pour optimiser votre plan d'entraînement.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        padding: 20,
    },
    introSection: {
        marginBottom: 24,
        backgroundColor: 'transparent',
    },
    introText: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
    },
    serviceBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: 'transparent',
    },
    logoPlaceholder: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    garminColor: {
        fontWeight: '900',
        color: '#000000',
        letterSpacing: 1,
    },
    stravaColor: {
        fontWeight: '900',
        color: '#FC4C02',
        letterSpacing: 1,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    serviceDesc: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#ECFDF5',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 13,
        color: '#065F46',
        lineHeight: 18,
    },
});
