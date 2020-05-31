import { GraphLink, GraphNode } from './utils/nested-graph';

export interface Point {
  x: number;
  y: number;
}

/**
 * Interface represent representable based on svg representation of rect
 * Where (x,y) is (0,0) for the top left corner.
 */
export interface Rectangle {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface LayoutNode {
  element: GraphNode;
  children: LayoutNode[];
  links: LayoutLink[];
  size: {
    width: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface LayoutLink {
  points: Point[];
  element: GraphLink;
}

export interface GraphLayout {
  nodes: LayoutNode[];
  links: LayoutLink[];
  size: Size;
}

export interface GraphConfig {
  nodeCount: number;
  nestedNessRatio: number;
  outBoundLinkRatio: number;
  loopsAllowed: boolean;
}
