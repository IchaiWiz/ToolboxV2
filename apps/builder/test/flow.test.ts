import { describe, it, expect } from 'vitest';
import { createNode, isConnectionValid } from '../src/flow';
import type { ModuleMetadata } from '@toolbox/core';

const modA: ModuleMetadata & { outputs: string[] } = { name: 'A', version: '1', outputs: ['text'] } as any;
const modB: ModuleMetadata & { inputs: string[] } = { name: 'B', version: '1', inputs: ['text'] } as any;
const modC: ModuleMetadata & { inputs: string[] } = { name: 'C', version: '1', inputs: ['number'] } as any;

describe('createNode', () => {
  it('creates unique node', () => {
    const node1 = createNode(modA);
    const node2 = createNode(modA);
    expect(node1.id).not.toBe(node2.id);
    expect(node1.data.module.name).toBe('A');
  });
});

describe('isConnectionValid', () => {
  it('accepts matching types', () => {
    const a = { module: modA };
    const b = { module: modB };
    expect(isConnectionValid(a, b)).toBe(true);
  });
  it('rejects mismatched types', () => {
    const a = { module: modA };
    const c = { module: modC };
    expect(isConnectionValid(a, c)).toBe(false);
  });
});
