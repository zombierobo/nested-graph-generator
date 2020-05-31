import { GraphLayout, LayoutLink, LayoutNode, Point } from '../types';
import {
  buildGraphLayout,
  linkBetweenTwoRectangle,
  shiftPoint
} from './geometry';
import { GraphLink, GraphNode, NestedGraph } from './nested-graph';

function translateLayoutNode(
  layoutNode: LayoutNode,
  dx: number,
  dy: number
): LayoutNode {
  return {
    ...layoutNode,
    position: shiftPoint(layoutNode.position, dx, dy),
    links: layoutNode.links.map((l) => ({
      ...l,
      points: l.points.map((p) => shiftPoint(p, dx, dy))
    })),
    children: layoutNode.children.map((c) => translateLayoutNode(c, dx, dy))
  };
}

function buildLayout(
  nestedGraph: NestedGraph,
  subLayouts: LayoutNode[]
): GraphLayout {
  const layout = buildGraphLayout(
    subLayouts.map(({ element, size }) => ({
      id: element.id,
      size
    })),
    nestedGraph.getLinksConnectingNodes(subLayouts.map((l) => l.element.id)),
    [],
    {
      marginx: 45,
      marginy: 45
    }
  );

  /* Patch position for each root node from layout */
  const nodes = subLayouts.map((rootNode) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newPosition = (layout.nodes.find(
      (n) => n.id === rootNode.element.id
    ) as any).position as Point;
    return translateLayoutNode(
      rootNode,
      newPosition.x - rootNode.position.x,
      newPosition.y - rootNode.position.y
    );
  });

  return {
    nodes,
    links: layout.links.map((l) => ({
      element: l,
      points: l.points
    })),
    size: layout.size
  };
}

function layoutSubGraph(
  rootNode: GraphNode,
  nestedGraph: NestedGraph
): LayoutNode {
  const childrenNodes = nestedGraph.getAllChildrenNodes(rootNode.id);
  if (childrenNodes.length > 0) {
    const childrenNodeLayout = childrenNodes.map((c) =>
      layoutSubGraph(c, nestedGraph)
    );

    const { nodes, links, size } = buildLayout(nestedGraph, childrenNodeLayout);

    return {
      element: rootNode,
      children: nodes,
      size,
      position: {
        x: 0,
        y: 0
      },
      links
    };
  } else {
    return {
      element: rootNode,
      children: [],
      size: {
        width: 400,
        height: 150
      },
      position: {
        x: 0,
        y: 0
      },
      links: []
    };
  }
}

export function getAllNodesFromNodeTree(
  graphLayout: GraphLayout
): LayoutNode[] {
  let nodeQueue = graphLayout.nodes;
  let nodes: LayoutNode[] = [];
  while (nodeQueue.length > 0) {
    nodes = nodes.concat(nodeQueue);
    nodeQueue = nodeQueue
      .map((n) => n.children)
      .reduce((acc, cur) => acc.concat(cur), []);
  }
  return nodes;
}

export function getAllLinksFromNodeTree(
  graphLayout: GraphLayout
): LayoutLink[] {
  let links: LayoutLink[] = graphLayout.links;
  let nodeQueue = graphLayout.nodes;
  while (nodeQueue.length > 0) {
    links = links.concat(
      nodeQueue.map((n) => n.links).reduce((acc, cur) => acc.concat(cur), [])
    );
    nodeQueue = nodeQueue
      .map((n) => n.children)
      .reduce((acc, cur) => acc.concat(cur), []);
  }
  return links;
}

function generateLinkBetweenLayoutNode(
  sourceNode: LayoutNode,
  targetNode: LayoutNode,
  link: GraphLink
): LayoutLink {
  return {
    element: link,
    points: linkBetweenTwoRectangle(
      { ...sourceNode.size, ...sourceNode.position },
      { ...targetNode.size, ...targetNode.position }
    )
  };
}

/**
 * current layouting algorithm does not generate links which connect from one sub graph node to
 * another sub graph node.
 * This is solved by generating missing links at the end of layout.
 */
function generateMissingLinks(
  graphLayout: GraphLayout,
  nestedGraph: NestedGraph
): LayoutLink[] {
  const allLinksGenerated = getAllLinksFromNodeTree(graphLayout);
  const allLayoutNodesMap = getAllNodesFromNodeTree(graphLayout).reduce(
    (map, cur) => {
      map[cur.element.id] = cur;
      return map;
    },
    {} as { [key: string]: LayoutNode }
  );
  return nestedGraph
    .getAllLinks()
    .filter(
      (l) =>
        !allLinksGenerated.some(
          (gl) =>
            gl.element.sourceId === l.sourceId &&
            gl.element.targetId === l.targetId
        )
    )
    .map((l) =>
      generateLinkBetweenLayoutNode(
        allLayoutNodesMap[l.sourceId],
        allLayoutNodesMap[l.targetId],
        l
      )
    );
}

/**
 * generates layout properties for all the nodes(width, height, x and y) and
 * links(Array<{x, y}>) for a given abstract graph.
 * @param nestedGraph
 */
export function generateGraphLayout(nestedGraph: NestedGraph): GraphLayout {
  const graphLayout = buildLayout(
    nestedGraph,
    nestedGraph
      .getAllRootNodes()
      .map((rootNode) => layoutSubGraph(rootNode, nestedGraph))
  );
  return {
    ...graphLayout,
    links: graphLayout.links.concat(
      generateMissingLinks(graphLayout, nestedGraph)
    )
  };
}
