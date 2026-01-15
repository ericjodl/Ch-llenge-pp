# ChällengeÄpp

> Jeden Tag eine kleine Challenge – Spaß garantiert!

Eine mobile App für iOS und Android, die täglich kleine, lustige Herausforderungen bietet. Mit Gamification-Features, Achievements und einem Fortschrittssystem.

## Features

### Tägliche Challenges
- Zufällige Challenges aus verschiedenen Kategorien
- Personalisiert nach Nutzerpräferenzen
- Swipe-Gesten zum schnellen Erledigen/Überspringen

### Challenge-Kategorien
- 🎨 **Kreativ**: Malen, Schreiben, Basteln
- 💪 **Sportlich**: Mini-Workouts, Bewegungsspiele
- 😂 **Lustig**: Kleine Streiche, humorvolle Aufgaben
- ❤️ **Sozial**: Anderen eine Freude machen
- 🔬 **Experiment**: Neues ausprobieren

### Gamification
- **Punkte-System**: Leicht (5), Mittel (10), Schwer (20) Punkte
- **Level-System**: Level aufsteigen durch Punkte sammeln
- **Achievements**: Über 20 verschiedene Abzeichen
- **Streaks**: Tägliche Serien für extra Motivation

### Weitere Features
- 📅 Kalender-Übersicht aller erledigten Challenges
- 🏆 Achievement-System mit verschiedenen Kategorien
- ⚙️ Anpassbare Einstellungen (Kategorien, Schwierigkeit)
- 🎉 Confetti-Animation bei erledigten Challenges

## Tech Stack

- **Framework**: React Native / Expo
- **Navigation**: React Navigation (Bottom Tabs)
- **State Management**: React Context + AsyncStorage
- **Styling**: StyleSheet mit Theme-Konstanten
- **Animationen**: React Native Reanimated, Confetti

## Installation

```bash
# Dependencies installieren
npm install

# App starten
npx expo start
```

## Projektstruktur

```
src/
├── components/       # Wiederverwendbare UI-Komponenten
│   ├── ChallengeCard.tsx
│   ├── ProgressBar.tsx
│   ├── AchievementBadge.tsx
│   └── ...
├── screens/          # App-Screens
│   ├── TodayScreen.tsx
│   ├── CalendarScreen.tsx
│   ├── AchievementsScreen.tsx
│   └── SettingsScreen.tsx
├── context/          # State Management
│   └── AppContext.tsx
├── data/             # Statische Daten
│   ├── challenges.ts
│   └── achievements.ts
├── navigation/       # Navigation Setup
│   └── AppNavigator.tsx
├── constants/        # Theme & Konstanten
│   └── theme.ts
├── types/            # TypeScript Types
│   └── index.ts
└── utils/            # Hilfsfunktionen
    ├── helpers.ts
    └── storage.ts
```

## Zielgruppe

Jugendliche & Erwachsene (13–40 Jahre), die:
- Kleine Alltags-Herausforderungen lieben
- Motivation und Kreativität suchen
- Gamification und Social Features mögen

## Lizenz

MIT
