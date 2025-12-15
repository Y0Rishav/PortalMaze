# PortalMaze

A single-player grid-based maze puzzle game with teleportation portals and strategic wall-breaking. Navigate from START to GOAL using movement controls, colored portals, and limited wall breaks. Features two modes with separate leaderboards.

**Hackathon Project**: Created for HACKSPHERE 2025 - PCON's 48-hour coding challenge.

## Features
- User authentication & score tracking
- Level editor for custom maze creation
- Two game modes: No-Wall-Break (NWB) & Wall-Break (WB) with K wall limit
- Portal teleportation system (color-matched pairs)
- Separate leaderboards per level and mode
- Path validation with optimal solution computation
- Solution viewing during gameplay

## Tech Stack

| Backend | Frontend |
|---|---|
| **Node.js** with Express.js<br>**MongoDB** with Mongoose ODM<br>**JWT** for authentication with refresh tokens<br>**bcryptjs** for password hashing<br>**CORS** for cross-origin requests<br>**Render** for backend deployment | **React** with Vite<br>**Tailwind CSS** for styling<br>**React Router** for navigation<br>**Axios** for API communication<br>**JWT-decode** for token handling<br>**Vercel** for frontend deployment |

## Prerequisites
- Node.js ≥14
- MongoDB (local or Atlas)
- npm/yarn

## Quick Start

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Y0Rishav/PortalMaze.git
   cd PortalMaze
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Setup** (backend/.env):
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ALLOWED_ORIGINS=http://localhost:5173
   ```

3. **Run**:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

4. **Access**: http://localhost:5173

## Game Controls
- **Movement**: WASD/Arrow keys
- **Teleport**: Stand on portal + Enter
- **Wall Break**: SHIFT + Movement

## Path Finding Algorithm

Uses modified BFS with state tracking `(position, wall_breaks_used)` to compute shortest paths:

- **Zero-break path**: Validates solvability without wall breaking
- **K-break path**: Finds optimal path using ≤K wall breaks
- **Portal handling**: Instant teleportation between color matched pairs (no movement cost)
- **Validation**: Ensures exactly 1 START/GOAL and valid portal pairs

Algorithm implemented in `/frontend/src/utils/pathSolver.js` with map validation in `mapValidator.js`.

## API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Clear session

### Levels
- `GET /api/levels` - Get all levels
- `POST /api/levels` - Create level (auth required)
- `GET /api/levels/:id` - Get specific level

### Scores
- `GET /api/scores/:levelId/:mode` - Get leaderboard (mode: nwb/wb)
- `POST /api/scores` - Submit score

### System
- `GET /api/health` - Health check

## Project Structure
```
portalmaze/
├── backend/ (Node.js/Express API)
│   ├── app.js (Express app configuration)
│   ├── index.js (Server entry point)
│   ├── package.json
│   ├── db/ (Database connection)
│   │   └── index.js
│   ├── middleware/ (Custom middleware)
│   │   └── auth.js (JWT authentication)
│   ├── models/ (Mongoose schemas)
│   │   ├── User.js
│   │   ├── Level.js
│   │   └── Score.js
│   └── routes/ (API route handlers)
│       ├── auth.js
│       ├── levels.js
│       └── scores.js
├── frontend/ (React SPA)
│   ├── src/
│   │   ├── components/ (UI components)
│   │   ├── pages/ (App pages)
│   │   ├── utils/ (Game algorithms)
│   │   └── context/ (Auth context)
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── README.md
```

## Video Demo
(https://youtu.be/VGfTo6hqRwk)
