# Diet Planner

Diet Planner is a full-stack meal planning project built around a simple idea: a user should be able to save a health profile once, generate a daily plan from it, track what they actually consumed, and get a few seasonal food suggestions without jumping between different tools.

The repository is split into two apps:

- `frontend` - the React client built with Vite
- `backend` - the Express API backed by MongoDB Atlas

## Live Project

- Frontend: https://diet-planner-ten-wheat.vercel.app/
- Backend: https://diet-planner-ttj7.onrender.com
- Health check: https://diet-planner-ttj7.onrender.com/health

## What The App Does

- register and log in users
- save user health and diet preferences
- generate a daily meal plan
- track consumed foods
- record simple meal feedback
- show a dashboard view of nutrition progress
- surface seasonal food suggestions that can be added to the current plan

## Tech Stack

### Frontend

- React 19
- Vite 6
- React Router DOM
- Axios
- Recharts
- Tailwind CSS 4
- DaisyUI
- Lucide React

### Backend

- Node.js
- Express 4
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- cookie-parser
- cors
- dotenv
- csv-parser

## Runtime And Tooling

- Node.js: `v24.14.1` on the current local setup
- npm: `10.8.2`

The project should also be comfortable on a current LTS Node release, but the numbers above reflect the environment used while updating and testing this repository.

## Repository Structure

```text
Diet Planner/
|-- backend/
|   |-- src/
|   |-- .env.example
|   |-- nutrients.csv
|   |-- seedFoodData.js
|   `-- package.json
|-- frontend/
|   |-- public/
|   |-- src/
|   |-- .env.example
|   |-- vercel.json
|   `-- package.json
|-- nutrients_cleaned.csv
`-- README.md
```

## Running Locally

### 1. Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. Configure environment variables

Create `backend/.env` from `backend/.env.example`.

```env
PORT=2000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?appName=Cluster0
DB_NAME=test
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
ACCESS_TOKEN_SECRET=replace_with_a_strong_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace_with_a_strong_secret
REFRESH_TOKEN_EXPIRY=10d
```

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_URL=http://localhost:2000
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

The backend starts on `http://localhost:2000`.

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Seeding Food Data

The meal recommendation flow depends on food documents being present in MongoDB. If the app shows empty recommendations, this is the first thing to check.

Run the seed script from the backend folder:

```bash
cd backend
npm run seed
```

The script reads from `backend/nutrients.csv` and inserts food data into the database configured by `MONGODB_URI` and `DB_NAME`.

## Deployment Notes

This project is currently deployed with:

- Vercel for the frontend
- Render for the backend
- MongoDB Atlas for data storage

### Backend deployment

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health path: `/health`

Recommended production variables:

```env
MONGODB_URI=your_atlas_connection_string
DB_NAME=test
CORS_ORIGIN=https://diet-planner-ten-wheat.vercel.app
NODE_ENV=production
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
```

### Frontend deployment

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Production variable:

```env
VITE_API_URL=https://diet-planner-ttj7.onrender.com
```

## Screens And Results

The app currently includes these main views:

- landing page
- login and registration
- profile setup
- daily meal plan
- seasonal recommendation view
- dashboard

I have not committed screenshot image files into this repository yet, so this README stays honest instead of pretending they are here. If you want to add them later, a clean follow-up is to place them in a `docs/screenshots/` folder and link them from this section.

## Packages Used

If you want the quick version, these are the main packages doing the heavy lifting.

### Frontend packages

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `recharts`
- `tailwindcss`
- `daisyui`
- `lucide-react`
- `vite`

### Backend packages

- `express`
- `mongoose`
- `jsonwebtoken`
- `bcrypt`
- `cors`
- `cookie-parser`
- `dotenv`
- `csv-parser`
- `nodemon`

## A Few Practical Notes

- The backend expects the same MongoDB database to be used for users, meals, and foods.
- If recommendations are empty, check whether the food seed script has been run against the correct database.
- The frontend talks to the backend through `VITE_API_URL`.
- Cross-origin login in production depends on `CORS_ORIGIN` being set correctly on the backend.

## Folder-Level READMEs

There is one main README at the root because that is the best place for setup, deployment, and project overview.

There are also smaller READMEs inside `frontend` and `backend` so each app still has a focused local reference when opened on its own.
