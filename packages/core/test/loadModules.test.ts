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
    const valid = modules.find(m => m.id === 'valid-module');
    expect(valid).toBeDefined();
    expect(typeof valid?.uiSchema).toBe('object');
  });

  it('throws on invalid module', async () => {
    await fs.mkdir(invalidDir, { recursive: true });
    await fs.writeFile(`${invalidDir}index.ts`, 'export default { broken: true }');
    await expect(loadModules()).rejects.toThrow();
  });

  it('throws when required fields are missing', async () => {
    await fs.mkdir(invalidDir, { recursive: true });
    await fs.writeFile(
      `${invalidDir}index.ts`,
      "export default { id: 'bad', version: '1.0.0' }"
    );
    await expect(loadModules()).rejects.toThrow();
  });

  it('throws when fields have wrong type', async () => {
    await fs.mkdir(invalidDir, { recursive: true });
    await fs.writeFile(
      `${invalidDir}index.ts`,
      "export default { id: 'bad', version: '1.0.0', name: 'bad', description: 'x', inputs: 'nope', outputs: [], uiSchema: {} }"
    );
    await expect(loadModules()).rejects.toThrow();
  });
});
