import { GraphNode, GraphLink } from './types';

export class NestedGraph {
  private nodesMap: { [key: string]: GraphNode };
  private links: GraphLink[];

  constructor(nodes: GraphNode[] = [], links: GraphLink[] = []) {
    this.nodesMap = {};
    this.setNodes(nodes);
    this.links = links;
  }

  public setNodes(nodes: GraphNode[]) {
    this.nodesMap = {};
    nodes.forEach((n) => (this.nodesMap[n.id] = n));
  }

  public updateNode(nodeId: string, node: GraphNode) {
    this.nodesMap[nodeId] = node;
  }

  public setLinks(links: GraphLink[]) {
    this.links = links;
  }

  public findNode(nodeId: string): GraphNode | undefined {
    return this.nodesMap[nodeId];
  }

  public getAllNodes(): GraphNode[] {
    return Object.keys(this.nodesMap).map((k) => this.nodesMap[k]);
  }

  public getAllLinks(): GraphLink[] {
    return this.links;
  }

  public isAncestor(nodeId: string, candidateNodeId: string): boolean {
    const node = this.findNode(nodeId);
    return node && node.parentId !== undefined
      ? node.parentId === candidateNodeId ||
          this.isAncestor(node.parentId, candidateNodeId)
      : false;
  }

  public findRootNode(nodeId: string): GraphNode | undefined {
    const node = this.findNode(nodeId);
    if (node) {
      if (node.parentId) {
        this.findRootNode(node.parentId);
      } else {
        return node;
      }
    } else {
      return undefined;
    }
  }

  public getAllNodesInSubGraph(rootNodeId: string): GraphNode[] {
    const rootNode = this.findNode(rootNodeId);
    return rootNode
      ? this.getAllNodes()
          .filter((n) => this.isAncestor(n.id, rootNodeId))
          .concat([rootNode])
      : [];
  }

  public getAllNodesFromOtherSubTrees(nodeId: string): GraphNode[] {
    const rootNode = this.findRootNode(nodeId);
    if (rootNode) {
      const nodeIdsSetFromSubTree = this.getAllNodesInSubGraph(rootNode.id)
        .map((n) => n.id)
        .reduce((acc, cur) => {
          acc[cur] = true;
          return acc;
        }, {} as { [key: string]: boolean });
      return this.getAllNodes().filter((n) => !nodeIdsSetFromSubTree[n.id]);
    } else {
      return [];
    }
  }
}
