import { Text, View } from '@/components/Themed';
import { TYPE_COLORS, TYPE_ICONS } from '@/constants/WorkoutStyles';
import { useWorkouts } from '@/context/WorkoutContext';
import { useRouter } from 'expo-router';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function CalendarScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { workouts } = useWorkouts();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust to start on Monday (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const formatWorkoutDate = (day: number) => {
    const d = new Date(year, month, day);
    // Local date format YYYY-MM-DD
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dayStr}`;
  };

  const calculateMetrics = (workout: any) => {
    let totalDist = 0;
    let totalDur = 0;

    const processSegments = (segments: any[], multiplier = 1) => {
      segments.forEach((s: any) => {
        if (s.type === 'repeat') {
          processSegments(s.subSegments || [], multiplier * (s.repeatCount || 1));
        } else {
          if (s.targetBasis === 'distance') {
            totalDist += (s.targetValue / 1000) * multiplier;
          } else if (s.targetBasis === 'time') {
            totalDur += (s.targetValue / 60) * multiplier;
          }
        }
      });
    };

    processSegments(workout.segments || []);

    const distStr = totalDist > 0 ? `${totalDist.toFixed(1)} km` : null;

    let durStr = null;
    if (totalDur > 0) {
      const h = Math.floor(totalDur / 60);
      const m = Math.round(totalDur % 60);
      if (h > 0) {
        durStr = `${h}H${m > 0 ? ` ${m}MIN` : ''}`;
      } else {
        durStr = `${m} MIN`;
      }
    }

    return { distStr, durStr };
  };

  const renderWeeks = () => {
    const weeks = [];
    let currentWeek = [];

    // Padding for the first week
    for (let i = 0; i < startingDayIndex; i++) {
      currentWeek.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = formatWorkoutDate(i);
      const dayWorkouts = workouts.filter(w => w.date === dateStr);
      const firstWorkout = dayWorkouts[0];
      const metrics = firstWorkout ? calculateMetrics(firstWorkout) : null;
      const Icon = firstWorkout ? (TYPE_ICONS[firstWorkout.type] || Activity) : null;

      currentWeek.push(
        <TouchableOpacity
          key={i}
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: '/day-workouts/[date]', params: { date: dateStr } })}
          style={styles.dayCell}
        >
          <View style={[styles.dayInner, isToday(i) && styles.todayInner]}>
            <Text style={[styles.dayText, isToday(i) && styles.todayText]}>
              {i}
            </Text>
          </View>

          {firstWorkout && (
            <View style={[styles.workoutBlock, { backgroundColor: TYPE_COLORS[firstWorkout.type] || '#ccc' }]}>
              {Icon && <Icon size={12} color="#FFFFFF" style={styles.workoutIcon} />}
              <View style={styles.metricsContainer}>
                {metrics?.distStr && <Text style={styles.workoutText}>{metrics.distStr}</Text>}
                {metrics?.durStr && <Text style={styles.workoutText}>{metrics.durStr}</Text>}
              </View>
            </View>
          )}
        </TouchableOpacity>
      );

      if (currentWeek.length === 7) {
        weeks.push(<View key={`week-${weeks.length}`} style={styles.weekRow}>{currentWeek}</View>);
        currentWeek = [];
      }
    }

    // Padding for the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(<View key={`empty-last-${currentWeek.length}`} style={styles.dayCell} />);
      }
      weeks.push(<View key={`week-${weeks.length}`} style={styles.weekRow}>{currentWeek}</View>);
    }

    return weeks;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
          <ChevronLeft size={24} color="#0066FF" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <ChevronRight size={24} color="#0066FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysHeader}>
        {DAYS.map(day => (
          <Text key={day} style={styles.dayHeaderCell}>{day}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {renderWeeks()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    height: 40,
    paddingHorizontal: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'RobotoMediumItalic',
    textAlign: 'center',
    flex: 1,
  },
  navButton: {
    padding: 8,
    width: 44,
    alignItems: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 5,
  },
  dayHeaderCell: {
    flex: 1,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'RobotoMediumItalic',
  },
  grid: {
    flex: 1,
  },
  weekRow: {
    flex: 1,
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
  },
  dayInner: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    marginBottom: 2,
  },
  todayInner: {
    backgroundColor: '#0066FF',
  },
  dayText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'RobotoMediumItalic',
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  workoutBlock: {
    width: '92%',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  workoutIcon: {
    marginBottom: 2,
  },
  metricsContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  workoutText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'RobotoMediumItalic',
    textAlign: 'center',
    lineHeight: 10,
    textTransform: 'uppercase',
  },
});





