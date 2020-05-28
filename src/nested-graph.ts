import { GraphNode, GraphLink } from './types';

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
      const nodeIdsSetFromSubTree = new Set(
        this.getAllNodesInSubGraph(rootNode.id).map((n) => n.id)
      );
      return this.getAllNodes().filter((n) => !nodeIdsSetFromSubTree.has(n.id));
    } else {
      return [];
    }
  }
}
