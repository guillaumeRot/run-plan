import { SegmentType } from '@/types/workout';

export const SEGMENT_LABELS: Record<SegmentType, string> = {
    warmup: 'Échauffement',
    run: 'Course à pied',
    recovery: 'Récupération',
    cooldown: 'Retour au calme',
    repeat: 'Répétition',
};

export const formatSecondsToMMSS = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return { mins, secs };
};
