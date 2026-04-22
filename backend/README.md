# Diet Planner Backend

This is the Express API for Diet Planner. It handles authentication, user profile storage, meal plan generation, seasonal recommendations, dashboard data, and meal feedback.

## Stack

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

## Local Run

```bash
npm install
npm run dev
```

Create a `.env` file from `.env.example` and provide:

```env
PORT=2000
MONGODB_URI=your_atlas_connection_string
DB_NAME=test
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
ACCESS_TOKEN_SECRET=replace_with_a_strong_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace_with_a_strong_secret
REFRESH_TOKEN_EXPIRY=10d
```

## Seed Food Data

```bash
npm run seed
```

This imports food documents from `nutrients.csv` into the configured MongoDB database.

## Production

The backend is deployed on Render:

- Live URL: https://diet-planner-ttj7.onrender.com
- Health check: https://diet-planner-ttj7.onrender.com/health

Deploy settings:

- Build command: `npm install`
- Start command: `npm start`

## Main Route Groups

- `/api/v1/users`
- `/api/v1/recommendation`
- `/api/v1/meal`
- `/api/v1/feedback`
- `/api/v1/foodItem`

## Notes

- The backend expects foods, users, and meals to live in the same MongoDB database.
- `DB_NAME` should be set explicitly in production so the app does not point at the wrong database by accident.
