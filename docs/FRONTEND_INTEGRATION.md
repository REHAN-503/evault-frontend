# eVault Frontend Integration Guide

This document outlines how the backend team should integrate with the eVault React frontend. 

The frontend uses a provider pattern for its API layer, allowing seamless switching between local Mock state and live Backend endpoints without modifying UI components.

## Switching to Live Mode

The frontend environment is controlled via the `.env` file at the root of the project.

```env
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api/v1
```

1. Set `VITE_USE_MOCK=false`.
2. Set `VITE_API_URL` to point to the backend server.
3. Restart the Vite dev server (`npm run dev`).

The `src/api/index.js` switcher will now route all component API calls through `src/api/live/` instead of `src/api/mock/`.

## API Contracts to Implement

The backend must implement the following endpoints to satisfy the frontend's expectations. All endpoints expect and return JSON, and all endpoints (except login/register) expect an Authorization header (e.g., `Bearer <token>`).

### 1. Authentication (`src/api/live/auth.js`)

#### `POST /auth/login`
- **Request:** `{ email, password, role }`
- **Response:** `{ token, user: { id, name, email, role } }`

#### `POST /auth/register`
- **Request:** `{ fullName, email, password, role }`
- **Response:** `{ success: true, message: "User registered" }`

### 2. Users (`src/api/live/users.js`)

#### `GET /users`
- **Response:** `[ { id, name, email, role }, ... ]`

#### `POST /users/:id/role`
- **Request:** `{ role }`
- **Response:** `{ success: true }`

### 3. Documents (`src/api/live/documents.js`)

#### `GET /documents`
- **Response:** `[ { docId, title, caseNo, version, status, hash, cid, ownerId, ownerName, sharedWith, size, createdAt, updatedAt }, ... ]`

#### `GET /documents/:docId`
- **Response:** `{ docId, title, caseNo, version, status, hash, cid, ownerId, ownerName, sharedWith, size, createdAt, updatedAt }`

#### `GET /documents/:docId/versions`
- **Response:** `[ { version, hash, cid, url, updatedBy, updatedAt }, ... ]`

#### `GET /documents/:docId/audit`
- **Response:** `[ { id, docId, action, userId, userName, timestamp }, ... ]`

#### `POST /documents`
- **Request (FormData):** `file` (File), `title` (String), `caseNo` (String)
- **Response:** `{ docId, hash, cid }`

#### `POST /documents/:docId/versions`
- **Request (FormData):** `file` (File)
- **Response:** `{ version, hash, cid }`

#### `POST /documents/:docId/access`
- **Request:** `{ targetUserId, accessLevel }`
- **Response:** `{ success: true }`

#### `POST /documents/:docId/verify`
- **Response:** `{ allowed: true/false }`

#### `DELETE /documents/:docId`
- **Response:** `{ success: true }`

### 4. System Status (`src/api/live/system.js`)

#### `GET /system/status`
- **Response:** `{ status: 'ok', version: '1.0.0', services: { database: 'connected', blockchain: 'operational', storage: 'operational' } }`

#### `GET /system/info`
- **Response:** `{ environment: 'production', metrics: { totalDocuments: 15, verifiedToday: 3, auditEvents: 45, registeredUsers: 8 } }`

## Error Handling

The frontend expects standard HTTP status codes.
- `401 Unauthorized`: Triggers automatic logout and redirect to `/login`.
- `400 / 500`: Returns the JSON error payload. The frontend expects `{ message: "Error description" }` to display to the user.
