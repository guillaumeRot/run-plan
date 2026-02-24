import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { WorkoutCard } from '@/components/WorkoutCard';
import { useWorkouts } from '@/context/WorkoutContext';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ListScreen() {
  const router = useRouter();
  const { workouts } = useWorkouts();
  // Sort workouts chronologically
  const sortedWorkouts = [...workouts].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Séances à venir</Text>
        {sortedWorkouts.map(w => (
          <WorkoutCard key={w.id} workout={w} />
        ))}

        {sortedWorkouts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune séance prévue pour le moment.</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-workout')}
      >
        <Plus color="#fff" size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#0066FF',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
});
