import { Text, View } from '@/components/Themed';
import { SEGMENT_COLORS, TYPE_COLORS, TYPE_ICONS } from '@/constants/WorkoutStyles';
import { useWorkouts } from '@/context/WorkoutContext';
import { SegmentType, WorkoutSegment } from '@/types/workout';
import { formatDateToFR } from '@/utils/date';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, ArrowLeft, Repeat, Sparkles } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const SEGMENT_LABELS: Record<string, string> = {
    warmup: 'Échauffement',
    run: 'Course à pied',
    recovery: 'Récupération',
    cooldown: 'Retour au calme',
    repeat: 'Répétition',
};

const renderSegmentsRecursive = (segments: WorkoutSegment[], color: string, depth = 0) => {
    return segments.map((segment) => {
        const segmentColor = SEGMENT_COLORS[segment.type as SegmentType] || color;

        if (segment.type === 'repeat') {
            return (
                <View key={segment.id} style={[styles.repeatContainer, { marginLeft: depth * 12, borderColor: SEGMENT_COLORS.repeat }]}>
                    <View style={styles.repeatHeader}>
                        <Repeat size={14} color={SEGMENT_COLORS.repeat} />
                        <Text style={styles.repeatTitle}>{segment.repeatCount}x Répétitions</Text>
                    </View>
                    <View style={styles.repeatContent}>
                        {renderSegmentsRecursive(segment.subSegments || [], color, depth + 1)}
                    </View>
                </View>
            );
        }

        const targetValue = segment.targetValue || 0;
        const target = segment.targetBasis === 'time'
            ? `${Math.floor(targetValue / 60)}:${(targetValue % 60).toString().padStart(2, '0')}`
            : `${(targetValue / 1000).toFixed(2)} km`;

        const intensity = segment.intensityType === 'none' || !segment.intensityType ? 'Pas de cible' :
            `${segment.intensityTarget?.min}-${segment.intensityTarget?.max} ${segment.intensityType === 'pace' ? '/km' : 'bpm'}`;

        return (
            <View key={segment.id} style={[styles.segmentCard, { marginLeft: depth * 12 }]}>
                <View style={[styles.segmentType, { backgroundColor: segmentColor + '20' }]}>
                    <Text style={[styles.segmentTypeText, { color: segmentColor }]}>{SEGMENT_LABELS[segment.type] || segment.type}</Text>
                </View>
                <View style={styles.segmentDetails}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValue}>{target}</Text>
                        <Text style={styles.metricLabel}>{segment.targetBasis === 'time' ? 'Temps' : 'Distance'}</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValue}>{intensity}</Text>
                        <Text style={styles.metricLabel}>Intensité</Text>
                    </View>
                </View>
            </View>
        );
    });
};

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
                        <View style={{ backgroundColor: 'transparent' }}>
                            {renderSegmentsRecursive(workout.segments, color)}
                        </View>
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
    segmentDetails: {
        flexDirection: 'row',
        marginTop: 8,
        backgroundColor: 'transparent',
    },
    metricItem: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    metricLabel: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 2,
    },
    repeatContainer: {
        marginTop: 12,
        borderLeftWidth: 3,
        paddingLeft: 12,
        backgroundColor: 'transparent',
        marginBottom: 12,
    },
    repeatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
        backgroundColor: 'transparent',
    },
    repeatTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#F59E0B',
    },
    repeatContent: {
        backgroundColor: 'transparent',
    },
    emptySegments: {
        color: '#9ca3af',
        fontStyle: 'italic',
    },
});
