# military-client

Angular 20 frontend for **MillitaryService** (`https://github.com/Jaba-Tskhovrebashvili/Millitary-server`).

```bash
npm install
npm start            # http://localhost:4200, API expected at http://localhost:5146/api
```

Change the API address in `src/environments/environment.ts`.
Set `Client:Address` in the server's appsettings to `http://localhost:4200` so the e-mail link opens `/sign-up?token=...`.

## Architecture

Every page is a self-contained folder. Nothing page-specific is shared.

```
src/app/pages/<page>/
  <page>.page.ts      component: template wiring only, no HTTP
  <page>.page.html
  <page>.page.scss    the page's own styles
  <page>.service.ts   page state (signals) + actions, provided in the page component
  <page>.api.ts       the HTTP requests this page makes, provided in the page component
  <page>.models.ts    request/response types for this page
```

`providers: [XService, XApi]` sits on each page component, so each visit gets a fresh instance and
state never leaks between pages.

Only cross-cutting infrastructure lives outside `pages/`:

| Path | Purpose |
|---|---|
| `core/auth` | JWT storage, Bearer interceptor (401 → sign-in), route guards |
| `core/http/api-error.ts` | reads `message` from the server's ProblemDetails |
| `core/layout/shell` | sidebar + top bar around the signed-in pages |
| `shared/infinite-scroll` | sentinel directive (IntersectionObserver) |
| `styles/styles.scss` | CSS variables + reset only |
| `styles/_mixins.scss` | mixins a page's `.scss` can `@use`; emits nothing by itself |

## Paging while scrolling

`/api/personnel` and `/api/military-units` are paginated on the server (15 rows per page).

- Typing in search is debounced (400 ms). A new term cancels the request in flight, clears the list
  and loads **page 1 only**.
- An empty `<div appInfiniteScroll>` sits under the list. The next page is requested **only when that
  element scrolls into view** (`loadNext()`), never all pages at once.
- While a request is running the sentinel is disabled, so one scroll gives one request.
- Rows are de-duplicated by `id` when a page is appended.

`/api/positions`, `/api/ranks` and `/api/courses` have no `page` parameter on the server, so one
request per search term returns every match, and the list is revealed in chunks as you scroll
without extra requests. Add `page` to those endpoints and they can use the same pattern as
military units.

## Backend issues found while wiring this up

1. `PersonnelController.PersonnelProfile` uses `[HttpGet("id:int")]` (no braces), so
   `GET /api/personnel/5` doesn't reach it. Change it to `[HttpGet("{id:int}")]`. The detail and
   edit pages call `/api/personnel/{id}`.
2. `PersonnelRepository.GetPersonnels` orders only by `RankId`. Rows with the same rank can move
   between pages, so add `.ThenBy(x => x.Id)` for stable paging.
3. `CourseController.GetCourses` returns the list as `ranks`. The client accepts `courses` or
   `ranks`, so renaming it on the server is safe.
4. `PUT /api/personnel/courses` binds the `PersonnelCourses` entity. With `<Nullable>enable</Nullable>`,
   the non-nullable `Personnel` and `Course` navigation properties are treated as required, so the
   request returns 400. Bind a DTO with an `Id` instead (or make the navigations nullable).
5. `POST /api/admin/sign-in` returns the full `Admin` entity, including the password hash. Return a
   DTO without `Password`.
6. `MilitaryUnitsRepository.SearchAsync` searches `Description` only. You probably want `Name` too.
