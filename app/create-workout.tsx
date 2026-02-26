import { SegmentItem } from '@/components/SegmentItem';
import { SEGMENT_COLORS } from '@/constants/WorkoutStyles';
import { useWorkouts } from '@/context/WorkoutContext';
import { SegmentType, WorkoutSegment, WorkoutType } from '@/types/workout';
import { useRouter } from 'expo-router';
import { X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// End of local SegmentItem removal


export default function CreateWorkoutScreen() {
    const router = useRouter();
    const { addWorkout } = useWorkouts();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<WorkoutType>('EF');
    const { draftSegments, setDraftSegments } = useWorkouts();

    const handlePressSegment = (seg: WorkoutSegment) => {
        router.push({ pathname: '/edit-segment', params: { id: seg.id } });
    };

    const handleAddSegment = (stype: SegmentType) => {
        // Validation rules
        if (stype === 'warmup' && draftSegments.some(s => s.type === 'warmup')) {
            Alert.alert('Règle', 'Un seul échauffement est autorisé par séance.');
            return;
        }
        if (stype === 'cooldown' && draftSegments.some(s => s.type === 'cooldown')) {
            Alert.alert('Règle', 'Un seul retour au calme est autorisé par séance.');
            return;
        }

        const newSegment: WorkoutSegment = {
            id: Math.random().toString(),
            type: stype,
            targetBasis: stype === 'repeat' ? undefined : 'time',
            targetValue: stype === 'repeat' ? undefined : 600,
            intensityType: stype === 'repeat' ? undefined : 'none',
            repeatCount: stype === 'repeat' ? 1 : undefined,
            subSegments: stype === 'repeat' ? [] : undefined,
        };

        const newSegments = [...draftSegments];

        if (stype === 'warmup') {
            newSegments.unshift(newSegment);
        } else if (stype === 'cooldown') {
            newSegments.push(newSegment);
        } else {
            const cooldownIdx = newSegments.findIndex(s => s.type === 'cooldown');
            if (cooldownIdx !== -1) {
                newSegments.splice(cooldownIdx, 0, newSegment);
            } else {
                newSegments.push(newSegment);
            }
        }

        setDraftSegments(newSegments);
        router.push({ pathname: '/edit-segment', params: { id: newSegment.id } });
    };

    const handleRemoveSegment = (id: string) => {
        const removeRecursive = (list: WorkoutSegment[]): WorkoutSegment[] => {
            return list
                .filter(s => s.id !== id)
                .map(s => s.subSegments ? { ...s, subSegments: removeRecursive(s.subSegments) } : s);
        };
        setDraftSegments(removeRecursive(draftSegments));
    };

    const handleCreate = () => {
        if (!title) {
            Alert.alert('Erreur', 'Veuillez donner un titre à votre séance.');
            return;
        }

        addWorkout({
            id: Math.random().toString(),
            title,
            description: '',
            date,
            type,
            segments: draftSegments,
            isAIGenerated: false,
        });

        setDraftSegments([]); // Clear draft
        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <X color="#111827" size={24} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <TextInput
                            style={styles.headerInput}
                            placeholder="Nom de l'entraînement"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#94A3B8"
                        />
                        <Text style={styles.headerDate}>{date}</Text>
                    </View>
                    <TouchableOpacity onPress={handleCreate} style={styles.saveBtn}>
                        <Text style={styles.saveBtnText}>Enregistrer</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
                    {draftSegments.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Zap size={48} color="#E2E8F0" />
                            <Text style={styles.emptyText}>Commencez à construire votre séance</Text>
                        </View>
                    ) : (
                        draftSegments.map(s => (
                            <SegmentItem
                                key={s.id}
                                segment={s}
                                onPress={handlePressSegment}
                                onRemove={handleRemoveSegment}
                                depth={0}
                            />
                        ))
                    )}

                    <View style={styles.addActions}>
                        <Text style={styles.addLabel}>Ajouter un élément</Text>
                        <View style={styles.actionGrid}>
                            <TouchableOpacity style={[styles.addBtn, { borderColor: SEGMENT_COLORS.warmup }]} onPress={() => handleAddSegment('warmup')}>
                                <Text style={[styles.addBtnText, { color: SEGMENT_COLORS.warmup }]}>Échauffement</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.addBtn, { borderColor: SEGMENT_COLORS.run }]} onPress={() => handleAddSegment('run')}>
                                <Text style={[styles.addBtnText, { color: SEGMENT_COLORS.run }]}>Course</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.addBtn, { borderColor: SEGMENT_COLORS.recovery }]} onPress={() => handleAddSegment('recovery')}>
                                <Text style={[styles.addBtnText, { color: SEGMENT_COLORS.recovery }]}>Récupération</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.addBtn, { borderColor: SEGMENT_COLORS.cooldown }]} onPress={() => handleAddSegment('cooldown')}>
                                <Text style={[styles.addBtnText, { color: SEGMENT_COLORS.cooldown }]}>Retour au calme</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.addBtn, { borderColor: SEGMENT_COLORS.repeat }]} onPress={() => handleAddSegment('repeat')}>
                                <Text style={[styles.addBtnText, { color: SEGMENT_COLORS.repeat }]}>Répétition</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
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
    backBtn: {
        padding: 8,
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: 'transparent',
    },
    headerInput: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        fontFamily: 'RobotoMediumItalic',
        padding: 0,
    },
    headerDate: {
        fontSize: 12,
        color: '#64748B',
        fontFamily: 'RobotoMediumItalic',
    },
    saveBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#0066FF',
        borderRadius: 8,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    content: {
        flex: 1,
    },
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
    editCard: {
        backgroundColor: '#FFFFFF',
        marginRight: 16,
        marginTop: 12,
        borderRadius: 12,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1.5,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    editContent: {
        flex: 1,
        padding: 16,
        backgroundColor: 'transparent',
    },
    editHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    editTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    basisButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 8,
    },
    basisButtonSelected: {
        backgroundColor: '#64748B',
        borderColor: '#64748B',
    },
    basisText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    basisTextSelected: {
        color: '#FFFFFF',
    },
    subLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
    },
    intensityButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    intensityButtonSelected: {
        backgroundColor: '#0066FF',
        borderColor: '#0066FF',
    },
    intensityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    intensityTextSelected: {
        color: '#FFFFFF',
    },
    miniLabel: {
        fontSize: 11,
        color: '#94A3B8',
        marginBottom: 4,
    },
    miniInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    nestedContainer: {
        marginTop: 8,
        paddingLeft: 4,
        borderLeftWidth: 1,
        borderLeftColor: '#E2E8F0',
        backgroundColor: '#FCFDFF',
        marginRight: -8, // Compensate for card margin to use full width
    },
    segmentHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: 'transparent',
    },
    addActions: {
        padding: 24,
        backgroundColor: 'transparent',
    },
    addLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 16,
        textAlign: 'center',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    addBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
        backgroundColor: '#FFFFFF',
    },
    addBtnText: {
        fontSize: 13,
        fontWeight: '700',
    },
    emptyState: {
        padding: 60,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    emptyText: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 12,
    },
});
