import { Text, View } from '@/components/Themed';
import { SEGMENT_COLORS } from '@/constants/WorkoutStyles';
import { useWorkouts } from '@/context/WorkoutContext';
import { IntensityType, SegmentType, TargetBasis, WorkoutSegment, WorkoutType } from '@/types/workout';
import { useRouter } from 'expo-router';
import { Clock, MapPin, Plus, Trash2, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const SEGMENT_LABELS: Record<SegmentType, string> = {
    warmup: 'Échauffement',
    run: 'Course à pied',
    recovery: 'Récupération',
    cooldown: 'Retour au calme',
    repeat: 'Répétition',
};

const formatSecondsToMMSS = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return { mins, secs };
};

interface SegmentItemProps {
    segment: WorkoutSegment;
    isEditing: boolean;
    onEdit: () => void;
    onUpdate: (updated: WorkoutSegment) => void;
    onRemove: () => void;
    depth: number;
}

const SegmentItem = ({ segment, isEditing, onEdit, onUpdate, onRemove, depth }: SegmentItemProps) => {
    const color = SEGMENT_COLORS[segment.type];

    const formatTarget = () => {
        if (segment.type === 'repeat') {
            return `${segment.repeatCount}x`;
        }
        if (segment.targetBasis === 'time') {
            const { mins, secs } = formatSecondsToMMSS(segment.targetValue || 0);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
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

    const handleDurationChange = (type: 'mins' | 'secs', value: string) => {
        const currentVal = formatSecondsToMMSS(segment.targetValue || 0);
        const newVal = parseInt(value) || 0;
        const total = type === 'mins' ? newVal * 60 + currentVal.secs : currentVal.mins * 60 + newVal;
        onUpdate({ ...segment, targetValue: total });
    };

    if (!isEditing) {
        return (
            <TouchableOpacity style={[styles.segmentCard, { marginLeft: 16 + depth * 12 }]} onPress={onEdit}>
                <View style={[styles.segmentIndicator, { backgroundColor: color }]} />
                <View style={styles.segmentContent}>
                    <Text style={styles.segmentTypeLabel}>{SEGMENT_LABELS[segment.type]}</Text>
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
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.editCard, { marginLeft: 16 + depth * 12, borderColor: segment.type === 'repeat' ? SEGMENT_COLORS.repeat : '#0066FF' }]}>
            <View style={[styles.segmentIndicator, { backgroundColor: color }]} />
            <View style={styles.editContent}>
                <View style={styles.editHeader}>
                    <Text style={styles.editTitle}>{SEGMENT_LABELS[segment.type]}</Text>
                    <TouchableOpacity onPress={onRemove}>
                        <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                {segment.type === 'repeat' ? (
                    <>
                        <Text style={styles.subLabel}>Nombre de répétitions</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            defaultValue={(segment.repeatCount || 1).toString()}
                            onChangeText={(v) => onUpdate({ ...segment, repeatCount: parseInt(v) || 1 })}
                        />
                        <View style={styles.nestedContainer}>
                            {segment.subSegments?.map((ss, idx) => (
                                <SegmentItem
                                    key={ss.id}
                                    segment={ss}
                                    isEditing={false} // Always show summary in nested view until clicked
                                    onEdit={onEdit} // In this simple UX, clicking sub-segment also triggers main edit
                                    onUpdate={(updated) => {
                                        const newSub = [...(segment.subSegments || [])];
                                        newSub[idx] = updated;
                                        onUpdate({ ...segment, subSegments: newSub });
                                    }}
                                    onRemove={() => {
                                        const newSub = (segment.subSegments || []).filter((_, i) => i !== idx);
                                        onUpdate({ ...segment, subSegments: newSub });
                                    }}
                                    depth={depth + 1}
                                />
                            ))}
                            {depth < 1 && ( // Max depth 2 (level 0 and 1)
                                <TouchableOpacity
                                    style={styles.addNestedBtn}
                                    onPress={() => {
                                        const newSub = [...(segment.subSegments || []), {
                                            id: Math.random().toString(),
                                            type: 'run' as SegmentType,
                                            targetBasis: 'time' as TargetBasis,
                                            targetValue: 60,
                                            intensityType: 'none' as IntensityType,
                                        } as WorkoutSegment];
                                        onUpdate({ ...segment, subSegments: newSub });
                                    }}
                                >
                                    <Plus size={16} color="#0066FF" />
                                    <Text style={styles.addNestedText}>Ajouter sous-élément</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        {/* Basis Selection */}
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.basisButton, segment.targetBasis === 'time' && styles.basisButtonSelected]}
                                onPress={() => onUpdate({ ...segment, targetBasis: 'time' })}
                            >
                                <Clock size={16} color={segment.targetBasis === 'time' ? '#FFF' : '#64748B'} />
                                <Text style={[styles.basisText, segment.targetBasis === 'time' && styles.basisTextSelected]}>Durée</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.basisButton, segment.targetBasis === 'distance' && styles.basisButtonSelected]}
                                onPress={() => onUpdate({ ...segment, targetBasis: 'distance' })}
                            >
                                <MapPin size={16} color={segment.targetBasis === 'distance' ? '#FFF' : '#64748B'} />
                                <Text style={[styles.basisText, segment.targetBasis === 'distance' && styles.basisTextSelected]}>Distance</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Target Value Input */}
                        {segment.targetBasis === 'time' ? (
                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.subLabel}>Minutes</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        placeholder="Min"
                                        defaultValue={formatSecondsToMMSS(segment.targetValue || 0).mins.toString()}
                                        onChangeText={(v) => handleDurationChange('mins', v)}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.subLabel}>Secondes</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        placeholder="Sec"
                                        defaultValue={formatSecondsToMMSS(segment.targetValue || 0).secs.toString()}
                                        onChangeText={(v) => handleDurationChange('secs', v)}
                                    />
                                </View>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.subLabel}>Distance (km)</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="ex: 5.0"
                                    defaultValue={((segment.targetValue || 0) / 1000).toString()}
                                    onChangeText={(v) => {
                                        const val = parseFloat(v);
                                        if (!isNaN(val)) onUpdate({ ...segment, targetValue: val * 1000 });
                                    }}
                                />
                            </>
                        )}

                        {/* Intensity Selection */}
                        <Text style={styles.subLabel}>Objectif d'intensité</Text>
                        <View style={styles.row}>
                            {(['none', 'pace', 'hr'] as IntensityType[]).map((it) => (
                                <TouchableOpacity
                                    key={it}
                                    style={[styles.intensityButton, segment.intensityType === it && styles.intensityButtonSelected]}
                                    onPress={() => onUpdate({ ...segment, intensityType: it, intensityTarget: it === 'none' ? undefined : { min: '', max: '' } })}
                                >
                                    <Text style={[styles.intensityText, segment.intensityType === it && styles.intensityTextSelected]}>
                                        {it === 'none' ? 'Aucun' : it === 'pace' ? 'Allure' : 'FC'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {segment.intensityType !== 'none' && (
                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.miniLabel}>Min</Text>
                                    <TextInput
                                        style={styles.miniInput}
                                        placeholder={segment.intensityType === 'pace' ? '5:30' : '140'}
                                        value={segment.intensityTarget?.min}
                                        onChangeText={(v) => onUpdate({ ...segment, intensityTarget: { ...segment.intensityTarget!, min: v } })}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.miniLabel}>Max</Text>
                                    <TextInput
                                        style={styles.miniInput}
                                        placeholder={segment.intensityType === 'pace' ? '5:10' : '150'}
                                        value={segment.intensityTarget?.max}
                                        onChangeText={(v) => onUpdate({ ...segment, intensityTarget: { ...segment.intensityTarget!, max: v } })}
                                    />
                                </View>
                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

export default function CreateWorkoutScreen() {
    const router = useRouter();
    const { addWorkout } = useWorkouts();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<WorkoutType>('EF');
    const [segments, setSegments] = useState<WorkoutSegment[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAddSegment = (stype: SegmentType) => {
        const newSegment: WorkoutSegment = {
            id: Math.random().toString(),
            type: stype,
            targetBasis: stype === 'repeat' ? undefined : 'time',
            targetValue: stype === 'repeat' ? undefined : 600,
            intensityType: stype === 'repeat' ? undefined : 'none',
            repeatCount: stype === 'repeat' ? 1 : undefined,
            subSegments: stype === 'repeat' ? [] : undefined,
        };
        setSegments([...segments, newSegment]);
        setEditingId(newSegment.id);
    };

    const handleUpdateSegment = (updated: WorkoutSegment) => {
        setSegments(segments.map(s => s.id === updated.id ? updated : s));
    };

    const handleRemoveSegment = (id: string) => {
        setSegments(segments.filter(s => s.id !== id));
        if (editingId === id) setEditingId(null);
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
            segments,
            isAIGenerated: false,
        });

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
                    {segments.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Zap size={48} color="#E2E8F0" />
                            <Text style={styles.emptyText}>Commencez à construire votre séance</Text>
                        </View>
                    ) : (
                        segments.map(s => (
                            <SegmentItem
                                key={s.id}
                                segment={s}
                                isEditing={editingId === s.id}
                                onEdit={() => setEditingId(s.id)}
                                onUpdate={handleUpdateSegment}
                                onRemove={() => handleRemoveSegment(s.id)}
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
        marginRight: 16,
        marginTop: 12,
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
        padding: 12,
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
        backgroundColor: 'transparent',
    },
    addNestedBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        padding: 8,
        backgroundColor: 'transparent',
    },
    addNestedText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0066FF',
        marginLeft: 8,
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
