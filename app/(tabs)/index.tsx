import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Text, View } from '@/components/Themed';
import { useWorkouts } from '@/context/WorkoutContext';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LocaleConfig } from 'react-native-calendars';
import { formatDateToFR } from '@/utils/date';
import { TYPE_COLORS, TYPE_ICONS } from '@/constants/WorkoutStyles';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

export default function CalendarScreen() {
  const router = useRouter();
  const { workouts } = useWorkouts();

  const markedDates = useMemo(() => {
    const marks: any = {};
    workouts.forEach((w) => {
      if (!marks[w.date]) {
        marks[w.date] = { workouts: [] };
      }
      marks[w.date].workouts.push(w);
    });
    return marks;
  }, [workouts]);

  const CustomDay = ({ date, state, marking }: any) => {
    const dayWorkouts = marking?.workouts || [];
    const isToday = state === 'today';
    const isDisabled = state === 'disabled';

    const calculateTotals = (workout: any) => {
      let totalDist = 0;
      let totalDuration = 0;

      workout.segments.forEach((s: any) => {
        if (s.distance) {
          const dist = parseFloat(s.distance.replace(/[^\d.]/g, ''));
          if (!isNaN(dist)) totalDist += dist;
        }
        if (s.duration) {
          const dur = parseFloat(s.duration.replace(/[^\d.]/g, ''));
          if (!isNaN(dur)) totalDuration += dur;
        }
      });

      return {
        distance: totalDist > 0 ? `${totalDist.toFixed(1)}km` : null,
        duration: totalDuration > 0 ? `${totalDuration}m` : null,
      };
    };

    return (
      <TouchableOpacity
        style={styles.dayCell}
        onPress={() => {
          if (dayWorkouts.length >= 1) {
            router.push(`/workout/${dayWorkouts[0].id}`);
          }
        }}
      >
        <Text style={[
          styles.dayText,
          isToday && styles.todayText,
          isDisabled && styles.disabledText
        ]}>
          {date.day}
        </Text>
        <View style={styles.markersContainer}>
          {dayWorkouts.map((w: any) => {
            const Icon = TYPE_ICONS[w.type as keyof typeof TYPE_ICONS];
            const totals = calculateTotals(w);
            return (
              <View
                key={w.id}
                style={[
                  styles.workoutMarker,
                  { backgroundColor: TYPE_COLORS[w.type as keyof typeof TYPE_COLORS] || '#ccc' }
                ]}
              >
                {Icon && <Icon size={12} color="#FFF" style={styles.markerIcon} />}
                {(totals.distance || totals.duration) && (
                  <Text style={styles.markerText}>
                    {totals.distance && totals.distance}
                    {totals.distance && totals.duration && ' • '}
                    {totals.duration && totals.duration}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        firstDay={1}
        dayComponent={CustomDay}
        markedDates={markedDates}
        style={styles.calendar}
        theme={{
          calendarBackground: '#F8FAFC',
          textSectionTitleColor: '#94A3B8',
          monthTextColor: '#111827',
          textMonthFontWeight: '500',
          textDayHeaderFontWeight: '500',
          textDayFontFamily: 'RobotoMediumItalic',
          textMonthFontFamily: 'RobotoMediumItalic',
          textDayHeaderFontFamily: 'RobotoMediumItalic',
          // @ts-ignore - Common pattern for react-native-calendars
          'stylesheet.calendar.main': {
            container: {
              flex: 1,
              paddingLeft: 0,
              paddingRight: 0,
              backgroundColor: '#F8FAFC',
            },
            monthView: {
              flex: 1,
              justifyContent: 'space-around',
            },
            week: {
              flexDirection: 'row',
              justifyContent: 'space-around',
              flex: 1,
            },
          },
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 10,
              paddingRight: 10,
              marginTop: 10,
              alignItems: 'center',
              backgroundColor: '#FFF',
              borderBottomWidth: 1,
              borderBottomColor: '#E2E8F0',
              paddingBottom: 15,
            }
          }
        } as any}
      />

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
  calendar: {
    flex: 1,
  },
  dayCell: {
    width: '100%',
    height: 85,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    borderWidth: 0.5,
    borderColor: '#F1F5F9',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  todayText: {
    color: '#0066FF',
    fontWeight: '900',
  },
  disabledText: {
    color: '#CBD5E1',
  },
  markersContainer: {
    width: '100%',
    paddingHorizontal: 2,
    gap: 2,
    backgroundColor: 'transparent',
  },
  workoutMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    width: '100%',
  },
  markerIcon: {
    marginRight: 4,
  },
  markerText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '800',
    flex: 1,
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
});
