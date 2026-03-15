# HackOS Mobile App

A modern, highly-scalable mobile application designed for centralized hackathon management. Built with **React Native** and **Expo**, it features a clean SaaS/mainframe-styled UI tailored for different roles: Hackers, Mentors/Judges, and Event Staff.

## Features

- **Role-Based Access Control (RBAC):** Simulated login system that routes users cleanly based on input credentials.
- **Dynamic Theming:** A beautiful light mainframe/SaaS hybrid design system using `react-native-safe-area-context` and custom styles.
- **Tab Navigation Mode:**
  - **DASH (Dashboard):** Real-time event statistics, active sessions, and hardware resource monitoring.
  - **TACTICS (Team Lobby):** Squad formation, active LFG (Looking for Group) status toggles, interactive labels for tags like *#AI*, *#Solidity*, and team joining via private invite codes.
  - **LOGS (Admin God Mode):** A command center view for Event Staff/Mentors, featuring venue pulse metrics, live system event queues (GIT_PUSH, OAUTH_LOGIN, etc.), and a critical action queue.
  - **SUBMIT (Project Integration):** Simple UI to fetch GitHub repository details, define tech stacks via dynamic tags, and finalize project submissions.

## Tech Stack
- [React Native](https://reactnative.dev/)
- [Expo (Expo Router)](https://expo.dev/)
- [Zustand](https://github.com/pmndrs/zustand) (State Management - Context & Roles)
- [Lucide React Native](https://lucide.dev/) (Scalable vector icons)

## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed. Since this is an Expo project, it is highly recommended to have the [Expo Go](https://expo.dev/client) app installed on your iOS or Android device.

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd mobile\ app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

### Running the App

After running `npx expo start`, a terminal window will open with a QR code.
- **iOS:** Open your Camera app and scan the QR code to open the app in Expo Go.
- **Android:** Use the Expo Go app to scan the QR code.
- **Web Browser (Locally):** Press `w` in the terminal to open the UI directly in a Chrome/Edge window.

## Default Test Credentials
Any password works (e.g., `hackos2024`). The ecosystem automatically assigns roles based on the email provided:
- **Participant (Hacker):** `hacker@hackos.com`
- **Mentor or Judge:** `mentor@company.com`
- **Admin or Event Staff:** `admin@hackos.com` or `staff@company.com`

## Folder Structure

```
mobile app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Configures the global bottom Navigation Bar
│   │   ├── dashboard.tsx    # HackOS DASH screen
│   │   ├── team.tsx         # HackOS TACTICS (Lobby) screen
│   │   ├── help.tsx         # HackOS LOGS (God Mode) screen
│   │   └── qr.tsx           # HackOS SUBMIT screen
│   ├── _layout.tsx          # Global entry layout wrapper
│   └── index.tsx            # Modern Login & Sign Up Screen
├── store/
│   └── useUserStore.ts      # Zustand implementation for local state retention
├── package.json
└── README.md                # You are here!
```

---
*Developed for the HackOS Platform infrastructure.* 🚀
