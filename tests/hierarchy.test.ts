import { flattenHierarchy } from '../src/domain/hierarchy';
import { TeamNode } from '../src/domain/types';

test('flattenHierarchy flattens with depth', () => {
  const tree: TeamNode = {
    id: '1',
    name: 'Leader',
    role: 'LEADER',
    invitedByUserId: null,
    children: [
      { id: '2', name: 'M1', role: 'MEMBER', invitedByUserId: '1', children: [] },
      { id: '3', name: 'M2', role: 'MEMBER', invitedByUserId: '1', children: [{ id: '4', name: 'M2A', role: 'MEMBER', invitedByUserId: '3', children: [] }] },
    ],
  };
  const flat = flattenHierarchy(tree);
  expect(flat[0]).toEqual({ id: '1', name: 'Leader', depth: 0 });
  expect(flat.find((x) => x.id === '4')?.depth).toBe(2);
});
