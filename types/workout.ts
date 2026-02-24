export type WorkoutType = 'EF' | 'VMA courte' | 'Seuil' | 'Sortie longue' | 'Anaérobique' | 'Sprint' | 'VO2 max' | 'Récupération';

export interface WorkoutSegment {
    id: string;
    type: 'warmup' | 'main' | 'recovery' | 'cooldown';
    description: string;
    duration?: string; // e.g., "20min"
    distance?: string; // e.g., "5km"
    intensity?: string; // e.g., "70% HR", "Z2", "v-VMA"
}

export interface Workout {
    id: string;
    title: string;
    description: string;
    date: string; // ISO string YYYY-MM-DD
    type: WorkoutType;
    segments: WorkoutSegment[];
    isAIGenerated: boolean;
}
