import { SEGMENT_LABELS, formatSecondsToMMSS } from '@/constants/WorkoutConstants';
import { SEGMENT_COLORS } from '@/constants/WorkoutStyles';
import { WorkoutSegment } from '@/types/workout';
import { Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SegmentItemProps {
    segment: WorkoutSegment;
    onPress: (segment: WorkoutSegment) => void;
    onRemove: (id: string) => void;
    depth: number;
}

export const SegmentItem = ({ segment, onPress, onRemove, depth }: SegmentItemProps) => {
    const color = SEGMENT_COLORS[segment.type];

    const formatTarget = () => {
        if (segment.type === 'repeat') {
            return `${segment.repeatCount}x`;
        }
        if (segment.targetBasis === 'time') {
            const { mins, secs } = formatSecondsToMMSS(segment.targetValue || 0);
            return `${mins}:${secs.toString().padStart(2, '0')} min`;
        } else {
            return `${((segment.targetValue || 0) / 1000).toFixed(2)} km`;
        }
    };

    const formatIntensity = () => {
        if (segment.type === 'repeat') return `${segment.subSegments?.length || 0} éléments`;
        if (segment.intensityType === 'none') return 'Pas de cible';
        if (!segment.intensityTarget) return '-';
        const unit = segment.intensityType === 'pace' ? '/km' : 'bpm';
        return `${segment.intensityTarget.min}-${segment.intensityTarget.max} ${unit}`;
    };

    return (
        <TouchableOpacity style={[styles.segmentCard, { marginLeft: 8 + depth * 6 }]} onPress={() => onPress(segment)}>
            <View style={[styles.segmentIndicator, { backgroundColor: color }]} />
            <View style={[styles.segmentContent, depth > 0 && { padding: 6 }]}>
                <View style={styles.segmentHeaderRow}>
                    <Text style={styles.segmentTypeLabel}>{SEGMENT_LABELS[segment.type]}</Text>
                    <TouchableOpacity onPress={() => onRemove(segment.id)}>
                        <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                </View>
                <View style={styles.segmentMainRow}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValue}>{formatTarget()}</Text>
                        <Text style={styles.metricLabel}>{segment.type === 'repeat' ? 'Répétitions' : (segment.targetBasis === 'time' ? 'Temps' : 'Distance')}</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValue}>{formatIntensity()}</Text>
                        <Text style={styles.metricLabel}>{segment.type === 'repeat' ? 'Contenu' : 'Objectif'}</Text>
                    </View>
                </View>
                {segment.type === 'repeat' && segment.subSegments && segment.subSegments.length > 0 && (
                    <View style={styles.nestedContainer}>
                        {segment.subSegments.map((ss) => (
                            <SegmentItem
                                key={ss.id}
                                segment={ss}
                                onPress={onPress}
                                onRemove={onRemove}
                                depth={depth + 1}
                            />
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    segmentCard: {
        backgroundColor: '#FFFFFF',
        marginRight: 8,
        marginTop: 8,
        borderRadius: 12,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    segmentIndicator: {
        width: 4,
    },
    segmentContent: {
        flex: 1,
        padding: 10,
        backgroundColor: 'transparent',
    },
    segmentHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: 'transparent',
    },
    segmentTypeLabel: {
        fontSize: 11,
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '600',
        marginBottom: 4,
    },
    segmentMainRow: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    metricItem: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    metricLabel: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 1,
    },
    nestedContainer: {
        marginTop: 8,
        paddingLeft: 4,
        borderLeftWidth: 1,
        borderLeftColor: '#E2E8F0',
        backgroundColor: '#FCFDFF',
        marginRight: -8,
    },
});
