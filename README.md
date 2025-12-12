# NaXum Mobile App

A React Native mobile application built with Expo for team management, task assignment, and collaboration. This app enables leaders to build and manage their sales teams, assign tasks, and track performance.

## Tech Stack

- **Framework**: Expo ~51.0.0
- **Language**: TypeScript (strict mode)
- **UI Library**: React Native 0.74.5
- **State Management**: Zustand
- **Navigation**: React Navigation (Native Stack)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Storage**: Expo Secure Store (for JWT tokens)

## Features

### Core Features ✅

#### 1. Authentication
- **Email/Password Login & Registration**: Secure authentication with JWT tokens
- **Persistent Auth State**: Automatic session restoration on app launch
- **Role-Based Access**: Leader and Member roles with different permissions
- **Phone Number Required**: Phone number is required during registration for invitation matching
- **Error Handling**: User-friendly error messages for invalid credentials

#### 2. Contact Import & Team Invitations
- **Phone Contacts Permission**: Requests and handles contacts permission gracefully
- **Searchable Contact List**: Filter contacts by name or phone number
- **Invitation Status Tracking**: 
  - Shows "Invited" for pending/accepted invitations
  - Shows "Member" for existing team members
  - Prevents duplicate invitations
- **Share Invitations**: Share invitation links via OS share sheet
- **Status Refresh**: Automatically updates invitation status after sending

#### 3. Team Management
- **Team Member List**: View all team members with pull-to-refresh
- **Member Profiles**: View member details (name, email, join date)
- **Team Hierarchy**: Visual tree view showing who invited whom
- **Role-Based Views**: Leaders see full team, members see their team context

#### 4. Task/Goal Assignment
- **Create Tasks**: Leaders can assign tasks to team members
- **Task Filters**: Filter by status (All, Open, Completed)
- **Task Details**: View full task details including description
- **Mark Complete**: Members can mark assigned tasks as complete
- **Duplicate Prevention**: Prevents creating duplicate tasks for the same user
- **Completion Tracking**: Track task completion by member

### Bonus Features ✅

#### Team Dashboard
- **Team Statistics**: 
  - Total team size
  - Active members count
  - Task completion rate
- **Pull-to-Refresh**: Refresh dashboard data
- **Leader-Only Access**: Dashboard available only for leaders

## Project Structure

```
src/
├── app/                    # Navigation setup
│   ├── AppNavigator.tsx   # Main navigation component
│   └── routes.ts          # Route type definitions
├── components/            # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Row.tsx
├── domain/               # Business logic & types
│   ├── hierarchy.ts      # Team hierarchy utilities
│   └── types.ts          # TypeScript type definitions
├── hooks/                # Custom React hooks
│   ├── useAuthBootstrap.ts
│   └── useContactsPermission.ts
├── screens/              # Screen components
│   ├── Auth/             # Login, Register
│   ├── Contacts/         # Contact import & invitations
│   ├── Dashboard/        # Team statistics
│   ├── Home/             # Main tab navigation
│   ├── Leader/           # Leader-specific screens
│   ├── Member/           # Member-specific screens
│   ├── Tasks/            # Task management
│   └── Team/             # Team management
├── services/             # API & external services
│   ├── api/              # API client & endpoints
│   ├── auth/             # Authentication utilities
│   └── contacts/         # Contact service
├── stores/               # Zustand state management
│   ├── auth.store.ts
│   ├── invitations.store.ts
│   ├── tasks.store.ts
│   └── team.store.ts
└── utils/                # Utility functions
    └── phoneUtils.ts     # Phone number utilities

tests/                    # Test files
├── auth.store.test.ts
├── hierarchy.test.ts
└── tasks.store.test.ts
```

## Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Expo CLI** (optional, but recommended):
  ```bash
  npm install -g expo-cli
  ```
