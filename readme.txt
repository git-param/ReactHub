## JSON Server Authentication Setup

This project now uses `json-server` as a simple auth backend.

1. Start API server:
```bash
npm run server
```
2. In a second terminal, start frontend:
```bash
npm run dev


Auth API defaults to `http://localhost:3001` and uses `db.json`:
- `POST /users` for register
- `GET /users?email=...&password=...` for login

Optional: set a custom API base URL in `.env`:
```bash
VITE_API_URL=http://localhost:3001

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.