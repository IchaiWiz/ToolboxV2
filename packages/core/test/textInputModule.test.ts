import { describe, it, expect } from 'vitest';
import { loadModules } from '../src/index';

describe('text-input module', () => {
  it('runs and returns entered text', async () => {
    const modules = await loadModules();
    const mod: any = modules.find(m => m.name === 'text-input');
    expect(mod).toBeDefined();
    const result = await mod.run({ text: 'hello' });
    expect(result).toBe('hello');
  });
});
