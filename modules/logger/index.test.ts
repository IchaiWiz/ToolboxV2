import { describe, it, expect, vi } from 'vitest';
import logger from './index';

describe('logger module', () => {
  it('logs input with optional prefix', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const result = await logger.run('test', { prefix: '[pref] ' });
    expect(spy).toHaveBeenCalledWith('[pref] test');
    expect(result).toBe('test');
    spy.mockRestore();
  });

  it('handles missing prefix', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const result = await logger.run('sample');
    expect(spy).toHaveBeenCalledWith('sample');
    expect(result).toBe('sample');
    spy.mockRestore();
  });
});