- **Android Studio** (for Android development) - [Download](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - Available on Mac App Store

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd don-mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - React Native and Expo dependencies
   - TypeScript and type definitions
   - Testing libraries (Jest, React Testing Library)
   - Development tools (ESLint, Prettier)

3. **Configure environment variables**
   
   Create a `.env` file in the root directory by copying the example:
   ```bash
   # On Unix/macOS
   cp .env.example .env
   
   # On Windows
   copy .env.example .env
   ```
   
   Then edit `.env` and set your API base URL:
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
   ```
   
   See the [Environment Variables](#environment-variables) section below for detailed documentation.

4. **Start the development server**
   ```bash
   npm start
   ```
   
   This will start the Expo development server and open the Expo DevTools in your browser.

5. **Run on device/emulator**
   
   Once the development server is running, you can:
   - Press `a` to open on Android emulator/device
   - Press `i` to open on iOS simulator (macOS only)
   - Scan the QR code with the **Expo Go** app on your physical device
   - Press `w` to open in web browser

### First-Time Setup Troubleshooting

**If you encounter issues:**

- **Metro bundler errors**: Try clearing the cache:
  ```bash
  npm start -- --clear
  ```

- **Android build issues**: Ensure Android Studio and Android SDK are properly installed
- **iOS build issues**: Ensure Xcode Command Line Tools are installed:
  ```bash
  xcode-select --install
  ```

- **Environment variables not loading**: 
  - Ensure your `.env` file is in the root directory
  - Restart the Expo development server after creating/modifying `.env`
  - For Expo, environment variables must be prefixed with `EXPO_PUBLIC_`

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Error Handling**: Consistent error handling across the app
- **Loading States**: All async operations show loading indicators

## Testing

### Test Coverage

The project includes unit tests for critical business logic:

1. **Auth Store Tests** (`tests/auth.store.test.ts`)
   - Tests authentication store initialization

2. **Hierarchy Tests** (`tests/hierarchy.test.ts`)
   - Tests team hierarchy flattening logic
   - Validates depth calculation

3. **Tasks Store Tests** (`tests/tasks.store.test.ts`)
   - Tests tasks store initialization

### Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode (for development):
```bash
npm test -- --watch
```

Run tests with coverage:
```bash
npm test -- --coverage
```

### Test Configuration

The project uses Jest with the following configuration:
- **Preset**: `react-native` - Optimized for React Native testing
- **Test Framework**: Jest with TypeScript support via Babel
- **Mocking**: Native modules (like `expo-secure-store`) are automatically mocked
- **Test Location**: All test files are in the `tests/` directory with `.test.ts` extension

### Testing Strategy

- **Unit Tests**: Test individual functions and utilities
- **Store Tests**: Test Zustand store logic and state management
- **Integration Tests**: Test API integration (when backend is available)
- **Component Tests**: UI component testing with React Testing Library (when needed)

### Writing Tests

Example test structure:
```typescript
import { useTasksStore } from '../src/stores/tasks.store';

describe('TasksStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTasksStore.setState({
      tasks: [],
      loading: false,
      error: null,
    });
  });

  it('should initialize with empty tasks', () => {
    const state = useTasksStore.getState();
    expect(state.tasks).toEqual([]);
  });
});
```

## Performance Optimizations

### Implemented Optimizations

1. **FlatList Performance**
   - `initialNumToRender`: Optimized for initial render
   - `windowSize`: Reduced for better memory usage
   - `maxToRenderPerBatch`: Controlled batch rendering
   - `removeClippedSubviews`: Removes off-screen views
   - `getItemLayout`: Provided for consistent item heights

2. **Memoization**
   - `useMemo` for expensive computations
   - `useCallback` for stable function references
   - Optimized re-renders in list components

3. **Phone Number Matching**
   - Efficient phone number normalization
   - Optimized lookup with Map data structures
   - Reduced redundant computations

4. **API Optimization**
   - Request/response interceptors for consistent error handling
   - Automatic token refresh on 401 errors
   - Optimistic updates where appropriate

## Architecture

### State Management

Uses **Zustand** for state management with separate stores for:
- **Auth Store**: User authentication and session
- **Tasks Store**: Task management and filtering
- **Team Store**: Team members and hierarchy
- **Invitations Store**: Invitation management

### API Client

- Centralized API client with Axios
- Automatic JWT token injection
- Response interceptors for error handling
- Consistent error message extraction

### Navigation

- React Navigation with Native Stack
- Type-safe navigation with TypeScript
- Role-based screen access

## Environment Variables

This project uses environment variables for configuration. All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the Expo app.

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | Base URL for the backend API | `http://localhost:4000` | `https://api.example.com` |

### Setup

1. **Create `.env` file**
   
   Create a `.env` file in the root directory of the project:
   ```bash
   touch .env
   ```

2. **Add environment variables**
   
   Add your configuration to the `.env` file:
   ```env
   # API Configuration
   EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
   ```

3. **Environment-specific files**
   
   You can create environment-specific files:
   - `.env.development` - Development environment
   - `.env.production` - Production environment
   - `.env.local` - Local overrides (gitignored)

### Usage in Code

Environment variables are accessed using `process.env`:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
```

### Important Notes

- ⚠️ **Never commit `.env` files** - They are already in `.gitignore`
- ✅ **Do commit `.env.example`** - This serves as a template for other developers
- 🔒 **Sensitive data**: Never put sensitive data in environment variables that start with `EXPO_PUBLIC_` as they are bundled into the app
- 🔄 **Restart required**: After changing environment variables, restart the Expo development server

### Production Deployment

For production builds, set environment variables in your CI/CD pipeline or hosting platform:

- **EAS Build**: Use `eas.json` or EAS Secrets
- **Expo CLI**: Use `expo build` with environment variables
- **Local builds**: Set variables before running build commands

## Security

- **JWT Tokens**: Stored securely using Expo Secure Store
- **Environment Variables**: Sensitive config in `.env` files (gitignored)
- **Input Validation**: Zod schemas for form validation
- **Error Handling**: No sensitive data in error messages
- **Public Variables**: Only use `EXPO_PUBLIC_` prefix for non-sensitive configuration

## Error Handling

- **API Errors**: Consistent error handling with user-friendly messages
- **Network Errors**: Graceful degradation
- **Validation Errors**: Inline form validation
- **Permission Errors**: Clear permission request flows

## Known Limitations

- Phone number normalization relies on backend
- Push notifications not implemented (bonus feature)
- Activity feed not implemented (bonus feature)

## Future Enhancements

- Push notifications for team events
- Activity feed for team updates
- Offline support with data synchronization
- Advanced task filtering and sorting
- Team member search functionality
- Export team statistics

## Contributing

1. Follow TypeScript strict mode
2. Use ESLint and Prettier
3. Write tests for new features
4. Update README for significant changes
5. Follow existing code structure

## License

Private project - All rights reserved
