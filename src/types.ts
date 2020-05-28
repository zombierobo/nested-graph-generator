export interface GraphConfig {
  nodeCount: number;
  nestedNessRatio: number;
  outBoundLinkRatio: number;
  loopsAllowed: boolean;
}

export interface GraphNode {
  id: string;
  parentId?: string;
}

export interface GraphLink {
  sourceId: string;
  targetId: string;
}
