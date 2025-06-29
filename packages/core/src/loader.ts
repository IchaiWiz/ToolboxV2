import fs from 'fs/promises';
import path from 'path';
import type { ModuleMetadata } from './types';

function isValidModule(obj: any): obj is ModuleMetadata {
  return (
    obj != null &&
    typeof obj.id === 'string' &&
    typeof obj.version === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    Array.isArray(obj.inputs) && obj.inputs.every((i: any) => typeof i === 'string') &&
    Array.isArray(obj.outputs) && obj.outputs.every((o: any) => typeof o === 'string') &&
    obj.uiSchema && typeof obj.uiSchema === 'object' &&
    (obj.incompatible === undefined ||
      (Array.isArray(obj.incompatible) && obj.incompatible.every((i: any) => typeof i === 'string')))
  );
}

export async function loadModules(): Promise<ModuleMetadata[]> {
  const modules: ModuleMetadata[] = [];
  const baseDir = path.resolve(__dirname, '../../../modules');

  async function visit(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const idx = path.join(full, 'index.ts');
        try {
          await fs.access(idx);
          const mod = await import(idx);
          const meta: ModuleMetadata | undefined = mod.default;
          if (!isValidModule(meta)) {
            throw new Error(`Invalid module metadata in ${full}`);
          }
          modules.push(meta);
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            await visit(full);
          } else {
            throw err;
          }
        }
      }
    }
  }

  await visit(baseDir);

  if (import.meta.hot) {
    const glob = import.meta.glob('../../../modules/**/index.ts');
    import.meta.hot.accept(Object.keys(glob), () => {});
  }

  return modules;
}
