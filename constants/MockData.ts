import { Workout } from '../types/workout';

export const MOCK_WORKOUTS: Workout[] = [
    {
        id: '1',
        title: 'Endurance Fondamentale (EF)',
        description: 'Développement de l\'endurance de base à un rythme de conversation.',
        date: '2026-02-24',
        type: 'EF',
        isAIGenerated: false,
        segments: [
            { id: 's1', type: 'main', description: '45min Rythme EF', duration: '45min', intensity: 'Z2' },
        ],
    },
    {
        id: '2',
        title: 'Séance VMA Courte',
        description: 'Amélioration de la capacité aérobie avec des efforts répétés à très haute intensité.',
        date: '2026-02-25',
        type: 'VMA courte',
        isAIGenerated: true,
        segments: [
            { id: 's2', type: 'warmup', description: '20min Échauffement', duration: '20min', intensity: 'Z1' },
            { id: 's3', type: 'main', description: '15 x 30s/30s à 105% VMA', distance: '1.5km', intensity: 'v-VMA' },
            { id: 's4', type: 'recovery', description: '30s trot léger', duration: '30s', intensity: 'Z1' },
            { id: 's5', type: 'cooldown', description: '10min Retour au calme', duration: '10min', intensity: 'Z1' },
        ],
    },
    {
        id: '3',
        title: 'Blocs de Seuil',
        description: 'Amélioration du seuil lactique pour tenir une vitesse élevée plus longtemps.',
        date: '2026-02-26',
        type: 'Seuil',
        isAIGenerated: false,
        segments: [
            { id: 's6', type: 'warmup', description: '15min Échauffement', duration: '15min' },
            { id: 's7', type: 'main', description: '3 x 10min au Seuil', duration: '30min', intensity: 'Z4' },
            { id: 's8', type: 'recovery', description: '2min récupération active', duration: '2min' },
            { id: 's9', type: 'cooldown', description: '10min Footing léger', duration: '10min' },
        ],
    },
    {
        id: '4',
        title: 'Sortie Longue Dominicale',
        description: 'Travail d\'endurance spécifique pour préparer la distance.',
        date: '2026-03-01',
        type: 'Sortie longue',
        isAIGenerated: false,
        segments: [
            { id: 's10', type: 'main', description: '1h30 en variation de rythme', duration: '90min', intensity: 'Z2-Z3' },
        ],
    },
    {
        id: '5',
        title: 'Poussée Anaérobique',
        description: 'Efforts explosifs pour améliorer la tolérance aux lactates.',
        date: '2026-02-27',
        type: 'Anaérobique',
        isAIGenerated: true,
        segments: [
            { id: 's11', type: 'main', description: '10 x 200m en montée', intensity: 'Max' },
            { id: 's12', type: 'recovery', description: 'Descente en marchant', duration: '2min' },
        ],
    },
    {
        id: '6',
        title: 'Session Sprints',
        description: 'Développement de la vitesse pure et de la puissance musculaire.',
        date: '2026-02-28',
        type: 'Sprint',
        isAIGenerated: false,
        segments: [
            { id: 's13', type: 'main', description: '6 x 80m Sprint plat', intensity: '100%' },
            { id: 's14', type: 'recovery', description: 'Récupération complète', duration: '3min' },
        ],
    },
    {
        id: '7',
        title: 'Développement VO2 Max',
        description: 'Augmenter la consommation maximale d\'oxygène.',
        date: '2026-03-02',
        type: 'VO2 max',
        isAIGenerated: true,
        segments: [
            { id: 's15', type: 'main', description: '5 x 1000m à allure 5km', intensity: 'Z5' },
            { id: 's16', type: 'recovery', description: '2min trot léger', duration: '2min' },
        ],
    },
    {
        id: '8',
        title: 'Décrassage / Récupération',
        description: 'Favoriser la circulation sanguine et la récupération après une grosse séance.',
        date: '2026-03-03',
        type: 'Récupération',
        isAIGenerated: false,
        segments: [
            { id: 's17', type: 'main', description: '30min de footing très lent', duration: '30min', intensity: 'Z1' },
        ],
    },
];
