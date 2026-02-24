import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Workout } from '../types/workout';
import { MOCK_WORKOUTS } from '../constants/MockData';

interface WorkoutContextType {
    workouts: Workout[];
    addWorkout: (workout: Workout) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [workouts, setWorkouts] = useState<Workout[]>(MOCK_WORKOUTS);

    const addWorkout = (workout: Workout) => {
        setWorkouts((prev) => [...prev, workout]);
    };

    return (
        <WorkoutContext.Provider value={{ workouts, addWorkout }}>
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkouts() {
    const context = useContext(WorkoutContext);
    if (context === undefined) {
        throw new Error('useWorkouts must be used within a WorkoutProvider');
    }
    return context;
}
