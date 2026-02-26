import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0066FF',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: 25,
          paddingTop: 12,
          paddingHorizontal: 20,
          height: 85,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: 20,
          color: '#111827',
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontFamily: 'RobotoMediumItalic',
        },
        headerTintColor: '#0066FF',
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerTitleAlign: 'center',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calendrier',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/create-workout')}
              style={{ marginRight: 20, padding: 4 }}
            >
              <Plus size={24} color="#0066FF" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Séances',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistiques',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
