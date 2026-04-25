import React from 'react';
import { Animated, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStaggeredEntrance, useScaleBounce, useShake } from '../animations/AnimationHooks';
import { COLORS, SIZES, SHADOWS } from '../constants';

const TaskCard = ({ task, index, onToggle, onDelete, onPress }) => {
  const { translateY, opacity } = useStaggeredEntrance(index);
  const { scale, bounce } = useScaleBounce();
  const { translateX, shake } = useShake();

  const handleToggle = () => {
    bounce();
    onToggle(task.id);
  };

  const handleDelete = () => {
    shake();
    setTimeout(() => onDelete(task.id), 300);
  };

  const priorityColors = {
    High: COLORS.danger,
    Medium: COLORS.accent,
    Low: COLORS.secondary,
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          task.completed && styles.cardCompleted,
        ]}
        onPress={() => onPress(task)}
        activeOpacity={0.85}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              task.completed && styles.checkboxCompleted,
            ]}
            onPress={handleToggle}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={14} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.taskInfo}>
          <Text
            style={[
              styles.taskTitle,
              task.completed && styles.taskTitleCompleted,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.dueDate ? (
            <Text style={styles.dueDate}>
              <Ionicons name="calendar-outline" size={11} color={COLORS.textLight} />{' '}
              {task.dueDate}
            </Text>
          ) : null}
          {task.subject ? (
            <Text style={styles.subject}>{task.subject}</Text>
          ) : null}
        </View>

        <View style={styles.rightSection}>
          {task.priority ? (
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: priorityColors[task.priority] || COLORS.primary },
              ]}
            >
              <Text style={styles.priorityText}>{task.priority}</Text>
            </View>
          ) : null}
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    ...SHADOWS.small,
  },
  cardCompleted: {
    opacity: 0.7,
    backgroundColor: '#F7FAF8',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.completedGreen,
    borderColor: COLORS.completedGreen,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  dueDate: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  subject: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  priorityText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 4,
  },
});

export default TaskCard;
