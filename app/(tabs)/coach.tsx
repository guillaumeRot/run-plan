import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Sparkles, Zap, Activity, TrendingUp, Map, Plus } from 'lucide-react-native';
import { WorkoutType, Workout } from '../../types/workout';
import { WorkoutCard } from '../../components/WorkoutCard';
import { useWorkouts } from '../../context/WorkoutContext';

const SESSION_TYPES: { type: WorkoutType; label: string; icon: any; color: string }[] = [
    { type: 'VMA', label: 'Short VMA', icon: Zap, color: '#f87171' },
    { type: 'Threshold', label: 'Threshold', icon: TrendingUp, color: '#fbbf24' },
    { type: 'EF', label: 'Easy Run', icon: Activity, color: '#34d399' },
    { type: 'Long Run', label: 'Long Run', icon: Map, color: '#60a5fa' },
];

export default function CoachScreen() {
    const { addWorkout } = useWorkouts();
    const [suggestion, setSuggestion] = useState<Workout | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateWorkout = (type: WorkoutType) => {
        setIsGenerating(true);
        // Simulate AI generation delay
        setTimeout(() => {
            const newSuggestion: Workout = {
                id: Math.random().toString(),
                title: `Suggested ${type} Session`,
                description: `Customized ${type} workout based on your profile.`,
                date: new Date().toISOString().split('T')[0],
                type: type,
                isAIGenerated: true,
                segments: [], // Simplified for MVP
            };
            setSuggestion(newSuggestion);
            setIsGenerating(false);
        }, 1000);
    };

    const handleAddToCalendar = () => {
        if (suggestion) {
            addWorkout(suggestion);
            setSuggestion(null);
            // In a real app, we would show a success toast
            alert('Workout added to your calendar!');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Sparkles size={24} color="#8b5cf6" />
                <Text style={styles.title}>AI Running Coach</Text>
            </View>

            <Text style={styles.subtitle}>Choose a session type to generate a training plan.</Text>

            <View style={styles.grid}>
                {SESSION_TYPES.map((item) => (
                    <TouchableOpacity
                        key={item.type}
                        style={[styles.button, { backgroundColor: item.color + '15' }]}
                        onPress={() => generateWorkout(item.type)}
                        disabled={isGenerating}
                    >
                        <item.icon size={28} color={item.color} />
                        <Text style={[styles.buttonLabel, { color: item.color }]}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.suggestionContainer}>
                {isGenerating ? (
                    <View style={styles.loading}>
                        <Text style={styles.loadingText}>Generating your session...</Text>
                    </View>
                ) : suggestion ? (
                    <View style={styles.cardContainer}>
                        <Text style={styles.sectionTitle}>Your Personalized Suggestion</Text>
                        <WorkoutCard workout={suggestion} />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddToCalendar}>
                            <Plus size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Add to Calendar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Tap a session type above to get started.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#1e40af',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    button: {
        width: '48%',
        aspectRatio: 1.2,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    buttonLabel: {
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 14,
    },
    suggestionContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#374151',
        backgroundColor: 'transparent',
    },
    cardContainer: {
        backgroundColor: 'transparent',
    },
    loading: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'transparent',
    },
    loadingText: {
        color: '#8b5cf6',
        fontWeight: '600',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
        backgroundColor: 'transparent',
    },
    placeholderText: {
        color: '#9ca3af',
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#1e40af',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 12,
        marginTop: 16,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
