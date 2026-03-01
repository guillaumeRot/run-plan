import { Workout } from '../types/workout';

export const MOCK_WORKOUTS: Workout[] = [
    {
        id: '1',
        title: 'Endurance Fondamentale (EF)',
        description: 'Développement de l\'endurance de base.',
        isAIGenerated: false,
        date: '2026-02-24',
        type: 'EF',
        athleteId: '1',
        segments: [
            { id: 's1', type: 'run', targetBasis: 'time', targetValue: 2700, intensityType: 'hr', intensityTarget: { min: '130', max: '145' } },
        ],
    },
    {
        id: '2',
        title: 'Séance VMA Courte',
        description: 'Amélioration de la capacité aérobie.',
        isAIGenerated: true,
        date: '2026-02-25',
        type: 'VMA courte',
        athleteId: '2',
        segments: [
            { id: 's2', type: 'warmup', targetBasis: 'time', targetValue: 1200, intensityType: 'none' },
            {
                id: 's3',
                type: 'repeat',
                repeatCount: 15,
                subSegments: [
                    { id: 's3-1', type: 'run', targetBasis: 'time', targetValue: 30, intensityType: 'pace', intensityTarget: { min: '3:30', max: '3:40' } },
                    { id: 's3-2', type: 'recovery', targetBasis: 'time', targetValue: 30, intensityType: 'none' },
                ]
            },
            { id: 's5', type: 'cooldown', targetBasis: 'time', targetValue: 600, intensityType: 'none' },
        ],
    },
    {
        id: '3',
        title: 'Blocs de Seuil',
        description: 'Amélioration du seuil lactique.',
        isAIGenerated: false,
        date: '2026-02-26',
        type: 'Seuil',
        athleteId: '3',
        segments: [
            { id: 's6', type: 'warmup', targetBasis: 'time', targetValue: 900, intensityType: 'none' },
            {
                id: 's7',
                type: 'repeat',
                repeatCount: 3,
                subSegments: [
                    { id: 's7-1', type: 'run', targetBasis: 'time', targetValue: 600, intensityType: 'pace', intensityTarget: { min: '4:00', max: '4:10' } },
                    { id: 's7-2', type: 'recovery', targetBasis: 'time', targetValue: 120, intensityType: 'none' },
                ]
            },
            { id: 's9', type: 'cooldown', targetBasis: 'time', targetValue: 600, intensityType: 'none' },
        ],
    },
    {
        id: '4',
        title: 'Sortie Longue',
        description: 'Travail d\'endurance spécifique.',
        isAIGenerated: false,
        date: '2026-03-01',
        type: 'Sortie longue',
        athleteId: '1',
        segments: [
            { id: 's10', type: 'run', targetBasis: 'time', targetValue: 5400, intensityType: 'hr', intensityTarget: { min: '135', max: '150' } },
        ],
    },
    {
        id: '5',
        title: 'Poussée Anaérobique',
        description: 'Efforts explosifs.',
        isAIGenerated: true,
        date: '2026-02-27',
        type: 'Anaérobique',
        athleteId: '4',
        segments: [
            {
                id: 's11',
                type: 'repeat',
                repeatCount: 10,
                subSegments: [
                    { id: 's11-1', type: 'run', targetBasis: 'distance', targetValue: 200, intensityType: 'none' },
                    { id: 's11-2', type: 'recovery', targetBasis: 'time', targetValue: 120, intensityType: 'none' },
                ]
            },
        ],
    },
];
