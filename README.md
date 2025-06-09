# ToolboxV2

This monorepo demonstrates dynamic module loading with hot module replacement using Vite.

## Packages
- **@toolbox/core** – exposes `loadModules()` to discover modules placed in the `modules/` directory.

## Usage

```ts
import { loadModules } from '@toolbox/core';

const modules = await loadModules();
```

Modules are TypeScript files under `modules/<name>/index.ts` exporting an object matching the `ModuleMetadata` interface:

```ts
export interface ModuleMetadata {
  name: string;
  version: string;
  description?: string;
}
```

`loadModules()` validates each module and, when run under Vite, hot‑reloads when new modules are added.

Run tests with:

```bash
npm test
```
