export interface ModuleMetadata {
  name: string;
  version: string;
  description?: string;
}

import fs from 'fs/promises';
import path from 'path';

/**
 * Load modules from the `modules` directory using dynamic import.
 * In development with Vite, uses HMR to reload when modules change.
 */
export async function loadModules(): Promise<ModuleMetadata[]> {
  const modules: ModuleMetadata[] = [];
  const baseDir = path.resolve(__dirname, '../../../modules');

  const dirs = await fs.readdir(baseDir, { withFileTypes: true });
  for (const dirent of dirs) {
    if (!dirent.isDirectory()) continue;
    const file = path.join(baseDir, dirent.name, 'index.ts');
    try {
      const mod = await import(file);
      const meta: ModuleMetadata | undefined = mod.default;
      if (!isValidModule(meta)) {
        throw new Error(`Invalid module metadata in ${dirent.name}`);
      }
      modules.push(meta);
    } catch (err) {
      throw err;
    }
  }

  if (import.meta.hot) {
    const globMap = import.meta.glob('../../../modules/*/index.ts');
    import.meta.hot.accept(Object.keys(globMap), () => {
      // modules can be reloaded by calling loadModules again
    });
  }

  return modules;
}

function isValidModule(obj: any): obj is ModuleMetadata {
  return obj && typeof obj.name === 'string' && typeof obj.version === 'string';
}

export default { loadModules };
