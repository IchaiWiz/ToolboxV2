# @toolbox/core

Utility for discovering modules placed in the repository `modules/` folder.

## Usage

```ts
import { loadModules } from '@toolbox/core';

const modules = await loadModules();
```

Modules are TypeScript files located at `modules/<name>/index.ts` and must export
an object conforming to the `ModuleMetadata` interface:

```ts
export interface ModuleMetadata {
  name: string;
  version: string;
  description?: string;
}
```

`loadModules()` validates each module and, when executed under Vite, uses HMR to
reload modules automatically when files change.
