# Diet Planner Frontend

This is the React client for Diet Planner. It handles authentication screens, profile setup, daily meal plan views, seasonal recommendations, and the dashboard.

## Stack

- React 19
- Vite 6
- React Router DOM
- Axios
- Recharts
- Tailwind CSS 4
- DaisyUI

## Local Run

```bash
npm install
npm run dev
```

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:2000
```

## Production

The frontend is deployed on Vercel:

- Live URL: https://diet-planner-ten-wheat.vercel.app/

Build settings:

- Build command: `npm run build`
- Output directory: `dist`

## Notes

- Client-side routing is handled through `vercel.json`.
- API requests are configured in `src/lib/axios.js`.
- For local development, Vite also proxies `/api` requests to the backend.
