import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { COLORS, SIZES } from '../constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom header back button
const BackButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.backButton}>
    <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
  </TouchableOpacity>
);

// Shared header options for stack screens
const defaultStackOptions = {
  headerStyle: {
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleStyle: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  headerTintColor: COLORS.primary,
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width * 0.08, 0],
          }),
        },
      ],
    },
  }),
};

// Home stack (Home → TaskDetails)
const HomeStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TaskDetails"
      component={TaskDetailsScreen}
      options={({ navigation }) => ({
        title: 'Task Details',
        headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
      })}
    />
  </Stack.Navigator>
);

// Add Task stack
const AddTaskStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="AddTask"
      component={AddTaskScreen}
      options={({ navigation }) => ({
        title: 'New Task',
        headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
      })}
    />
  </Stack.Navigator>
);

// Progress stack
const ProgressStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="Progress"
      component={ProgressScreen}
      options={{ title: 'My Progress' }}
    />
  </Stack.Navigator>
);

// Settings stack
const SettingsStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </Stack.Navigator>
);

// Custom bottom tab bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const tabs = [
    { name: 'HomeTab', icon: 'home', activeIcon: 'home', label: 'Home' },
    { name: 'AddTaskTab', icon: 'add-circle-outline', activeIcon: 'add-circle', label: 'Add' },
    { name: 'ProgressTab', icon: 'bar-chart-outline', activeIcon: 'bar-chart', label: 'Progress' },
    { name: 'SettingsTab', icon: 'settings-outline', activeIcon: 'settings', label: 'Settings' },
  ];

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabInfo = tabs[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const isAddButton = route.name === 'AddTaskTab';

        if (isAddButton) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.addTabBtn}
              activeOpacity={0.8}
            >
              <View style={[styles.addCircle, isFocused && styles.addCircleActive]}>
                <Ionicons name="add" size={28} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFocused ? tabInfo.activeIcon : tabInfo.icon}
              size={22}
              color={isFocused ? COLORS.tabActive : COLORS.tabInactive}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? COLORS.tabActive : COLORS.tabInactive },
              ]}
            >
              {tabInfo.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Root bottom tab navigator
const RootNavigator = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="HomeTab" component={HomeStack} />
    <Tab.Screen name="AddTaskTab" component={AddTaskStack} />
    <Tab.Screen name="ProgressTab" component={ProgressStack} />
    <Tab.Screen name="SettingsTab" component={SettingsStack} />
  </Tab.Navigator>
);

// Main app navigation export
const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  addTabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  addCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  addCircleActive: {
    backgroundColor: COLORS.primaryDark,
  },
  backButton: {
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 4,
  },
});

export default AppNavigator;
