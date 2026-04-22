# AI Integrated Diet Plan Generator

This project has two apps:

- `frontend`: React + Vite client
- `backend`: Node.js + Express API with MongoDB

## Local setup

### 1. Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. Configure environment variables

Create `backend/.env` from `backend/.env.example` and fill in your real values.
Create `frontend/.env` from `frontend/.env.example`.

Required backend variables:

- `PORT`
- `MONGODB_URI`
- `CORS_ORIGIN`
- `ACCESS_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRY`
- `REFRESH_TOKEN_SECRET`
- `REFRESH_TOKEN_EXPIRY`

Frontend variable:

- `VITE_API_URL`

### 3. Run the apps

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The frontend dev server proxies `/api` requests to `http://localhost:2000`.
For deployed frontend builds, `VITE_API_URL` should be your deployed backend URL, for example `https://your-backend.onrender.com`.

## Upload to GitHub

Before pushing:

- Do not upload `backend/.env`
- Do not upload `node_modules`
- Rotate any secrets that were previously stored in `backend/.env`

Basic Git flow:

```bash
git init
git add .
git commit -m "Prepare project for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Deployment approach

Recommended simple setup:

- Deploy `backend` to Render or Railway
- Deploy `frontend` to Vercel or Netlify

For production, update:

- Backend `CORS_ORIGIN` to your frontend URL
- Frontend `VITE_API_URL` to your deployed backend URL

Backend deployment notes:

- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Frontend deployment notes:

- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL` in the hosting platform environment variables
