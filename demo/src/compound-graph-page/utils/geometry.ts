import { curveLinear, line } from 'd3-shape';
import { graphlib, layout } from 'dagre';
import { Point, Rectangle, Size } from '../types';

export const linearLinePathGenerator = line<Point>()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(curveLinear);

function translateOriginFromCenterToTopLeft(point: Point, size: Size): Point {
  return {
    x: point.x - size.width / 2,
    y: point.y - size.height / 2
  };
}

function getRectangleLinkPoints(rect: Rectangle): Point[] {
  return [
    {
      x: rect.x,
      y: rect.y
    },
    {
      x: rect.x + rect.width / 2,
      y: rect.y
    },
    {
      x: rect.x + rect.width,
      y: rect.y
    },
    {
      x: rect.x + rect.width,
      y: rect.y + rect.height / 2
    },
    {
      x: rect.x + rect.width,
      y: rect.y + rect.height
    },
    {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height
    },
    {
      x: rect.x,
      y: rect.y + rect.height
    },
    {
      x: rect.x,
      y: rect.y + rect.height / 2
    }
  ];
}

function distanceBetweenPoint(pointA: Point, pointB: Point) {
  return Math.sqrt(
    (pointA.x - pointB.x) * (pointA.x - pointB.x) +
      (pointA.y - pointB.y) * (pointA.y - pointB.y)
  );
}

export function linkBetweenTwoRectangle(
  rectA: Rectangle,
  rectB: Rectangle
): Point[] {
  const rectALinkPoints = getRectangleLinkPoints(rectA);
  const rectBLinkPoints = getRectangleLinkPoints(rectB);
  const allPossibleLinks = rectALinkPoints
    .map((ra) => rectBLinkPoints.map((rb) => [ra, rb]))
    .reduce((acc, cur) => acc.concat(cur), []);
  allPossibleLinks.sort(
    (a, b) =>
      distanceBetweenPoint(a[0], a[1]) - distanceBetweenPoint(b[0], b[1])
  );
  return allPossibleLinks[0];
}

export function shiftPoint(point: Point, dx: number, dy: number): Point {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
}

export function buildGraphLayout(
  nodes: Array<{ id: string; size: { width: number; height: number } }>,
  links: Array<{ sourceId: string; targetId: string }>,
  contains: Array<{ id: string; parentId: string }>,
  opts?: {
    marginx: number;
    marginy: number;
  }
): {
  nodes: Array<{
    id: string;
    size: { width: number; height: number };
    position: { x: number; y: number };
  }>;
  links: Array<{
    sourceId: string;
    targetId: string;
    points: Array<{ x: number; y: number }>;
  }>;
  size: {
    width: number;
    height: number;
  };
} {
  const graph = new graphlib.Graph();
  graph.setGraph({ ...opts, compound: contains.length > 0 });
  graph.setDefaultEdgeLabel(function () {
    return {};
  });
  nodes.forEach((n) => graph.setNode(n.id.toString(), n.size));
  links
    .filter(
      (l) =>
        /*
        dagre cannot layout when a group node has an outgoing or incoming link.
        Issue - https://github.com/dagrejs/dagre-d3/issues/319
      */
        !contains.some(
          (c) => c.parentId === l.sourceId || c.parentId === l.targetId
        )
    )
    .forEach((l) => graph.setEdge(l.sourceId, l.targetId));
  contains.forEach((c) => graph.setParent(c.id, c.parentId));
  layout(graph);
  return {
    nodes: graph.nodes().map((nodeId) => {
      const n = graph.node(nodeId);
      return {
        id: nodeId,
        size: {
          width: n.width,
          height: n.height
        },
        position: translateOriginFromCenterToTopLeft(n, n)
      };
    }),
    links: graph.edges().map((e) => ({
      sourceId: e.v,
      targetId: e.w,
      points: graph.edge(e).points
    })),
    size: {
      width: graph.graph().width || 0,
      height: graph.graph().height || 0
    }
  };
}
