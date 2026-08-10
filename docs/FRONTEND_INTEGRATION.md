# eVault Frontend Integration Guide

This document explains how to integrate the eVault frontend with the actual backend API. The frontend uses a dual-mode architecture, allowing it to run completely standalone with realistic mock data or connect to the real API with a single configuration change.

## 1. Running the Frontend Standalone (Mock Mode)
By default, the frontend is configured to run in Mock Mode. This is useful for UI development, testing, and presentations when the backend/blockchain is unavailable.

1. Ensure dependencies are installed: `npm install`
2. Start the development server: `npm run dev`
3. Login using any email/password. You can select your role from the login screen.

*All data in this mode is stored in the browser's `localStorage` and will persist across refreshes. The mock providers simulate network latency to feel like a real product.*

## 2. Switching to API Mode
When the backend API Gateway (Node.js/Express) is deployed, you can switch the frontend to consume it without altering any UI components.

1. Open `.env` (or create it from `.env.example`).
2. Set the variables:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_USE_MOCK=false
```
3. Restart the frontend server. 

The application will now automatically route all API calls through `src/api/live/*` instead of `src/api/mock/*`.

## 3. Architecture & Integration Points
The data fetching layer is abstracted. UI components never call `axios` directly; they import functions from `src/api/`.

### Auth Integration (`src/api/live/auth.js`)
Handles authentication and role retrieval.
- `POST /auth/login` -> Expects `{ email, password }`, returns `{ token, refreshToken, user: { id, name, role } }`
- `POST /auth/register` -> Expects `{ email, password, fullName, role }`
- `POST /auth/logout` -> Expects `{ refreshToken }`
- `GET /auth/me` -> Returns `{ id, name, email, role }`

### Documents Integration (`src/api/live/documents.js`)
Handles all document operations, including client-side encryption.
- `GET /documents` -> Returns `{ data: [ { docId, title, caseNo, status, hash, version, updatedAt, ownerName } ] }`
- `GET /documents/:id` -> Returns detailed document metadata
- `POST /documents/upload` -> Accepts `multipart/form-data` with `title`, `caseNo`, and `file` (which is AES-256 encrypted by the frontend before sending).
- `GET /documents/:id/download` -> Returns the encrypted file blob, which the frontend decrypts client-side.
- `POST /documents/:id/share` -> Expects `{ userId, permission }`
- `POST /documents/:id/revoke` -> Expects `{ userId }`
- `GET /documents/:id/history` -> Returns `[ { version, hash, updatedAt, updatedBy } ]`
- `GET /documents/:id/audit` -> Returns `[ { id, action, userId, userName, timestamp } ]`

### System Integration (`src/api/live/system.js`)
Handles system metrics and infrastructure status.
- `GET /system/status` -> Returns `{ status: 'ok', services: { database, blockchain, storage }, version }`
- `GET /system/info` -> Returns `{ metrics: { totalDocuments, verifiedToday, activeCases, registeredUsers, auditEvents }, environment }`

## 4. What Backend Developers Should NOT Modify
- Do NOT add blockchain interaction libraries (e.g., Fabric SDK) to the frontend.
- Do NOT change the UI components to handle `axios` calls directly.
- The encryption logic in `src/services/encryption.js` runs client-side (Zero-Knowledge) and must remain on the frontend. The backend should blindly store the encrypted binary blob on IPFS.
