import { SegmentItem } from '@/components/SegmentItem';
import { SEGMENT_LABELS, formatSecondsToMMSS } from '@/constants/WorkoutConstants';
import { SEGMENT_COLORS } from '@/constants/WorkoutStyles';
import { useWorkouts } from '@/context/WorkoutContext';
import { IntensityType, SegmentType, WorkoutSegment } from '@/types/workout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Clock, MapPin, Plus, X } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditSegmentScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { draftSegments, setDraftSegments } = useWorkouts();

    const findSegment = (list: WorkoutSegment[]): WorkoutSegment | null => {
        for (const s of list) {
            if (s.id === id) return s;
            if (s.subSegments) {
                const found = findSegment(s.subSegments);
                if (found) return found;
            }
        }
        return null;
    };

    const findDepth = (segmentId: string, list: WorkoutSegment[], depth = 0): number => {
        for (const s of list) {
            if (s.id === segmentId) return depth;
            if (s.subSegments) {
                const d = findDepth(segmentId, s.subSegments, depth + 1);
                if (d !== -1) return d;
            }
        }
        return -1;
    };

    const updateRecursive = (list: WorkoutSegment[], updated: WorkoutSegment): WorkoutSegment[] => {
        return list.map(s => {
            if (s.id === updated.id) return updated;
            if (s.subSegments) return { ...s, subSegments: updateRecursive(s.subSegments, updated) };
            return s;
        });
    };

    const initialSegment = findSegment(draftSegments);
    const [local, setLocal] = React.useState<WorkoutSegment | null>(initialSegment ? { ...initialSegment } : null);

    if (!local) {
        return (
            <View style={styles.container}>
                <Text>Segment non trouvé</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const depth = findDepth(local.id, draftSegments);

    const handleDurationChange = (type: 'mins' | 'secs', value: string) => {
        const currentVal = formatSecondsToMMSS(local.targetValue || 0);
        const newVal = parseInt(value) || 0;
        const total = type === 'mins' ? newVal * 60 + currentVal.secs : currentVal.mins * 60 + newVal;
        setLocal({ ...local, targetValue: total });
    };

    const handleSave = () => {
        setDraftSegments(updateRecursive(draftSegments, local));
        router.back();
    };

    const handleAddSub = (stype: SegmentType) => {
        const nextId = Math.random().toString();
        const newSub = [...(local.subSegments || []), {
            id: nextId,
            type: stype,
            targetBasis: stype === 'repeat' ? undefined : 'time',
            targetValue: stype === 'repeat' ? undefined : 60,
            intensityType: stype === 'repeat' ? undefined : 'none',
            repeatCount: stype === 'repeat' ? 1 : undefined,
            subSegments: stype === 'repeat' ? [] : undefined,
        } as WorkoutSegment];
        const updated = { ...local, subSegments: newSub };
        setLocal(updated);
        setDraftSegments(updateRecursive(draftSegments, updated));

        // Navigate to the new segment
        router.push({ pathname: '/edit-segment', params: { id: nextId } });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <X size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>Modifier {SEGMENT_LABELS[local.type].toLowerCase()}</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>OK</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {local.type === 'repeat' ? (
                    <View style={styles.section}>
                        <Text style={styles.label}>Nombre de répétitions</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            defaultValue={(local.repeatCount || 1).toString()}
                            onChangeText={(v) => setLocal({ ...local, repeatCount: parseInt(v) || 1 })}
                        />

                        {local.subSegments && local.subSegments.length > 0 && (
                            <View style={styles.subSegmentsList}>
                                <Text style={styles.label}>Éléments contenus</Text>
                                {local.subSegments.map((ss) => (
                                    <SegmentItem
                                        key={ss.id}
                                        segment={ss}
                                        onPress={(seg) => router.push({ pathname: '/edit-segment', params: { id: seg.id } })}
                                        onRemove={(subId) => {
                                            const newSub = local.subSegments?.filter(s => s.id !== subId);
                                            const updated = { ...local, subSegments: newSub };
                                            setLocal(updated);
                                            setDraftSegments(updateRecursive(draftSegments, updated));
                                        }}
                                        depth={0}
                                    />
                                ))}
                            </View>
                        )}

                        {depth < 2 && (
                            <View style={styles.addWrapper}>
                                <Text style={styles.label}>Ajouter à cette répétition</Text>
                                <View style={styles.addButtons}>
                                    {(depth === 0 ? ['run', 'recovery', 'repeat'] : ['run', 'recovery']).map((st) => (
                                        <TouchableOpacity
                                            key={st}
                                            style={[styles.addBtn, { borderColor: SEGMENT_COLORS[st as SegmentType] + '40' }]}
                                            onPress={() => handleAddSub(st as SegmentType)}
                                        >
                                            <Plus size={14} color={SEGMENT_COLORS[st as SegmentType]} />
                                            <Text style={[styles.addBtnText, { color: SEGMENT_COLORS[st as SegmentType] }]}>
                                                {st === 'run' ? 'Course' : st === 'recovery' ? 'Récup' : 'Répét'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.label}>Objectif de travail</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.basisBtn, local.targetBasis === 'time' && styles.basisBtnActive]}
                                onPress={() => setLocal({ ...local, targetBasis: 'time' })}
                            >
                                <Clock size={16} color={local.targetBasis === 'time' ? '#FFF' : '#64748B'} />
                                <Text style={[styles.basisText, local.targetBasis === 'time' && styles.basisTextActive]}>Durée</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.basisBtn, local.targetBasis === 'distance' && styles.basisBtnActive]}
                                onPress={() => setLocal({ ...local, targetBasis: 'distance' })}
                            >
                                <MapPin size={16} color={local.targetBasis === 'distance' ? '#FFF' : '#64748B'} />
                                <Text style={[styles.basisText, local.targetBasis === 'distance' && styles.basisTextActive]}>Distance</Text>
                            </TouchableOpacity>
                        </View>

                        {local.targetBasis === 'time' ? (
                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.miniLabel}>Minutes</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        defaultValue={formatSecondsToMMSS(local.targetValue || 0).mins.toString()}
                                        onChangeText={(v) => handleDurationChange('mins', v)}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.miniLabel}>Secondes</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        defaultValue={formatSecondsToMMSS(local.targetValue || 0).secs.toString()}
                                        onChangeText={(v) => handleDurationChange('secs', v)}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.miniLabel}>Distance (km)</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    defaultValue={((local.targetValue || 0) / 1000).toString()}
                                    onChangeText={(v) => {
                                        const val = parseFloat(v);
                                        if (!isNaN(val)) setLocal({ ...local, targetValue: val * 1000 });
                                    }}
                                />
                            </View>
                        )}

                        <Text style={styles.label}>Objectif d'intensité</Text>
                        <View style={styles.row}>
                            {(['none', 'pace', 'hr'] as IntensityType[]).map((it) => (
                                <TouchableOpacity
                                    key={it}
                                    style={[styles.intensityBtn, local.intensityType === it && styles.intensityBtnActive]}
                                    onPress={() => setLocal({ ...local, intensityType: it, intensityTarget: it === 'none' ? undefined : { min: '', max: '' } })}
                                >
                                    <Text style={[styles.intensityText, local.intensityType === it && styles.intensityTextActive]}>
                                        {it === 'none' ? 'Aucun' : it === 'pace' ? 'Allure' : 'FC'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {local.intensityType !== 'none' && (
                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.miniLabel}>Min</Text>
                                    <TextInput
                                        style={styles.miniInput}
                                        value={local.intensityTarget?.min}
                                        onChangeText={(v) => setLocal({ ...local, intensityTarget: { ...local.intensityTarget!, min: v } })}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.miniLabel}>Max</Text>
                                    <TextInput
                                        style={styles.miniInput}
                                        value={local.intensityTarget?.max}
                                        onChangeText={(v) => setLocal({ ...local, intensityTarget: { ...local.intensityTarget!, max: v } })}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                )}
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
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backBtn: {
        padding: 4,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
    },
    saveBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#0066FF',
        borderRadius: 12,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 8,
    },
    miniLabel: {
        fontSize: 11,
        color: '#94A3B8',
        marginBottom: 4,
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
    miniInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    basisBtn: {
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
    basisBtnActive: {
        backgroundColor: '#64748B',
        borderColor: '#64748B',
    },
    basisText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    basisTextActive: {
        color: '#FFFFFF',
    },
    intensityBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    intensityBtnActive: {
        backgroundColor: '#0066FF',
        borderColor: '#0066FF',
    },
    intensityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    intensityTextActive: {
        color: '#FFFFFF',
    },
    addWrapper: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    addButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        gap: 4,
    },
    addBtnText: {
        fontSize: 11,
        fontWeight: '700',
    },
    subSegmentsList: {
        marginTop: 16,
        marginBottom: 24,
    },
});
