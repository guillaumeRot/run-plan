import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkouts } from '@/context/WorkoutContext';
import { ArrowLeft, Sparkles, Activity } from 'lucide-react-native';
import { formatDateToFR } from '@/utils/date';
import { TYPE_COLORS, TYPE_ICONS } from '@/constants/WorkoutStyles';


export default function WorkoutDetailScreen() {
    const { id } = useLocalSearchParams();
    const { workouts } = useWorkouts();
    const router = useRouter();

    const workout = workouts.find((w) => w.id === id);

    if (!workout) {
        return (
            <View style={styles.container}>
                <Text>Séance non trouvée.</Text>
            </View>
        );
    }

    const Icon = TYPE_ICONS[workout.type] || Activity;
    const color = TYPE_COLORS[workout.type] || '#ccc';

    return (
        <View style={styles.container}>
            <View style={[styles.header, { backgroundColor: color }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Icon color="#fff" size={48} style={styles.headerIcon} />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{workout.title}</Text>
                    {workout.isAIGenerated && (
                        <View style={styles.aiBadge}>
                            <Sparkles size={12} color="#fff" />
                            <Text style={styles.aiBadgeText}>Suggéré par l'IA</Text>
                        </View>
                    )}
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Aperçu</Text>
                    <Text style={styles.description}>{workout.description}</Text>
                    <View style={styles.infoRow}>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoLabel}>Date</Text>
                            <Text style={styles.infoValue}>{formatDateToFR(workout.date)}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoLabel}>Type</Text>
                            <Text style={styles.infoValue}>{workout.type}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Détails de la séance</Text>
                    {workout.segments.length > 0 ? (
                        workout.segments.map((segment, index) => (
                            <View key={segment.id} style={styles.segmentCard}>
                                <View style={[styles.segmentType, { backgroundColor: color + '20' }]}>
                                    <Text style={[styles.segmentTypeText, { color }]}>{segment.type}</Text>
                                </View>
                                <Text style={styles.segmentDescription}>{segment.description}</Text>
                                <View style={styles.segmentFooter}>
                                    {segment.duration && <Text style={styles.segmentMetric}>Durée: {segment.duration}</Text>}
                                    {segment.distance && <Text style={styles.segmentMetric}>Distance: {segment.distance}</Text>}
                                    {segment.intensity && <Text style={styles.segmentMetric}>Intensité: {segment.intensity}</Text>}
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptySegments}>Aucun détail fourni pour cette séance.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    headerIcon: {
        marginBottom: 16,
    },
    headerTextContainer: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        color: '#fff',
        textAlign: 'center',
    },
    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
    },
    aiBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        marginLeft: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        color: '#1f2937',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#4b5563',
        lineHeight: 24,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 12,
    },
    infoBox: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 12,
        borderRadius: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        color: '#374151',
    },
    segmentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    segmentType: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 8,
    },
    segmentTypeText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    segmentDescription: {
        fontSize: 16,
        color: '#1f2937',
        marginBottom: 8,
    },
    segmentFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    segmentMetric: {
        fontSize: 12,
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    emptySegments: {
        color: '#9ca3af',
        fontStyle: 'italic',
    },
});
