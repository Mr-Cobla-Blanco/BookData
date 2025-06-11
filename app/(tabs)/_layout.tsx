import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';

const TAB_BAR_BG = '#0a0050'; // dark blue
const TAB_BAR_ICON = '#00e6c3'; // teal

export default function TabLayout() {
  useColorScheme(); // keep for future theming

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TAB_BAR_ICON,
        tabBarInactiveTintColor: TAB_BAR_ICON,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BG,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 80,
          borderTopWidth: 0,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 10,
        },
        tabBarLabelStyle: {
          display: 'none',
        },
      }}>
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <IconSymbol size={40} name="library.books" color={TAB_BAR_ICON} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <IconSymbol size={40} name="add.box" color={TAB_BAR_ICON} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <IconSymbol size={40} name="bar.chart" color={TAB_BAR_ICON} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={40} name="person" color={TAB_BAR_ICON} />,
        }}
      />
    </Tabs>
  );
}
