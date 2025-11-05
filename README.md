InstantDB SQLite App
This is a React Native todo list application built with Expo that demonstrates how to integrate InstantDB (a real-time database) with SQLite for local storage persistence.

Core Technology Stack
React Native + Expo - Cross-platform mobile framework
InstantDB (@instantdb/react-native) - Real-time database with automatic sync
Expo SQLite - Local SQLite database for persistent storage
Expo Router - File-based navigation system
TypeScript - Type-safe development
Key Features
1. Todo Management (app/todo/index.tsx:1)
Create, read, update, and delete todos
Toggle completion status
Real-time synchronization across devices
Bulk operations (add 100 tasks for testing)
Visual task counter
2. Custom SQLite Storage Layer (lib/instant/ExpoSQLiteStorage.ts:1)
The app implements a custom storage adapter that:

Uses SQLite as the persistence layer instead of AsyncStorage
Implements the storage interface required by InstantDB
Provides additional features:
Batch operations for performance (transactions)
Storage analytics (key count, database size)
Data cleanup (remove old records)
Indexed queries for fast lookups
3. Settings & Storage Management (app/settings/index.tsx:1)
View storage statistics (item count, database size)
Export/import data capabilities
Clear all data functionality
Real-time storage monitoring
Architecture Highlights
Data Schema (instant.schema.ts:1):

todos: {
  title: string
  completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}
Storage Integration (lib/instant/InstantConfig.ts:1):

Creates a SQLite database named instant_app.db
Wraps the SQLite API to match InstantDB's storage interface
Enables automatic persistence of all InstantDB operations
Real-time Sync:

Uses InstantDB's useQuery hook for reactive queries
Automatic optimistic updates
Offline-first architecture (works without internet)
Data syncs automatically when connection is restored
UI/UX Features
Clean, minimal iOS-inspired design
Safe area handling for modern devices
Status bar styling
Loading states with spinner
Empty states with helpful messages
Keyboard avoidance for inputs
Touch feedback on buttons
Development Features
"Add 100" button for performance testing
Storage info displayed on home screen (updates every 5 seconds)
Real-time storage metrics in settings
Error handling with user-friendly alerts
This app effectively demonstrates how to build an offline-first mobile application with real-time sync capabilities while maintaining full control over the local storage layer using SQLite for better performance and data management.
