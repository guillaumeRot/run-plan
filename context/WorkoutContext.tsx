import React, { createContext, ReactNode, useContext, useState } from 'react';
import { MOCK_WORKOUTS } from '../constants/MockData';
import { Workout, WorkoutSegment } from '../types/workout';

interface WorkoutContextType {
    workouts: Workout[];
    addWorkout: (workout: Workout) => void;
    draftSegments: WorkoutSegment[];
    setDraftSegments: (segments: WorkoutSegment[]) => void;
    userMode: 'sportif' | 'coach';
    setUserMode: (mode: 'sportif' | 'coach') => void;
    isLoadingMode: boolean;
    setIsLoadingMode: (loading: boolean) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [workouts, setWorkouts] = useState<Workout[]>(MOCK_WORKOUTS);
    const [draftSegments, setDraftSegments] = useState<WorkoutSegment[]>([]);
    const [userMode, setUserMode] = useState<'sportif' | 'coach'>('sportif');
    const [isLoadingMode, setIsLoadingMode] = useState(false);

    const addWorkout = (workout: Workout) => {
        setWorkouts((prev) => [...prev, workout]);
    };

    return (
        <WorkoutContext.Provider value={{
            workouts,
            addWorkout,
            draftSegments,
            setDraftSegments,
            userMode,
            setUserMode,
            isLoadingMode,
            setIsLoadingMode
        }}>
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
