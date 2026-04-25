import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { toggleTask, deleteTask, updateTask } from '../store/tasksSlice';
import CustomButton from '../components/CustomButton';
import { useFadeIn, useScaleBounce } from '../animations/AnimationHooks';
import { Animated } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants';

const TaskDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { task } = route.params;
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedNotes, setEditedNotes] = useState(task.notes || '');

  const opacity = useFadeIn(400);
  const { scale, bounce } = useScaleBounce();

  const priorityColor = {
    High: COLORS.danger,
    Medium: COLORS.accent,
    Low: COLORS.secondary,
  };

  const handleToggle = () => {
    bounce();
    dispatch(toggleTask(task.id));
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'This will permanently remove the task.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteTask(task.id));
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleSaveEdit = () => {
    if (!editedTitle.trim()) {
      Alert.alert('Title Required', 'Task title cannot be empty.');
      return;
    }
    dispatch(updateTask({ ...task, title: editedTitle.trim(), notes: editedNotes.trim() }));
    setEditMode(false);
    Alert.alert('Saved', 'Task has been updated.');
  };

  const DetailRow = ({ icon, label, value, valueColor }) => (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color={COLORS.primary} style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor && { color: valueColor }]}>
        {value || '—'}
      </Text>
    </View>
  );

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
              style={[
                styles.statusBadge,
                {
                  backgroundColor: task.completed ? COLORS.completedGreen : COLORS.primary,
                },
              ]}
              onPress={handleToggle}
            >
              <Ionicons
                name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={COLORS.white}
              />
              <Text style={styles.statusText}>
                {task.completed ? 'Completed' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Ionicons
              name={editMode ? 'close-circle-outline' : 'create-outline'}
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {editMode ? (
          <View style={styles.editSection}>
            <Text style={styles.editLabel}>Title</Text>
            <TextInput
              style={styles.editInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Task title"
              placeholderTextColor={COLORS.textLight}
            />
            <Text style={styles.editLabel}>Notes</Text>
            <TextInput
              style={[styles.editInput, styles.editTextArea]}
              value={editedNotes}
              onChangeText={setEditedNotes}
              placeholder="Add notes..."
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <CustomButton
              title="Save Changes"
              variant="primary"
              onPress={handleSaveEdit}
              style={{ marginTop: 12 }}
            />
          </View>
        ) : (
          <>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <DetailRow icon="book-outline" label="Subject" value={task.subject} />
            <DetailRow
              icon="calendar-outline"
              label="Due Date"
              value={task.dueDate}
            />
            <DetailRow
              icon="flag-outline"
              label="Priority"
              value={task.priority}
              valueColor={priorityColor[task.priority]}
            />
            {task.notes ? (
              <View style={styles.notesSection}>
                <Text style={styles.notesLabel}>Notes</Text>
                <Text style={styles.notesText}>{task.notes}</Text>
              </View>
            ) : null}
          </>
        )}
      </View>

      <CustomButton
        title="Delete Task"
        variant="danger"
        onPress={handleDelete}
        style={{ marginTop: 16 }}
      />
      <CustomButton
        title="Back to Home"
        variant="outline"
        onPress={() => navigation.navigate('Home')}
        style={{ marginTop: 10 }}
      />
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    ...SHADOWS.medium,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '700',
  },
  taskTitle: {
    fontSize: SIZES.xxlarge,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailIcon: {
    marginRight: 10,
    width: 24,
  },
  detailLabel: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.textMedium,
  },
  detailValue: {
    fontSize: SIZES.medium,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  notesSection: {
    marginTop: 16,
  },
  notesLabel: {
    fontSize: SIZES.small,
    fontWeight: '700',
    color: COLORS.textMedium,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  notesText: {
    fontSize: SIZES.medium,
    color: COLORS.textDark,
    lineHeight: 22,
  },
  editSection: {
    marginTop: 8,
  },
  editLabel: {
    fontSize: SIZES.small,
    fontWeight: '700',
    color: COLORS.textMedium,
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  editInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: SIZES.medium,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editTextArea: {
    height: 80,
    paddingTop: 10,
  },
});

export default TaskDetailsScreen;
