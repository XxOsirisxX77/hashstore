# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
HashStore is a React Native mobile application built with Expo SDK 52 (migrated from SDK 32). It's a social commerce platform featuring Instagram-style photo sharing with business capabilities, allowing users to discover stores, browse products, and view media content.

## Migration Status
- ✅ Updated from Expo SDK 32 to SDK 52
- ✅ Migrated React Navigation from v3 to v7
- ✅ Updated font loading to use config plugins
- ✅ Updated deprecated Expo APIs (SecureStore, KeepAwake)
- ⚠️ NativeBase v3 has compatibility issues (deprecated, use gluestack-ui for new development)
- ⚠️ Facebook authentication disabled (needs migration to react-native-fbsdk-next)
- ⚠️ Some packages may need further updates for full compatibility

## Development Commands
- `npm start` or `expo start` - Start the Expo development server
- `npm run android` or `expo start --android` - Start with Android emulator/device
- `npm run ios` or `expo start --ios` - Start with iOS simulator/device
- `npm run web` or `expo start --web` - Start web version
- `npm install --legacy-peer-deps` - Install dependencies (required due to NativeBase compatibility issues)

## Architecture & Structure

### Navigation System
The app uses React Navigation v3 with a sophisticated multi-level navigation structure:
- **Switch Navigator** at root level handles authentication states (SignedOut/SignedIn/SignedInBusiness)
- **Tab Navigators** for main app sections (different layouts for regular users vs business users)
- **Stack Navigators** for each tab section to handle screen hierarchy

Key navigation files:
- `Navigation.js` - Contains all navigation configuration and routing logic
- Navigation state is determined by user authentication type (0=signed out, 1=signed in, 2=business user)

### Authentication & API Integration
- Uses Expo SecureStore for token management
- Instagram OAuth integration for user authentication
- Bearer token system for API authorization
- Base API URL configured in `services/AuthService.js` (currently pointing to AWS EC2 instance)

### Services Architecture
All business logic is separated into service files in `/services/`:
- `AuthService.js` - Authentication, token management, API base configuration
- `UserService.js` - User profile operations
- `HomeService.js` - Home screen data (categories, discovery)
- `CategoryService.js` - Category-related operations
- `MediaService.js` - Media/content management
- `UtilService.js` - Utility functions

### UI Components & Styling
- Uses NativeBase UI library for consistent components
- Custom global styles in `styles/GlobalStyle.ts`
- Responsive scaling with `react-native-size-matters`
- Custom fonts (Sukhumvit family) loaded in App.js
- Icon system using FontAwesome via `react-native-vector-icons`

### Internationalization
- i18n support configured in `config/i18n.js`
- Language files in `/lang/` directory (English/Spanish)
- Uses `i18n-js` library

### Key Features
1. **User Types**: Regular users and business users with different UI/navigation
2. **Media Management**: Upload, review, and manage visual content
3. **Discovery System**: Browse popular categories and discover new stores
4. **Profile System**: User profiles with Instagram-style media grids
5. **Search**: Category-based search functionality

### State Management
- Component-level state management (no Redux/Context API detected)
- Navigation-based parameter passing between screens
- Service-layer for data persistence and API calls

## Development Notes
- **RECENTLY MIGRATED**: Project updated from Expo SDK 32 to SDK 52
- React Navigation updated to v7 with modern component-based API
- TypeScript support added (tsconfig.json auto-generated)
- New Architecture enabled by default in Expo SDK 52
- No testing framework configured
- Uses React Native 0.76.9 via Expo SDK 52

## Known Issues & TODOs
1. **NativeBase**: Deprecated and has React version conflicts. Consider migrating to gluestack-ui
2. **Facebook Auth**: Commented out, needs migration to react-native-fbsdk-next + development build
3. **Vector Icons**: Package moved to per-icon-family model, consider updating
4. **Dependencies**: Some peer dependency warnings due to React version mismatches
5. **Instagram Login**: May need updates for current Instagram API
6. **Testing**: No testing framework - consider adding Jest/Testing Library