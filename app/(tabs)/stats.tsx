import { ThemedText } from '@/components/ThemedText';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const mockStats = {
  streak: 12,
  hoursRead: 3,
  wordsToday: 4500,
  wpm: 300,
  week: [1200, 1800, 2000, 3200, 1500, 2100, 3200],
};

const CARD_COLOR = '#0a0050';
const BORDER_COLOR = '#00e6c3';
const TITLE_COLOR = '#00e6c3';
const SUBTITLE_COLOR = '#1C82AD';
const BG_TOP = '#0a0050';
const BG_BOTTOM = '#e6e6fa';
const ICON_SIZE = 32;
const BAR_COLOR_1 = '#00e6c3'; // light teal
const BAR_COLOR_2 = '#1C82AD'; // blue
const LINE_COLOR = '#fff';
const POINT_COLOR = '#ffb3ff';

const AXIS_THICKNESS = 4;
const Y_LABEL_WIDTH = 45;
const BAR_WIDTH = 32;
const BAR_GAP = 16;
const BAR_HEIGHT = 200;
const GRAPH_WIDTH = (BAR_WIDTH + BAR_GAP) * mockStats.week.length - BAR_GAP;
const yMilestones = [0, 800, 1600, 2400, 3200];

const StatsScreen: React.FC = () => {
  const barGraphData = mockStats.week;
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxWords = Math.max(...barGraphData);

  return (
    <View style={styles.root}>
      <View style={styles.topSection}>
        <ThemedText style={styles.title}>Your Stats</ThemedText>
        <View style={styles.statsGrid}>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <MaterialIcons name="whatshot" size={ICON_SIZE} color={BORDER_COLOR} style={{ marginRight: 8 }} />
              <ThemedText style={styles.streakNum}>{mockStats.streak}</ThemedText>
            </View>
            <ThemedText style={styles.cardLabel}>DAY STREAK</ThemedText>
          </View>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <MaterialIcons name="access-time" size={ICON_SIZE} color={BORDER_COLOR} style={{ marginRight: 8 }} />
              <ThemedText style={styles.cardValue}>{mockStats.hoursRead} hours</ThemedText>
            </View>
            <ThemedText style={styles.cardLabel}>Reading today</ThemedText>
          </View>
          <View style={styles.card}>
            <ThemedText style={styles.cardValue}>{mockStats.wordsToday}</ThemedText>
            <ThemedText style={styles.cardLabel}>Words Read Today</ThemedText>
          </View>
          <View style={styles.card}>
            <ThemedText style={styles.cardValue}>{mockStats.wpm} WPM</ThemedText>
            <ThemedText style={styles.cardLabel}>(Word per minute)</ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <ThemedText style={styles.graphTitle}>Words read this week</ThemedText>
        <View style={styles.centeredGraphWrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 32, justifyContent: 'center', width: '100%', marginBottom: 48 }}>
            {/* Y axis labels and grid lines */}
            <View style={{ width: Y_LABEL_WIDTH, height: BAR_HEIGHT, justifyContent: 'space-between', position: 'relative' }}>
              {yMilestones.slice().reverse().map((label, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', height: BAR_HEIGHT / (yMilestones.length - 1), position: 'relative' }}>
                  <ThemedText style={{ fontSize: 16, color: '#0a0050', width: Y_LABEL_WIDTH - 8, textAlign: 'right' }}>{label}</ThemedText>
                  {/* Y axis thick line only for the first label */}
                  {i === 0 && (
                    <View style={{
                      width: AXIS_THICKNESS,
                      height: BAR_HEIGHT,
                      backgroundColor: '#222',
                      position: 'absolute',
                      left: Y_LABEL_WIDTH - AXIS_THICKNESS,
                      top: 0,
                      zIndex: 2,
                      borderRadius: 0.5,
                    }} />
                  )}
                </View>
              ))}
            </View>
            {/* Bar area */}
            <View style={{ width: GRAPH_WIDTH, height: BAR_HEIGHT, position: 'relative' }}>
              {/* Grid lines */}
              {yMilestones.slice().reverse().map((label, i) => (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: (BAR_HEIGHT / (yMilestones.length - 1)) * i - 1,
                    height: 2,
                    backgroundColor: i === yMilestones.length - 1 ? '#222' : '#222',
                    opacity: i === yMilestones.length - 1 ? 0.7 : 0.2,
                    zIndex: 1,
                  }}
                />
              ))}
              {/* Bars */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: BAR_HEIGHT, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                {barGraphData.map((words, i) => (
                  <View key={i} style={{ width: BAR_WIDTH, alignItems: 'center', marginRight: i < barGraphData.length - 1 ? BAR_GAP : 0 }}>
                    <View style={{
                      width: BAR_WIDTH,
                      height: BAR_HEIGHT * (words / maxWords),
                      backgroundColor: '#00e6c3',
                      borderRadius: 4,
                    }} />
                  </View>
                ))}
              </View>
              {/* X axis thick line */}
              <View style={{
                position: 'absolute',
                left: -4,
                right: 0,
                bottom: 0,
                height: AXIS_THICKNESS,
                backgroundColor: '#222',
                zIndex: 2,
                borderRadius: 2,
              }} />
              {/* X axis labels */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', left: 0, right: 0, bottom: -28 }}>
                {daysOfWeek.map((day, i) => (
                  <ThemedText key={i} style={{ fontSize: 16, color: '#0a0050', width: BAR_WIDTH, textAlign: 'center' }}>{day}</ThemedText>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_TOP,
  },
  topSection: {
    paddingTop: 64,
    paddingHorizontal: 16,
    backgroundColor: BG_TOP,
    marginBottom: 8,
  },
  title: {
    color: TITLE_COLOR,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    backgroundColor: CARD_COLOR,
    padding: 12,
    marginBottom: 12,
    width: width / 2 - 24,
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  streakNum: {
    color: BORDER_COLOR,
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardValue: {
    color: BORDER_COLOR,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardLabel: {
    color: SUBTITLE_COLOR,
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: BG_BOTTOM,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: 48,
    padding: 16,
  },
  graphTitle: {
    color: BG_TOP,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  centeredGraphWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StatsScreen; 