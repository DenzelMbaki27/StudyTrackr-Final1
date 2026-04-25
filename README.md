# StudyTrackr – Phase 2
**CPAN 213 Cross-Platform Mobile Development**
Group 2 | Member 4: Harmanjeet Kaur

---

## Member Contribution: Navigation, Animations & Testing

This branch covers **Harmanjeet Kaur's** assigned responsibilities:

| Area | Files |
|------|-------|
| Navigation | `src/navigation/AppNavigator.js` |
| Animations | `src/animations/AnimationHooks.js` |
| Animated Components | `src/components/TaskCard.js`, `src/components/CustomButton.js`, `src/components/ProgressBar.js` |
| Screens (navigation-wired) | `src/screens/HomeScreen.js`, `AddTaskScreen.js`, `TaskDetailsScreen.js`, `ProgressScreen.js`, `SettingsScreen.js` |
| Tests | `__tests__/` |

---

## Project Structure

```
StudyTrackr-Harmanjeet/
├── App.js
├── app.json
├── babel.config.js
├── jest.setup.js
├── package.json
├── src/
│   ├── constants.js
│   ├── animations/
│   │   └── AnimationHooks.js       ← All animation logic
│   ├── components/
│   │   ├── CustomButton.js         ← Animated press-feedback button
│   │   ├── ProgressBar.js          ← Animated progress bar
│   │   └── TaskCard.js             ← Staggered entrance + bounce/shake
│   ├── navigation/
│   │   └── AppNavigator.js         ← Stack + Bottom Tab navigation
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── AddTaskScreen.js
│   │   ├── TaskDetailsScreen.js
│   │   ├── ProgressScreen.js
│   │   └── SettingsScreen.js
│   └── store/
│       ├── index.js
│       └── tasksSlice.js
└── __tests__/
    ├── animations/
    │   └── AnimationHooks.test.js
    ├── components/
    │   ├── CustomButton.test.js
    │   ├── ProgressBar.test.js
    │   └── TaskCard.test.js
    ├── navigation/
    │   └── Navigation.test.js
    └── store/
        └── tasksSlice.test.js
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator, or the **Expo Go** app on your phone

### Install

```bash
cd StudyTrackr-Harmanjeet
npm install
```

### Run the App

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `i` for iOS simulator / `a` for Android.

### Run Tests

```bash
npm test
```

Run once (no watch mode):
```bash
npx jest --runInBand
```

Run a specific test file:
```bash
npx jest __tests__/store/tasksSlice.test.js
```

---

## Navigation Architecture

```
AppNavigator (NavigationContainer)
└── Bottom Tab Navigator
    ├── HomeTab → Stack
    │   ├── HomeScreen
    │   └── TaskDetailsScreen
    ├── AddTaskTab → Stack
    │   └── AddTaskScreen
    ├── ProgressTab → Stack
    │   └── ProgressScreen
    └── SettingsTab → Stack
        └── SettingsScreen
```

**Custom Tab Bar** renders a floating "+" Add button in the center with shadow and animated press states.

**Stack Transitions** use a custom `cardStyleInterpolator` that fades + slides from the right.

---

## Animation Summary

| Hook | Effect | Used In |
|------|--------|---------|
| `useFadeIn` | Opacity 0 → 1 | Screen entry |
| `useSlideUp` | Slide + fade on mount | Cards, banners |
| `useScaleBounce` | Spring scale pop | Task toggle |
| `useShake` | Horizontal shake | Delete feedback |
| `useProgressAnimation` | Animated width (color shifts) | Progress bar |
| `usePulse` | Looping gentle scale | Quote banner |
| `useStaggeredEntrance` | Staggered slide-in per index | FlatList items |

---

## Test Coverage

| Test File | Covers |
|-----------|--------|
| `AnimationHooks.test.js` | All 7 animation hooks |
| `CustomButton.test.js` | Variants, sizes, press, disabled, loading |
| `ProgressBar.test.js` | Labels, percentages, edge cases |
| `TaskCard.test.js` | Render, press, toggle, completed state |
| `tasksSlice.test.js` | All Redux actions + reducer logic |
| `Navigation.test.js` | All 5 screens rendered, navigation flow, store integration |
