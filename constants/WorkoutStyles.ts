import { Activity, Clock, Zap, Map, TrendingUp, Sparkles, Flame, Bike, LucideIcon } from 'lucide-react-native';
import { WorkoutType } from '../types/workout';

export const TYPE_COLORS: Record<WorkoutType, string> = {
    EF: '#0066FF',           // Blue
    'VMA courte': '#FF4B2B', // Orange/Red
    Seuil: '#F59E0B',        // Amber
    'Sortie longue': '#2563EB', // Deeper Blue
    Anaérobique: '#9333EA',  // Purple
    Sprint: '#E11D48',       // Rose/Red
    'VO2 max': '#DC2626',    // Bright Red
    Récupération: '#8B5CF6', // Violet
};

export const TYPE_ICONS: Record<WorkoutType, LucideIcon> = {
    EF: Activity,
    'VMA courte': Zap,
    Seuil: TrendingUp,
    'Sortie longue': Map,
    Anaérobique: Flame,
    Sprint: Bike,
    'VO2 max': Sparkles,
    Récupération: Clock,
};

export const SESSION_TYPES: WorkoutType[] = [
    'EF',
    'VMA courte',
    'Seuil',
    'Sortie longue',
    'Anaérobique',
    'Sprint',
    'VO2 max',
    'Récupération'
];
