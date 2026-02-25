import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { Workout, WorkoutType } from '../types/workout';
import { Sparkles, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { formatDateToFR } from '../utils/date';
import { TYPE_COLORS, TYPE_ICONS } from '../constants/WorkoutStyles';

interface WorkoutCardProps {
    workout: Workout;
    onPress?: () => void;
}


export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
    const router = useRouter();
    const Icon = TYPE_ICONS[workout.type] || Activity;
    const color = TYPE_COLORS[workout.type] || '#ccc';

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push(`/workout/${workout.id}`);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: color }]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{workout.title}</Text>
                    {workout.isAIGenerated && (
                        <Sparkles size={14} color="#8b5cf6" style={styles.aiIcon} />
                    )}
                </View>
                <Icon size={20} color={color} />
            </View>

            <Text style={styles.description} numberOfLines={2}>
                {workout.description}
            </Text>

            <View style={styles.footer}>
                <Text style={styles.date}>{formatDateToFR(workout.date)}</Text>
                <View style={[styles.badge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.badgeText, { color }]}>{workout.type}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        borderLeftWidth: 6,
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    aiIcon: {
        marginLeft: 8,
    },
    description: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 15,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        textTransform: 'uppercase',
    },
});
