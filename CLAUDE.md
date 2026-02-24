# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Iron Projects is a monorepo portfolio platform for Ironhack students to register, discover, and review module projects. It has two parts:
- **api/**: Express 5 REST API with MongoDB/Mongoose
- **web/**: React 19 SPA built with Vite 7

## Commands

### API (from `api/`)
```bash
npm install          # Install dependencies
npm run dev          # Development with file watching
npm start            # Production start
```
Default port: 3000. Copy `.env.example` to `.env` for configuration.

### Web (from `web/`)
```bash
npm install          # Install dependencies
npm run dev          # Vite dev server (port 5173)
npm run build        # Production build
npm run lint         # ESLint
```

## Architecture

### API Request Flow
Request → morgan → CORS middleware → express.json() → clearBody (strips `_id`, `createdAt`, `updatedAt`) → checkAuth (validates session cookie, populates `req.session.user`) → router (`/api/*`) → errorHandler

### Authentication
Cookie-based sessions stored in MongoDB (Session model). Login creates a Session document and returns a `sessionId` httpOnly cookie. Only `POST /api/users` (register) and `POST /api/sessions` (login) are public; all other routes require a valid session. Registration requires an invite code from the `VALID_INVITE_CODES` env var.

### Data Models & Relationships
- **User** → has many Projects (virtual), Messages (virtual). Passwords hashed with bcrypt pre-save. `checkPassword()` instance method.
- **Project** → belongs to User (author), has many Reviews (virtual). `module` field is enum [1, 2, 3].
- **Review** → belongs to Project and User (author). Rating 1-5.
- **Message** → sender/receiver (both User refs). `read` boolean flag.
- **Session** → belongs to User. Used for cookie auth.

All models use `toJSON` transform to output `id` instead of `_id`, exclude `__v`, and User excludes `password`.

### Controller Naming Convention
Functions follow: `create`, `list`, `detail`, `update`, `destroy`

### Error Handling
Centralized in `api/middlewares/errors.middleware.js`:
- Mongoose `ValidationError` → 400
- HTTP errors (from `http-errors`) → their status code
- Mongoose `CastError` → 404
- MongoDB `E11000` duplicate → 409
- Everything else → 500

### Frontend
`web/src/services/api-service.js` is the Axios HTTP client layer with a response interceptor that unwraps `response.data`. The App component is currently a simple API tester UI. No routing library or state management yet.

## Key Environment Variables (API)
- `MONGODB_URI` — MongoDB connection string
- `CORS_ORIGIN` — Frontend URL for CORS (default: `http://localhost:5173`)
- `VALID_INVITE_CODES` — Comma-separated registration codes
- `COOKIE_SECURE` — Set `true` for HTTPS environments
