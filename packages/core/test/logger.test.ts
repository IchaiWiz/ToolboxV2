import { describe, it, expect, vi } from 'vitest';
import { loadModules } from '../src/index';

describe('logger module', () => {
  it('logs input with optional prefix', async () => {
    const modules = await loadModules();
    const logger: any = modules.find(m => m.name === 'logger');
    expect(logger).toBeDefined();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const result = await logger.run('test', { prefix: '[pref] ' });

    expect(spy).toHaveBeenCalledWith('[pref] test');
    expect(result).toBe('test');
    spy.mockRestore();
  });
});
