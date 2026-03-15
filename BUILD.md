# Build system

## Quick reference

| Task | Command |
|------|--------|
| Install everything | `npm run install:all` |
| Dev (client + server) | `npm run dev` |
| **Build client** | `npm run build` or `npm run build:client` |
| **Run server (serves built client)** | `npm run start` |

## Build client and run on server

1. **Build the client** (outputs to `client/dist`):
   ```bash
   npm run build
   ```

2. **Start the server** (serves API + static client from `client/dist`):
   ```bash
   npm run start
   ```

   Open **http://localhost:5000** — the app and API are on the same origin.

If `client/dist` does not exist, the server still runs but only exposes the API (no static app). Use `npm run dev` for development with hot reload.
