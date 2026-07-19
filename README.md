# SEPOLSCIS — Local Dev Notes

This workspace is a static PWA. To run tests or add developer tooling, follow these steps.

Install dev tools (example):

```bash
npm init -y
npm install -D vitest eslint prettier eslint-config-prettier
```

Run tests:

```bash
npm test
```

Run lint and format:

```bash
npm run lint
npm run format
```

Notes:

- `package.json` includes `type: module` so source files can use ES modules.
- Current tests cover `state.js`. Add more tests under `test/` as needed.
