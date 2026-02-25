export type WorkoutType = 'EF' | 'VMA courte' | 'Seuil' | 'Sortie longue' | 'Anaérobique' | 'Sprint' | 'VO2 max' | 'Récupération';

export type SegmentType = 'warmup' | 'run' | 'recovery' | 'cooldown' | 'repeat';
export type TargetBasis = 'time' | 'distance';
export type IntensityType = 'pace' | 'hr' | 'none';

export interface WorkoutSegment {
    id: string;
    type: SegmentType;
    targetBasis?: TargetBasis;
    targetValue?: number; // seconds for time, meters for distance
    intensityType?: IntensityType;
    intensityTarget?: {
        min: string;
        max: string;
        value?: string;
    };
    description?: string;
    repeatCount?: number; // For 'repeat' type
    subSegments?: WorkoutSegment[]; // For 'repeat' type
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


