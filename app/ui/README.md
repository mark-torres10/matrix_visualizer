Matrix Builder is the Next.js/Tailwind front end for composing 2×2 matrix transforms and rendering the preview grid powered by the matrix-desmos backend.

## Development

1. `cd app/ui`
2. `pnpm install`
3. Ensure the backend is running (`uv run uvicorn matrix_backend.main:app --reload --port 8000` from `app/backend`) so the preview endpoint is reachable at `http://localhost:8000/preview`.
4. `pnpm dev` to start Next.js with live reload.
5. Optionally override `NEXT_PUBLIC_BACKEND_URL` if the backend runs on a different host or port.

## Build & Deploy

- `pnpm build` prepares the production bundle.
- `pnpm start` serves the compiled version locally.
- The project is deployable to Vercel or any platform that supports Next.js server-rendered apps. Make sure the deployed UI can reach the backend and configure `NEXT_PUBLIC_BACKEND_URL` accordingly.

## Key directories

- `src/components/` contains reusable inputs (`MatrixInput`), cards (`TransformCard`), and the canvas renderer (`GraphCanvas`).
- `src/lib/` keeps shared state, presets, API helpers, and types.
- `app/page.tsx` wires the canvas, sidebar, and backend polling logic.

## Documentation

Additional context (models, diagrams, etc.) can be found under `docs/` in the repository root.
