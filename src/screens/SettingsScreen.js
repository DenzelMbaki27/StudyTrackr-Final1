import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setMotivationalQuote } from '../store/tasksSlice';
import { useFadeIn } from '../animations/AnimationHooks';
import { Animated } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showQuotes, setShowQuotes] = useState(true);

  const opacity = useFadeIn(500);

  const handleFetchQuote = () => {
    const STUDY_TIPS = [
      'Break your work into small steps and reward yourself after each one.',
      'Review your notes within 24 hours to boost retention by 80%.',
      'The best time to study is when your mind is fresh — morning works for many.',
      'Consistency beats intensity. Study 30 minutes daily over cramming all night.',
      'Teach what you learned to someone else — it deepens your understanding.',
      'Take a 5-minute break for every 25 minutes of focused study.',
      'Stay hydrated. Dehydration reduces concentration significantly.',
    ];
    const quote = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
    dispatch(setMotivationalQuote(quote));
    Alert.alert('Quote Updated!', quote);
  };

  const SettingRow = ({ icon, title, subtitle, right }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
      </View>
      <View>{right}</View>
    </View>
  );

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Preferences</Text>
        <SettingRow
          icon="notifications-outline"
          title="Reminders"
          subtitle="Task due date alerts"
          right={
            <Switch
              value={notificationsOn}
              onValueChange={setNotificationsOn}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          }
        />
        <SettingRow
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Coming soon"
          right={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
              disabled
            />
          }
        />
        <SettingRow
          icon="bulb-outline"
          title="Study Tips Banner"
          subtitle="Show tips on home screen"
          right={
            <Switch
              value={showQuotes}
              onValueChange={setShowQuotes}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Motivation</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={handleFetchQuote}>
          <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionBtnText}>Refresh Study Tip</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.appName}>StudyTrackr</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.authors}>
            CPAN 213 — Group 2{'\n'}
            Denzel Mbaki • Sadiq Issa{'\n'}
            Silas Kajinaki • Harmanjeet Kaur
          </Text>
        </View>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: SIZES.small,
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
    ...SHADOWS.small,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  settingSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    ...SHADOWS.small,
    gap: 12,
  },
  actionBtnText: {
    flex: 1,
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  aboutCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  appName: {
    fontSize: SIZES.xlarge,
    fontWeight: '800',
    color: COLORS.primary,
  },
  version: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 4,
    marginBottom: 12,
  },
  authors: {
    fontSize: SIZES.small,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;
