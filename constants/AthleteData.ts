export interface Athlete {
    id: string;
    name: string;
    level: string;
    lastSync: string;
    color: string;
}

export const ATHLETES: Athlete[] = [
    {
        id: '1',
        name: 'Jean Dupont',
        level: 'Intermédiaire',
        lastSync: 'Il y a 2h',
        color: '#0066FF' // Blue
    },
    {
        id: '2',
        name: 'Marie Curie',
        level: 'Avancé',
        lastSync: 'Hier',
        color: '#059669' // Green
    },
    {
        id: '3',
        name: 'Pierre Durand',
        level: 'Débutant',
        lastSync: 'Il y a 5 min',
        color: '#F59E0B' // Orange
    },
    {
        id: '4',
        name: 'Sophie Martin',
        level: 'Intermédiaire',
        lastSync: 'Il y a 1h',
        color: '#8B5CF6' // Purple
    }
];

export const getAthleteColor = (athleteId?: string) => {
    const athlete = ATHLETES.find(a => a.id === athleteId);
    return athlete ? athlete.color : '#94A3B8';
};
