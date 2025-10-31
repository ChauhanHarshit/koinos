# Solution Overview

## Backend
- Replaced blocking I/O with async `fs.promises` in `backend/src/routes/items.js`.
- Implemented server-side pagination and search: returns `{ items, page, pageSize, total }`.
- Added cached stats in `backend/src/routes/stats.js` using file `mtimeMs` invalidation and in-flight coalescing; used `mean` util.
- Extracted Express app to `backend/src/app.js` and kept `backend/src/index.js` for bootstrapping only.
- Added Jest tests with Supertest for items routes (list, search, detail, 404).
- Fixed a bug in `backend/src/routes/stats.js` of routing to `items.json`

Trade-offs
- In-memory caches reset on process restart and aren’t shared across replicas; acceptable for this exercise.
- Search is simple substring on `name`/`category`; good enough for small data. Could add indexing or full-text later.
- POST route not covered to avoid mutating the real JSON file; would mock FS or use a temp file in a production test suite.

## Frontend
- Fixed memory leak: `AbortController` cancels in-flight fetch on unmount.
- Pagination + search UI: search box, page size select, Prev/Next controls; debouncing can be added if needed.
- Virtualized list with `react-window@1` `FixedSizeList` for large datasets.
- Styling polish: global styles, toolbar/row classes.

Potential Improvements
- Client URL sync for `q`, `page`, `pageSize` via `useSearchParams` for deep links.
- HTTP caching (ETag/Last-Modified) on stats endpoint.
- File watcher (`chokidar`) to proactively update stats cache.
- Broader test coverage (POST validations, error paths, frontend component tests).

## How to Run
1. Backend
   - `cd backend && npm install`
   - `npm start` (runs on 3001)
2. Frontend
   - `cd frontend && npm install`
   - `npm start` (runs on 3000)

## How to Test
- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test` (CRA testing scaffolding available; no new tests added here)
