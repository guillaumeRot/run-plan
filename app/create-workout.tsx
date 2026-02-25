import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { useWorkouts } from '@/context/WorkoutContext';
import { WorkoutType } from '@/types/workout';
import { X } from 'lucide-react-native';
import { SESSION_TYPES } from '@/constants/WorkoutStyles';


export default function CreateWorkoutScreen() {
    const router = useRouter();
    const { addWorkout } = useWorkouts();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<WorkoutType>('EF');

    const handleCreate = () => {
        if (!title || !description) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        addWorkout({
            id: Math.random().toString(),
            title,
            description,
            date,
            type,
            isAIGenerated: false,
            segments: [],
        });

        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Nouvelle Séance</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X color="#0066FF" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
                <Text style={styles.label}>Titre</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ex: Sortie matinale"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Quel est le programme ?"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>Date (JJ/MM/AAAA)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="24/02/2026"
                    value={date}
                    onChangeText={setDate}
                />

                <Text style={styles.label}>Type de séance</Text>
                <View style={styles.typeGrid}>
                    {SESSION_TYPES.map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[
                                styles.typeButton,
                                type === t && styles.typeButtonSelected
                            ]}
                            onPress={() => setType(t)}
                        >
                            <Text style={[
                                styles.typeButtonText,
                                type === t && styles.typeButtonTextSelected
                            ]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
                    <Text style={styles.submitButtonText}>Créer la séance</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    closeButton: {
        padding: 5,
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
        marginTop: 20,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    typeButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    typeButtonSelected: {
        backgroundColor: '#0066FF',
        borderColor: '#0066FF',
    },
    typeButtonText: {
        color: '#64748B',
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        fontSize: 14,
    },
    typeButtonTextSelected: {
        color: '#FFFFFF',
    },
    submitButton: {
        backgroundColor: '#0066FF',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 60,
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontWeight: '500',
        fontFamily: 'RobotoMediumItalic',
        fontSize: 18,
        textTransform: 'uppercase',
    },
});
