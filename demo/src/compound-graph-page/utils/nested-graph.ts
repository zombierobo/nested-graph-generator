export interface GraphNode {
  name: string;
  id: string;
  parentId?: string;
}

export interface GraphLink {
  sourceId: string;
  targetId: string;
}

export class NestedGraph {
  private nodesMap: Map<string, GraphNode>;
  private links: GraphLink[];

  constructor(nodes: GraphNode[] = [], links: GraphLink[] = []) {
    this.nodesMap = new Map();
    this.setNodes(nodes);
    this.links = links;
  }

  public setNodes(nodes: GraphNode[]) {
    this.nodesMap = new Map();
    nodes.forEach((n) => this.nodesMap.set(n.id, n));
  }

  public updateNode(nodeId: string, node: GraphNode) {
    this.nodesMap.set(nodeId, node);
  }

  public setLinks(links: GraphLink[]) {
    this.links = links;
  }

  public findNode(nodeId: string): GraphNode | undefined {
    return this.nodesMap.get(nodeId);
  }
  public getAllNodes(): GraphNode[] {
    return Array.from(this.nodesMap.values());
  }

  public getAllRootNodes(): Array<GraphNode> {
    return this.getAllNodes().filter((n) => n.parentId === undefined);
  }

  public getAllLinks(): GraphLink[] {
    return this.links;
  }

  public getAllChildrenNodes(rootNodeId: string): GraphNode[] {
    return this.getAllNodes().filter((n) => n.parentId === rootNodeId);
  }

  public getLinksConnectingNodes(nodeIds: string[]): GraphLink[] {
    const nodeIdSet = new Set(nodeIds);
    return this.getAllLinks().filter(
      (l) => nodeIdSet.has(l.sourceId) && nodeIdSet.has(l.targetId)
    );
  }
}
