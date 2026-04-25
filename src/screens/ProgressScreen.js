import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';
import { useFadeIn, useSlideUp } from '../animations/AnimationHooks';
import { Animated } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants';

const ProgressScreen = () => {
  const { taskList } = useSelector(state => state.tasks);

  const opacity = useFadeIn(500);
  const { translateY, opacity: slideOp } = useSlideUp(25, 600, 200);

  const total = taskList.length;
  const completed = taskList.filter(t => t.completed).length;
  const pending = total - completed;

  const highCount = taskList.filter(t => t.priority === 'High' && !t.completed).length;
  const mediumCount = taskList.filter(t => t.priority === 'Medium' && !t.completed).length;
  const lowCount = taskList.filter(t => t.priority === 'Low' && !t.completed).length;

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[styles.progressCard, { opacity: slideOp, transform: [{ translateY }] }]}
      >
        <Text style={styles.cardTitle}>Overall Progress</Text>
        <ProgressBar completed={completed} total={total} />
      </Animated.View>

      <View style={styles.statsRow}>
        <StatCard
          icon="list-outline"
          label="Total"
          value={total}
          color={COLORS.primary}
        />
        <StatCard
          icon="checkmark-circle-outline"
          label="Done"
          value={completed}
          color={COLORS.completedGreen}
        />
        <StatCard
          icon="time-outline"
          label="Pending"
          value={pending}
          color={COLORS.accent}
        />
      </View>

      <View style={styles.prioritySection}>
        <Text style={styles.sectionTitle}>Pending by Priority</Text>
        <View style={styles.priorityRow}>
          <View style={[styles.priorityBar, { flex: highCount || 0.01, backgroundColor: COLORS.danger }]}>
            {highCount > 0 && <Text style={styles.barLabel}>{highCount} High</Text>}
          </View>
          <View style={[styles.priorityBar, { flex: mediumCount || 0.01, backgroundColor: COLORS.accent }]}>
            {mediumCount > 0 && <Text style={styles.barLabel}>{mediumCount} Med</Text>}
          </View>
          <View style={[styles.priorityBar, { flex: lowCount || 0.01, backgroundColor: COLORS.secondary }]}>
            {lowCount > 0 && <Text style={styles.barLabel}>{lowCount} Low</Text>}
          </View>
        </View>
      </View>

      {total === 0 && (
        <View style={styles.emptyMsg}>
          <Ionicons name="bar-chart-outline" size={48} color={COLORS.border} />
          <Text style={styles.emptyText}>Add tasks to see your progress</Text>
        </View>
      )}

      {completed === total && total > 0 && (
        <View style={styles.celebrateCard}>
          <Text style={styles.celebrateEmoji}>🎉</Text>
          <Text style={styles.celebrateText}>All tasks completed! Great work!</Text>
        </View>
      )}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: SIZES.xxlarge,
    fontWeight: '800',
    marginTop: 6,
  },
  statLabel: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  prioritySection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    ...SHADOWS.small,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  priorityRow: {
    flexDirection: 'row',
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    gap: 2,
  },
  priorityBar: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 8,
    borderRadius: 6,
  },
  barLabel: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  emptyMsg: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: SIZES.medium,
    marginTop: 10,
  },
  celebrateCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.completedGreen,
  },
  celebrateEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  celebrateText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.completedGreen,
    textAlign: 'center',
  },
});

export default ProgressScreen;
