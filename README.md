# UA Messenger

UA Messenger is a cross-platform social messaging and feed app built with Expo and React Native. It features user authentication, posting with images and captions, real-time notifications, and interactive social elements.

## Features

- **User Authentication:** Secure sign-in, registration, and session management with Clerk.
- **Feed & Posts:** View a timeline of posts from all users, each post supporting images, captions, likes, bookmarks, and comments.
- **Stories:** An Instagram-like stories section for ephemeral content.
- **Notifications:** Real-time notifications for:
  - Likes on your posts
  - New comments on your posts
  - New followers
- **Bookmarking:** Save posts to revisit later.
- **Profile Pages:** User profiles with their posts and avatar.
- **Mobile-First:** Runs on iOS & Android (supports emulators and Expo Go).

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npx expo start
   ```

   You'll have options to open the app in:
   - Android emulator
   - iOS simulator
   - Expo Go

3. **Project Structure:**
   - Main app directory: `/app`
   - Convex backend functions: `/convex`
   - UI components: `/components`
   - Styles and themes: `/constants`, `/styles`

4. **Reset to a fresh project:**
   ```bash
   npm run reset-project
   ```

## Core Technologies

- **React Native** (Expo, TypeScript)
- **Convex** (serverless backend API and persistence)
- **Clerk** (user authentication)
- **Expo Router** (file-based navigation)
- **Expo Plugins:** Image picker, secure store, splash screens, status bar, and more

## Development

- Add or update code in the `/app` directory
- Backend (database, business logic) in `/convex`
- Styles live in `/styles` and `/constants`
- See `package.json` for all available scripts

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Convex documentation](https://docs.convex.dev/)
- [Clerk documentation](https://clerk.dev/docs/)
- [React Native](https://reactnative.dev/)

---

**Contributions are welcome!** Open issues or pull requests to help improve this messenger app for the Ukrainian community.
