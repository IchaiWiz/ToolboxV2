import type { ModuleMetadata } from '@toolbox/core';
import type { Node, Edge, Connection } from 'reactflow';

export interface ModuleNodeData {
  module: ModuleMetadata & { inputs?: string[]; outputs?: string[] };
}

export function createNode(module: ModuleMetadata & { inputs?: string[]; outputs?: string[] }, position = { x: 0, y: 0 }): Node<ModuleNodeData> {
  return {
    id: `${module.name}-${Math.random().toString(36).slice(2, 9)}`,
    type: 'default',
    position,
    data: { module },
  };
}

export function isConnectionValid(source: ModuleNodeData, target: ModuleNodeData): boolean {
  const outputs = source.module.outputs ?? ['*'];
  const inputs = target.module.inputs ?? ['*'];
  return outputs.some(o => inputs.includes(o) || o === '*' || inputs.includes('*'));
}

export function validateConnection(nodes: Node<ModuleNodeData>[], connection: Connection): boolean {
  const sourceNode = nodes.find(n => n.id === connection.source);
  const targetNode = nodes.find(n => n.id === connection.target);
  if (!sourceNode || !targetNode) return false;
  return isConnectionValid(sourceNode.data, targetNode.data);
}
