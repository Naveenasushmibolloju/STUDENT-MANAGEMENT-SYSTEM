# Student Management System

- Keep frontend and backend independently deployable.
- Never commit secrets; use `.env.example` files.
- Backend routes require authentication except login and health.
- Preserve validation, centralized error handling, and responsive UI behavior.
- Run `npm run build` in `frontend` and `npm start` in `backend` after changes.