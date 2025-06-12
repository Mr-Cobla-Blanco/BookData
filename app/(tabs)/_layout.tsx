import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          height: 120,
          borderTopWidth: 0,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 10,
          paddingHorizontal: 20,
        },
        tabBarLabelStyle: {
          display: 'none',
        },
      }}>
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBall} />}
              <IconSymbol size={40} name="library.books" color={TAB_BAR_ICON} />
              <Text style={styles.iconLabel}>Library</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBall} />}
              <IconSymbol size={40} name="add.box" color={TAB_BAR_ICON} />
              <Text style={styles.iconLabel}>+Upload</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBall} />}
              <IconSymbol size={40} name="bar.chart" color={TAB_BAR_ICON} />
              <Text style={styles.iconLabel}>Stats</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBall} />}
              <IconSymbol size={40} name="person" color={TAB_BAR_ICON} />
              <Text style={styles.iconLabel}>Settings</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginTop: 40,
    position: 'relative',
  },
  iconLabel: {
    fontSize: 14,
    color: '#03C988',
    marginTop: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  activeBall: {
    position: 'absolute',
    top: 10, //10
    left: 10, //10
    width: 80, //80
    height: 80, //80
    borderRadius: 64,
    backgroundColor: '#1C82AD',
    opacity: 0.27,
    zIndex: 0,
  },
});
