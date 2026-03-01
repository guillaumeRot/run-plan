import { Text, View } from '@/components/Themed';
import { WorkoutCard } from '@/components/WorkoutCard';
import { ATHLETES } from '@/constants/AthleteData';
import { useWorkouts } from '@/context/WorkoutContext';
import { useRouter } from 'expo-router';
import { ChevronRight, Plus } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ListScreen() {
  const router = useRouter();
  const { workouts, userMode } = useWorkouts();

  // Sort and group workouts by date
  const groupedWorkouts = useMemo(() => {
    const sorted = [...workouts].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const groups: { date: string; sessions: any[] }[] = [];
    sorted.forEach(workout => {
      const existingGroup = groups.find(g => g.date === workout.date);
      if (existingGroup) {
        existingGroup.sessions.push(workout);
      } else {
        groups.push({ date: workout.date, sessions: [workout] });
      }
    });
    return groups;
  }, [workouts]);

  const formatDateHeader = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (userMode === 'coach') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Mes Sportifs</Text>
          {ATHLETES.map(athlete => (
            <TouchableOpacity key={athlete.id} style={styles.athleteCard}>
              <View style={styles.athleteInfo}>
                <View style={[styles.athleteAvatar, { backgroundColor: athlete.color + '15' }]}>
                  <Text style={[styles.athleteInitial, { color: athlete.color }]}>{athlete.name[0]}</Text>
                </View>
                <View style={{ backgroundColor: 'transparent' }}>
                  <Text style={styles.athleteName}>{athlete.name}</Text>
                  <Text style={styles.athleteDetail}>{athlete.level} • Synchro {athlete.lastSync}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.fab}>
          <Plus color="#fff" size={32} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {groupedWorkouts.map(group => (
          <View key={group.date} style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{formatDateHeader(group.date)}</Text>
            {group.sessions.map(w => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </View>
        ))}

        {workouts.length === 0 && (
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
  dateGroup: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'RobotoMediumItalic',
    color: '#64748B',
    marginHorizontal: 20,
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'RobotoMediumItalic',
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
  athleteCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  athleteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  athleteAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  athleteInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0066FF',
  },
  athleteName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  athleteDetail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
});
