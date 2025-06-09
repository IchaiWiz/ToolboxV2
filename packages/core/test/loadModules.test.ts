import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadModules } from '../src/index';
import fs from 'fs/promises';

const invalidDir = new URL('../../../modules/invalidModule/', import.meta.url).pathname;

describe('loadModules', () => {
  beforeEach(async () => {
    // ensure invalid module does not exist
    await fs.rm(invalidDir, { recursive: true, force: true });
  });

  afterEach(async () => {
    await fs.rm(invalidDir, { recursive: true, force: true });
  });

  it('loads valid modules', async () => {
    const modules = await loadModules();
    expect(modules.length).toBeGreaterThan(0);
    expect(modules.some(m => m.name === 'valid-module')).toBe(true);
  });

  it('throws on invalid module', async () => {
    await fs.mkdir(invalidDir, { recursive: true });
    await fs.writeFile(`${invalidDir}index.ts`, 'export default { broken: true };');
    await expect(loadModules()).rejects.toThrow();
  });
});
