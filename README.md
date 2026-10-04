# Election Management System — Reusable React Frontend

This project is intentionally structured like a maintainable enterprise frontend rather than a single-page prototype.

## Architecture

- `src/pages` — route-level screens
- `src/components` — reusable UI components
- `src/layouts` — application layout
- `src/features` — domain-specific reusable modules
- `src/services` — API/mock data access
- `src/hooks` — reusable React hooks
- `src/context` — shared application state
- `src/utils` — calculation/format/validation helpers
- `src/constants` — routes and domain constants
- `src/mocks` — temporary mock data
- `src/routes` — route configuration
- `src/assets` — static assets

## Mock → Spring Boot transition

The UI does NOT directly depend on mock arrays.

Components/pages call service functions such as:

```js
provinceService.getAll()
provinceService.create(payload)
districtService.getAll()
candidateService.getByDistrict(id)
electionService.calculate(payload)
```

Currently these services use `mockAdapter`.

When Spring Boot is ready:

1. Set `VITE_USE_MOCK=false`
2. Set `VITE_API_BASE_URL=http://localhost:8080/api`
3. Change the service adapter to `apiAdapter` (or make the adapter selection automatic).
4. Keep pages/components unchanged.

This keeps API integration isolated from the UI.

## Run

```bash
npm install
npm run dev
```

## Important

The election calculation utility mirrors the supplied Pascal flow at a frontend-prototype level:
- disqualification threshold
- qualifying votes
- highest-vote bonus seat
- Round 1
- Round 2 balance allocation
- final seats

For production, the authoritative calculation should normally live in Spring Boot, with the frontend displaying the returned result.
