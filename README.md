# JS / TS Playground

A small Next.js app for trying out JavaScript and TypeScript snippets in the browser. Built with Tailwind CSS and shadcn/ui.

- `/` — landing page
- `/js` — JavaScript playground
- `/ts` — TypeScript playground (type-checked via Monaco, transpiled with the `typescript` package)

Each playground uses a Monaco editor, runs your code in a sandboxed iframe, prints `console.*` output to a console panel, and auto-saves your code to `localStorage`.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev         # start the dev server (Turbopack)
npm run build        # production build
npm run lint          # eslint
npm run lint:fix     # eslint --fix
npm run format        # prettier --write
npm run typecheck    # tsc --noEmit
```

## Adding components

To add shadcn/ui components to the app, run:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
