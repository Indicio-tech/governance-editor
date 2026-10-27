# Governance Editor

A generic React-based editor for machine-readable governance files (formats 1.0 and 2.0).

Built with [Vite](https://vite.dev) and tested with [Vitest](https://vitest.dev).

## Requirements

Node 24 (see `.nvmrc`). With [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install && nvm use
```

## Scripts

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `npm start`       | Start the dev server at http://localhost:3000          |
| `npm run build`   | Production build into `build/`                         |
| `npm run preview` | Serve the production build locally                     |
| `npm test`        | Run the unit and smoke tests once                      |
| `npm run test:watch` | Run the tests in watch mode                         |

## Tests

- Reducer and utility unit tests live next to their source (`*.test.js`).
- `src/UI/Formats/injectionExtraction.test.js` covers the inject/extract round trip for both formats.
- `src/App.test.jsx` smoke-tests the app and every route for each format.
- Sample governance files used by the tests are in `src/__fixtures__/`.
