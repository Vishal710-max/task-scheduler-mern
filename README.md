# Task Scheduler — MERN Stack

A full-stack task management app upgraded from a localStorage-based React project into a complete **MERN** application (MongoDB, Express, React, Node.js) with JWT authentication.

Frontend - https://task-scheduler-mern.vercel.app

Backend - https://task-scheduler-mern.onrender.com

## Features

- User registration & login (JWT-based auth)
- Create, read, update, delete tasks (scoped per user)
- Priority levels (low / medium / high)
- Categories/tags
- Deadlines with automatic overdue detection & toast alerts
- Search and filter (all / pending / completed)
- Sorting by priority and deadline
- Completion tracking with progress bar
- Responsive UI (React Toastify notifications)

## Tech Stack

| Layer     | Technology                                  |
|-----------|----------------------------------------------|
| Frontend  | React 19, Vite, React Router, Axios, React Toastify |
| Backend   | Node.js, Express                             |
| Database  | MongoDB (Mongoose ODM)                       |
| Auth      | JWT (jsonwebtoken) + bcryptjs password hashing |

## Project Structure

```
Task-Scheduler-application-main/
├── src/                        # React frontend
│   ├── components/             # Navbar, TaskForm, TaskList, TaskCard, SearchBar, Stats, ProtectedRoute
│   ├── context/                # AuthContext (JWT session state)
│   ├── pages/                  # Login, Register, Dashboard
│   ├── services/                # api.js (axios instance), authService.js, taskService.js
│   ├── utils/                  # taskStatus.js
│   ├── App.jsx
│   └── main.jsx
├── server/                     # Express backend
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # User.js, Task.js
│   ├── controllers/            # authController.js, taskController.js
│   ├── routes/                 # authRoutes.js, taskRoutes.js
│   ├── middleware/             # authMiddleware.js, errorMiddleware.js
│   ├── server.js
│   └── .env.example
├── .env.example                # Frontend env template
└── package.json
```

## Local Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/task-scheduler?retryWrites=true&w=majority
JWT_SECRET=some_long_random_string
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

> Get `MONGO_URI` from MongoDB Atlas: create a free cluster → Database Access (create a user) → Network Access (allow your IP, or `0.0.0.0/0` for development) → Connect → "Drivers" → copy the connection string.

Start the API:

```bash
npm run dev     # requires nodemon (already in devDependencies)
# or
npm start
```

The API runs at `http://localhost:5000`. Test it: `GET http://localhost:5000/` should return `{"status":"ok", ...}`.

### 2. Frontend

From the project root:

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`, register an account, and start adding tasks.

## API Reference

Base URL: `/api`

### Auth (`/api/auth`)

| Method | Endpoint         | Body                              | Auth | Description        |
|--------|------------------|------------------------------------|------|---------------------|
| POST   | `/auth/register` | `{ name, email, password }`        | No   | Create account, returns JWT |
| POST   | `/auth/login`    | `{ email, password }`              | No   | Returns JWT         |
| GET    | `/auth/me`       | —                                  | Yes  | Get current user    |

### Tasks (`/api/tasks`) — all require `Authorization: Bearer <token>`

| Method | Endpoint      | Body                                             | Description             |
|--------|---------------|---------------------------------------------------|--------------------------|
| GET    | `/tasks`      | —                                                  | List tasks for current user |
| POST   | `/tasks`      | `{ text, deadline, priority, category }`           | Create a task            |
| PUT    | `/tasks/:id`  | any subset of `{ text, deadline, priority, category, completed, notifiedOverdue }` | Update a task |
| DELETE | `/tasks/:id`  | —                                                  | Delete a task             |

## Deployment

### Backend → Render

1. Push this repo to GitHub.
2. On Render: **New → Web Service**, connect the repo, set **Root Directory** to `server`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (your deployed Vercel URL). Render sets `PORT` automatically; Express already falls back to it.
5. Deploy. Note the resulting URL, e.g. `https://task-scheduler-api.onrender.com`.

### Frontend → Vercel

1. On Vercel: **New Project**, import the same repo.
2. Root directory: leave as the project root (not `server`).
3. Framework preset: Vite.
4. Environment variable: `VITE_API_URL=https://task-scheduler-api.onrender.com/api` (your Render URL + `/api`).
5. Deploy.

Once both are live, update the backend's `CLIENT_ORIGIN` env var on Render to your Vercel domain (e.g. `https://task-scheduler.vercel.app`) so CORS allows requests from production.

## Notes on the Upgrade

This project was converted from a localStorage-based React app into a full MERN stack app:

- **Data layer**: `localStorage.getItem/setItem` replaced with Axios calls to REST endpoints (`taskService.js`), backed by MongoDB via Mongoose.
- **Auth added**: tasks are scoped per user via JWT, since a shared task list with no login wouldn't hold up in a real deployment.
- **Component split**: the original single ~340-line `App.jsx` was broken into `Navbar`, `TaskForm`, `TaskList`, `TaskCard`, `SearchBar`, `Stats`, and page-level `Dashboard` / `Login` / `Register` components, with `services/` and `context/` layers for API calls and session state.
- **UI/UX preserved**: styling (`App.css`), toast notifications, overdue detection, priority sorting, search, and filters all carry over unchanged in behavior.
