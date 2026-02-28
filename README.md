# Matrix Desmos

This repo hosts two apps:

- `app/ui/`: Next.js + Tailwind interactive UI. Run `pnpm install` and `pnpm dev --hostname 0.0.0.0 --port 3000` inside `app/ui`.
- `app/backend/`: Python FastAPI service. After setting up the virtual environment via `uv sync`, set `FRONTEND_ORIGINS` (e.g., `FRONTEND_ORIGINS="http://localhost:3000"` or a comma-separated list of trusted origins) before running `uv run uvicorn matrix_backend.main:app --reload --port 8000` so the UI can reach the preview endpoint without CORS errors.

The UI talks to the backend at `http://localhost:8000/preview` to fetch intermediate-step grid transformations.
