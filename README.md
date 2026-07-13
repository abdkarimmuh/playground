# Code Playground

A small Next.js app for trying out JavaScript, TypeScript, Python, Ruby, and Go snippets in the browser. Built with Tailwind CSS and shadcn/ui. Everything runs client-side — no backend code execution.

- `/` — landing page
- `/js` — JavaScript playground
- `/ts` — TypeScript playground (type-checked via Monaco, transpiled with the `typescript` package)
- `/py` — Python playground (via [Pyodide](https://pyodide.org))
- `/rb` — Ruby playground (via [ruby.wasm](https://github.com/ruby/ruby.wasm))
- `/go` — Go playground (a full `package main` program, interpreted by [Yaegi](https://github.com/traefik/yaegi) compiled to WebAssembly)

Each playground uses a Monaco editor, runs your code in a sandboxed iframe, prints console/stdout output to a console panel, and auto-saves your code to `localStorage`.

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
npm run build:wasm   # rebuild public/wasm/yaegi-runner.wasm (used by /go)
```

`build:wasm` requires a local Go toolchain (`GOOS=wasip1 GOARCH=wasm go build`, no bundler plugin needed). It's not run automatically by `npm run dev`/`build` — `public/wasm/yaegi-runner.wasm` is committed to the repo, so you only need Go installed if you're changing `wasm/yaegi-runner/main.go`.

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
