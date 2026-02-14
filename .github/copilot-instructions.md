# Case Management App - AI Agent Instructions

## Architecture Overview

**Full-stack React + Node.js + Firebase application** for managing cases with role-based access (Admin/User).

### Component Structure
- **Frontend** (`frontend/`): React 19 SPA with Redux Toolkit state management
- **Backend** (`backend/`): Express.js REST API with Firebase Admin SDK
- **Database**: Firebase Firestore (collections: `cases`, `comments`, `users`)
- **Authentication**: Firebase Auth (email/password) + role stored in `users` collection

### Data Flow
1. **Auth Flow**: Firebase Auth → AuthContext reads user + role from `users` collection → Redux `authSlice` syncs state
2. **Cases Flow**: Frontend dispatches `setCases()` → API calls `/api/cases/*` → Backend queries Firestore → Redux `caseSlice` updates
3. **Comments Flow**: Nested under cases; queried via `/api/comments/:caseId` → stored in Firestore with `caseId` reference

## Project Structure Patterns

### Frontend (`frontend/src/`)
- **pages/**: Page-level components (Login, Signup, Dashboard, CaseDetails, CreateCase) - no complex logic
- **context/AuthContext.jsx**: Dual responsibility - manages current auth state AND dispatches to Redux. Wraps entire app.
- **redux/**: Two slices only - `authSlice` (user + role) and `caseSlice` (caseList + filterStatus)
- **services/api.js**: Axios instance configured for `baseURL: http://localhost:5000/api`
- **services/firebase.js**: Client-side Firebase initialization (auth + Firestore)

### Backend (`backend/`)
- **firebaseAdmin.js**: Initializes Firebase Admin SDK (currently unused - use `config/firebase.js`)
- **config/firebase.js**: Single Firebase Admin initialization - imported as `db` in routes
- **routes/**: Two route files mirror the two main features (cases + comments)
- **No controllers/**: Logic is inline in route handlers

## Critical Developer Workflows

### Running the App
```bash
# Terminal 1: Backend
cd backend && npm run dev          # Runs on port 5000 (nodemon watches)

# Terminal 2: Frontend
cd frontend && npm start           # Runs on port 3000 (React Scripts)
```

### Key Dependencies
- **Frontend**: React 19, Redux Toolkit, React Router 7, Firebase SDK v12.9, Axios
- **Backend**: Express 5.2, Firebase Admin v13.6, CORS, dotenv, nodemon (dev)

### Firebase Configuration
- **Front-end**: `frontend/src/services/firebase.js` (SDK credentials hardcoded - client-safe keys)
- **Backend**: `backend/config/firebase.js` (Admin SDK uses `config/serviceAccountKey.json`)
- `.gitignore` excludes: `node_modules/`, `firebaseKey.json`, `.env`, `config/serviceAccountKey.json`

## Project-Specific Conventions

### Redux State Shape
```javascript
// authSlice
{ currentUser: { uid, email, ... }, role: "admin" | "user" | null }

// caseSlice  
{ caseList: [...], filterStatus: "All" | "Open" | "In Progress" | "Closed" }
```

### Case Document Schema (Firestore)
Fields include: `title`, `description`, `status`, `createdBy`, `createdDate`, and more - inferred from Dashboard display logic.

### Comments Structure
Each comment references its case via `caseId` field - no subcollections used.

### API Endpoints
- `GET /api/cases` - List all cases
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case
- `POST /api/comments` - Add comment
- `GET /api/comments/:caseId` - Get comments for a case

## Integration Points & External Dependencies

### Firebase Client SDK (Frontend)
- **initializeApp()**, **getAuth()**, **getFirestore()**: Set up in `services/firebase.js`
- **onAuthStateChanged()**: Listener in AuthContext triggers Redux sync
- **createUserWithEmailAndPassword()**, **signInWithEmailAndPassword()**: Used in Login/Signup pages (inferred from feature list)
- Firestore queries: Direct reads via `getDoc()`, batch reads via `collection().where()`

### Firebase Admin SDK (Backend)
- **admin.initializeApp()**: Initialized once in `config/firebase.js`
- **db.collection().get()**, **.add()**, **.update()**, **.delete()**: Used in case routes
- **db.collection().where()**: Used in comments route to filter by `caseId`

## Important Patterns & Gotchas

1. **Dual Initialization**: Frontend uses client SDK, backend uses Admin SDK - both configured separately (not in `.js` files)
2. **AuthContext Timing**: Wraps entire app and waits for Firebase auth state before rendering children (prevents flash)
3. **Role-Based Access**: Role fetched from Firestore after auth - not part of Firebase Auth token
4. **Comments Design**: Query by `caseId` field rather than subcollections for simplicity
5. **Inline Route Logic**: No separate controllers - business logic lives in route handlers
6. **No Error Handling Middleware**: Routes catch errors individually and return raw error messages

## Testing & Debugging

- **Frontend tests**: React Testing Library configured in `setupTests.js`; `npm test` in frontend
- **Backend tests**: Placeholder only (`npm test` will fail) - no test suite implemented
- **Debugging**: Use `npm run dev` in backend for nodemon hot-reload; React Scripts dev server has HMR
- **Console Checks**: Firebase errors logged to browser console; backend errors returned as JSON

## Next Steps for New Features

When adding features:
1. **Backend first**: Add routes in `routes/`, use `db` from `config/firebase.js`
2. **Sync to Redux**: Dispatch slice actions in frontend components after API calls
3. **Update AuthContext if new user data needed**: Fetch from Firestore `users` collection
4. **Test manually**: Browser DevTools for frontend; Postman/curl for backend routes
