import { GraphConfig, GraphLink } from './types';
import { eventHappened, randomNumber } from './utils';
import { isAcyclicGraph } from './is-acyclic-graph';
import { NestedGraph } from './nested-graph';

function generateNGHelper(opts: GraphConfig): NestedGraph {
  const nestedGraph = new NestedGraph(
    new Array(opts.nodeCount).fill(null).map((_, i) => ({
      id: i.toString()
    }))
  );

  // assign parents to each node based on nestedNessRatio
  for (const node of nestedGraph.getAllNodes()) {
    if (eventHappened(opts.nestedNessRatio)) {
      const otherNodes = nestedGraph
        .getAllNodes()
        .filter(
          (n) => n.id !== node.id && !nestedGraph.isAncestor(n.id, node.id)
        );
      if (otherNodes.length > 0) {
        nestedGraph.updateNode(node.id, {
          ...node,
          parentId: otherNodes[randomNumber(otherNodes.length - 1)].id
        });
      }
    }
  }

  // generate links between nodes based on outBoundLinkRatio
  const links: GraphLink[] = [];

  for (const node of nestedGraph.getAllNodes()) {
    const connectableNodes = nestedGraph.getAllNodesFromOtherSubTrees(node.id);
    for (const connectable of connectableNodes) {
      if (
        eventHappened(opts.outBoundLinkRatio) &&
        (opts.loopsAllowed ||
          isAcyclicGraph(
            links.concat([{ sourceId: node.id, targetId: connectable.id }])
          ))
      ) {
        links.push({ sourceId: node.id, targetId: connectable.id });
      }
    }
  }

  nestedGraph.setLinks(links);

  return nestedGraph;
}

const defaultGraphConfig: GraphConfig = {
  nodeCount: 10,
  nestedNessRatio: 0.1,
  outBoundLinkRatio: 0.1,
  loopsAllowed: false
};

export function generateNG(opts: Partial<GraphConfig>) {
  if (opts) {
    if (opts.nodeCount !== undefined && opts.nodeCount <= 0) {
      throw new Error('nodeCount must be greater than zero');
    }
    if (
      opts.nestedNessRatio !== undefined &&
      !(opts.nestedNessRatio >= 0 && opts.nestedNessRatio <= 1.0)
    ) {
      throw new Error('nestedNessRatio must be in the range [0, 1.0]');
    }
    if (
      opts.outBoundLinkRatio !== undefined &&
      !(opts.outBoundLinkRatio >= 0 && opts.outBoundLinkRatio <= 1.0)
    ) {
      throw new Error('outBoundLinkRatio must be in the range [0, 1.0]');
    }
  }

  return generateNGHelper({
    nodeCount:
      opts.nodeCount !== undefined
        ? opts.nodeCount
        : defaultGraphConfig.nodeCount,
    nestedNessRatio:
      opts.nestedNessRatio !== undefined
        ? opts.nestedNessRatio
        : defaultGraphConfig.nestedNessRatio,
    outBoundLinkRatio:
      opts.outBoundLinkRatio !== undefined
        ? opts.outBoundLinkRatio
        : defaultGraphConfig.outBoundLinkRatio,
    loopsAllowed:
      opts.loopsAllowed !== undefined
        ? opts.loopsAllowed
        : defaultGraphConfig.loopsAllowed
  });
}
