import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { toggleTask, deleteTask } from '../store/tasksSlice';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import { useFadeIn, useSlideUp, usePulse } from '../animations/AnimationHooks';
import { Animated } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { taskList, motivationalQuote } = useSelector(state => state.tasks);

  const headerOpacity = useFadeIn(500);
  const { translateY: bannerSlide, opacity: bannerOpacity } = useSlideUp(20, 600, 200);
  const pulseScale = usePulse();

  const completedCount = taskList.filter(t => t.completed).length;

  const handleToggle = useCallback((id) => {
    dispatch(toggleTask(id));
  }, [dispatch]);

  const handleDelete = useCallback((id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to remove this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteTask(id)),
        },
      ]
    );
  }, [dispatch]);

  const handlePress = useCallback((task) => {
    navigation.navigate('TaskDetails', { task });
  }, [navigation]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={64} color={COLORS.border} />
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptySubtitle}>Tap the + button to add your first study task</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View>
          <Text style={styles.greeting}>Hello, Student 👋</Text>
          <Text style={styles.headerTitle}>My Study Tasks</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.textMedium} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.progressCard,
          { opacity: bannerOpacity, transform: [{ translateY: bannerSlide }] },
        ]}
      >
        <ProgressBar completed={completedCount} total={taskList.length} />
      </Animated.View>

      {motivationalQuote ? (
        <Animated.View
          style={[
            styles.quoteCard,
            { transform: [{ scale: pulseScale }] },
          ]}
        >
          <Ionicons name="bulb-outline" size={16} color={COLORS.accent} />
          <Text style={styles.quoteText} numberOfLines={2}>
            {motivationalQuote}
          </Text>
        </Animated.View>
      ) : null}

      <FlatList
        data={taskList}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <TaskCard
            task={item}
            index={index}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onPress={handlePress}
          />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={taskList.length === 0 ? styles.flatListEmpty : styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
  headerTitle: {
    fontSize: SIZES.xxlarge,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  settingsBtn: {
    padding: 8,
  },
  progressCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#FFFBEE',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    gap: 8,
  },
  quoteText: {
    flex: 1,
    fontSize: SIZES.small,
    color: COLORS.textMedium,
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 4,
  },
  flatListEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: SIZES.xlarge,
    fontWeight: '700',
    color: COLORS.textMedium,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: SIZES.medium,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
});

export default HomeScreen;
