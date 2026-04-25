import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { addTask } from '../store/tasksSlice';
import CustomButton from '../components/CustomButton';
import { useFadeIn, useSlideUp } from '../animations/AnimationHooks';
import { Animated } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

const AddTaskScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);

  const formOpacity = useFadeIn(500);
  const { translateY, opacity } = useSlideUp(30, 500, 100);

  const handleAddTask = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a task title before saving.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      subject: subject.trim(),
      dueDate: dueDate.trim(),
      priority,
      notes: notes.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    dispatch(addTask(newTask));

    Alert.alert('Task Added!', `"${newTask.title}" has been added to your list.`, [
      { text: 'Add Another', onPress: clearForm },
      { text: 'Go Home', onPress: () => navigation.navigate('Home') },
    ]);
  };

  const clearForm = () => {
    setTitle('');
    setSubject('');
    setDueDate('');
    setPriority('Medium');
    setNotes('');
  };

  const priorityColor = { High: COLORS.danger, Medium: COLORS.accent, Low: COLORS.secondary };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View style={[styles.inner, { opacity: formOpacity }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          <Animated.View style={{ opacity, transform: [{ translateY }] }}>
            <Text style={styles.sectionLabel}>Task Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read Chapter 5"
              placeholderTextColor={COLORS.textLight}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />

            <Text style={styles.sectionLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mathematics"
              placeholderTextColor={COLORS.textLight}
              value={subject}
              onChangeText={setSubject}
            />

            <Text style={styles.sectionLabel}>Due Date</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dec 15, 2025"
              placeholderTextColor={COLORS.textLight}
              value={dueDate}
              onChangeText={setDueDate}
            />

            <Text style={styles.sectionLabel}>Priority</Text>
            <TouchableOpacity
              style={[
                styles.prioritySelector,
                { borderColor: priorityColor[priority] },
              ]}
              onPress={() => setPriorityModalVisible(true)}
            >
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: priorityColor[priority] },
                ]}
              />
              <Text style={[styles.priorityLabel, { color: priorityColor[priority] }]}>
                {priority}
              </Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.textLight} />
            </TouchableOpacity>

            <Text style={styles.sectionLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any extra details..."
              placeholderTextColor={COLORS.textLight}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.btnRow}>
              <CustomButton
                title="Cancel"
                variant="outline"
                size="medium"
                onPress={() => navigation.goBack()}
                style={{ flex: 1, marginRight: 8 }}
              />
              <CustomButton
                title="Save Task"
                variant="primary"
                size="medium"
                onPress={handleAddTask}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>

      {/* Priority Picker Modal */}
      <Modal
        visible={priorityModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPriorityModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPriorityModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Priority</Text>
            {PRIORITY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.modalOption,
                  priority === opt && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setPriority(opt);
                  setPriorityModalVisible(false);
                }}
              >
                <View style={[styles.priorityDot, { backgroundColor: priorityColor[opt] }]} />
                <Text style={styles.modalOptionText}>{opt}</Text>
                {priority === opt && (
                  <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionLabel: {
    fontSize: SIZES.small,
    fontWeight: '700',
    color: COLORS.textMedium,
    marginBottom: 6,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: SIZES.medium,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  prioritySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 2,
    gap: 8,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  priorityLabel: {
    flex: 1,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    width: '80%',
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 10,
  },
  modalOptionSelected: {
    backgroundColor: '#EEF4FC',
  },
  modalOptionText: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.textDark,
    fontWeight: '500',
  },
});

export default AddTaskScreen;
