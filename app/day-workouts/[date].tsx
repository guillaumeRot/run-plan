import { Text, View } from '@/components/Themed';
import { TYPE_COLORS, TYPE_ICONS } from '@/constants/WorkoutStyles';
import { useWorkouts } from '@/context/WorkoutContext';
import { formatDateToFR } from '@/utils/date';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, ArrowLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function DayWorkoutsScreen() {
    const { date } = useLocalSearchParams();
    const { workouts } = useWorkouts();
    const router = useRouter();

    const dayWorkouts = workouts.filter((w) => w.date === date);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color="#111827" size={24} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Séances</Text>
                    <Text style={styles.headerSubtitle}>{formatDateToFR(date as string)}</Text>
                </View>
            </View>

            <FlatList
                data={dayWorkouts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucune séance programmée pour ce jour.</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const Icon = TYPE_ICONS[item.type] || Activity;
                    const color = TYPE_COLORS[item.type] || '#ccc';

                    return (
                        <TouchableOpacity
                            style={styles.workoutCard}
                            onPress={() => router.push({ pathname: '/workout/[id]', params: { id: item.id } })}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                                <Icon size={24} color={color} />
                            </View>
                            <View style={styles.workoutInfo}>
                                <Text style={styles.workoutTitle}>{item.title}</Text>
                                <Text style={styles.workoutType}>{item.type}</Text>
                            </View>
                            <ChevronRight size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        padding: 8,
        marginRight: 10,
    },
    headerTitleContainer: {
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        fontFamily: 'RobotoMediumItalic',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
        fontFamily: 'RobotoMediumItalic',
    },
    listContent: {
        padding: 20,
    },
    workoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    workoutInfo: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    workoutTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        fontFamily: 'RobotoMediumItalic',
    },
    workoutType: {
        fontSize: 13,
        color: '#64748B',
        fontFamily: 'RobotoMediumItalic',
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 100,
        backgroundColor: 'transparent',
    },
    emptyText: {
        fontSize: 16,
        color: '#94A3B8',
        fontFamily: 'RobotoMediumItalic',
        textAlign: 'center',
    },
});
