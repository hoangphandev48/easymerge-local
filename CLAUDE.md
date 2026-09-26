# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A small todo app built with [Ripple](https://www.ripple-ts.com/) — a compiler-driven
TypeScript UI framework whose components live in `.tsrx` files. Ripple is not React,
Vue, or Svelte; do not carry over their idioms. When unsure about syntax or runtime
APIs, read <https://www.ripple-ts.com/llms.txt> rather than guessing.

## Commands

```bash
npm run dev          # Vite dev server on http://localhost:3000
npm run build        # production build to dist/
npm run typecheck    # tsrx-tsc --noEmit  (also reports .tsrx template errors)
npm run lint         # eslint with @tsrx/eslint-plugin
npm run format       # prettier --write .
npm run serve        # preview the built dist/
```

There is no test runner configured — no `npm test`, no test files. The de-facto
verification loop is `typecheck` → `lint` → `format:check` → `build`. `typecheck` is
the one that catches `.tsrx` template mistakes; a plain `build` can pass while the
page still crashes at runtime, so for behavioural changes also drive the built app in
a browser (`npm run serve`, then Playwright or a manual click-through).

## Architecture

Two layers, and the split is the point:

- `src/lib/*.ts` and `src/constants.ts` — **framework-free.** Plain TypeScript over
  plain data: filtering, search normalization, summary strings, id generation,
  localStorage. These import nothing from `ripple` except `RippleObject` in
  `lib/todos.ts`. Put logic here whenever it can be expressed without reactivity.
- `src/components/*.tsrx` and `src/App.tsrx` — **presentation.** Components hold
  reactive state, wire callbacks, and render. Each component carries its own scoped
  `<style>` block; there is no shared stylesheet.

`App.tsrx` is the only stateful component: it owns the todo collection, the active
filter, and the search query, then passes derived values and callbacks down. The
child components are controlled — they never own todo state.

`src/types.ts` holds `Todo`, `TodoFilter`, `TodoCounts`. `src/lib/storage.ts`
persists to localStorage under `STORAGE_KEY`; it distinguishes `null` (nothing saved
yet → seed from `SEED_TODOS`) from `[]` (user deleted everything), and swallows all
storage errors so the app still runs when localStorage is blocked.

## Ripple specifics that bite

- **Reactivity is by identity, not by snapshot.** A `Todo` is a `RippleObject`, so
  `todo.done = !todo.done` re-renders. The collection is a `RippleArray`, so
  `push`/`splice` re-render. Replacing an object with a plain `{...todo, done}` spread
  breaks reactivity — use `lib/todos.ts` (`createTodo` / `reactiveTodo`) to construct
  todos, and `plainTodo` to strip reactivity before serializing.
- **Statement containers.** `function C(props) @{ ... }` puts setup code and output in
  one scope: setup first, then exactly **one** trailing JSX node. Multiple siblings
  (e.g. markup plus a `<style>` block) must be wrapped in a fragment `<>…</>`. Simple
  components can instead `return <div/>` directly.
- **Template control flow is directives**, not JavaScript: `@if`, `@for (… ; index i;
key x)` with an optional `@empty` branch, `@switch`/`@case`, `@try`/`@pending`/`@catch`.
  Plain `if`/`for` in setup code is ordinary JavaScript and does not render.
- **Reactive bindings use `&`.** `let &[count] = track(0)` for local state and derived
  values (`track(() => …)`); `function C(&{ a, b }: Props)` for props that must stay
  reactive across updates.
- Handlers are `onClick`/`onInput`; there are no synthetic events, so **`onChange`
  does not exist** — the lint rule `ripple/prefer-oninput` will flag it. Elements use
  `class`, not `className`.
- **Do not construct a `RippleObject` in a module-scope helper inside a `.tsrx` file.**
  It compiles cleanly but throws `__block is not defined` at runtime. Keep such
  factories inside the component, or in a plain `.ts` module like `lib/todos.ts`.
- `<style>` blocks are static CSS scoped to their own template — no JS expressions
  inside them. Use `:global(...)` to escape scoping and CSS custom properties for
  runtime values.

## Conventions

Prettier owns formatting: tabs, width 100, single quotes, ES5 trailing commas. Run
`npm run format` before committing; the tab/width settings make Prettier rewrap long
constructor calls in ways that look odd, so prefer short statements over fighting it.

UI strings and doc comments are Vietnamese; identifiers are English. Relative imports
carry their extension (`./types.ts`, `./TodoItem.tsrx`) — this is required.

## Current working-tree state

The branch `feature/todo-filters-search-persist` is a refactor in progress and **does
not typecheck**: `TodoItem.tsrx` moved into `src/components/` but its import of
`./types.ts` was not repathed, and `App.tsrx` still imports `./TodoItem.tsrx` and
still contains the pre-refactor inline state instead of using `lib/` and the new
components. Finishing that rewiring is the open task.
