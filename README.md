# School Frontend 🖥️

A beginner-friendly **frontend** project that talks to a backend API over HTTP.

---

## How It Works

1. **`.env`** has `BACKEND_URL=http://localhost:4000`.
2. **`server.js`** reads `BACKEND_URL` from `.env` and injects it into `index.html` (replaces `__BACKEND_URL__`).
3. Browser gets `window.BACKEND_URL` — `script.js` uses it to call the backend.
4. Three buttons → `fetch()` POST requests → backend responds → result shown on page.

```
.env file                    server.js                   Browser
─────────                    ─────────                   ───────
BACKEND_URL=http://localhost:4000
        │
        ▼
process.env.BACKEND_URL  ──►  replaces __BACKEND_URL__
                                in index.html
                                        │
                                        ▼
                            window.BACKEND_URL = "http://localhost:4000"
                                        │
                                        ▼
                            script.js uses fetch() to call backend
```

---

## Setup (2 steps)

### Step 1: Create `.env` file

Create `school-frontend/.env` with this content:

```env
PORT=3000
BACKEND_URL=http://localhost:4000
```

### Step 2: Install, build, start

```bash
cd school-frontend
npm install
npm run build      # checks .env, backend connection, files
npm start          # starts the server
```

Open **http://localhost:3000** in your browser. Done! 🎉

---

## Make sure the backend is running first

```bash
# Terminal 1: Backend
cd school-backend
npm install
npm run build      # checks .env, MySQL, tables
npm run migrate    # creates tables
npm start

# Terminal 2: Frontend
cd school-frontend
npm install
npm run build      # checks .env, backend connection
npm start
```

---

## Run with PM2 (Production)

`npm start` stops the server when you close the terminal. **PM2** keeps it running in the background and restarts it automatically if it crashes.

### Install PM2 (one time, global)

```bash
npm install -g pm2
```

### Start the frontend with PM2

```bash
cd school-frontend
pm2 start ecosystem.config.js
```

- The app runs with the name `school-frontend` (defined in `ecosystem.config.js`).
- `.env` is loaded by the app itself (dotenv), so no env vars are needed in the PM2 config.
- Make sure the backend is running first — you can run the backend with PM2 too (see backend README).

### Useful PM2 commands

| Command | What it does |
|---------|-------------|
| `pm2 list` | Show all PM2 apps and status (online/stopped) |
| `pm2 logs school-frontend` | Show live logs |
| `pm2 restart school-frontend` | Restart the app |
| `pm2 stop school-frontend` | Stop the app |
| `pm2 delete school-frontend` | Remove the app from PM2's list |
| `pm2 monit` | Live CPU / memory monitor |

### Auto-start on server reboot (optional)

```bash
pm2 startup        # prints one command — copy-paste and run it
pm2 save           # saves the current app list, restores it after reboot
```

---

## Project Structure

```
school-frontend/
├── .env              ← PORT and BACKEND_URL
├── .gitignore        ← Ignores node_modules and .env
├── package.json      ← Dependencies: express, dotenv
├── build.js          ← Build-time checks (no .env needed)
├── ecosystem.config.js ← PM2 process config
├── server.js         ← Express server (injects BACKEND_URL into HTML)
├── public/
│   ├── index.html    ← 3 buttons + __BACKEND_URL__ placeholder
│   ├── script.js     ← fetch() calls to backend using window.BACKEND_URL
│   └── style.css     ← Simple styling
└── README.md         ← You are here!
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| "Network error" on button click | Backend not running → start it first |
| Page shows `__BACKEND_URL__` literally | Access via `http://localhost:3000` (not opening HTML file directly) |
| Port 3000 already in use | Change `PORT=3000` in `.env` to another port |