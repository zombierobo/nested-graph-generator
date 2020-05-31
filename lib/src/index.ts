import { GraphConfig } from './types';
import { generateNG } from './generate-ng';

export function generateNestedGraph(opts?: Partial<GraphConfig>) {
  const nestedGraph = generateNG(opts || {});
  return {
    nodes: nestedGraph.getAllNodes(),
    links: nestedGraph.getAllLinks()
  };
}
