import { TeamNode } from './types';

export type FlattenedNode = { id: string; name: string; depth: number };

export function flattenHierarchy(root: TeamNode): FlattenedNode[] {
  const out: FlattenedNode[] = [];
  const walk = (node: TeamNode, depth: number) => {
    out.push({ id: node.id, name: node.name, depth });
    for (const child of node.children) walk(child, depth + 1);
  };
  walk(root, 0);
  return out;
}
