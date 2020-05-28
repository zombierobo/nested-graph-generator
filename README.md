# nested-graph-generator
A random graph generator for generating compound graphs with nodes, node group(container node) and links.

## Why
Imagine you are writing an application or a library which handles rendering of graphs. You will need a good dataset of graphs to test your application for various types and sizes of graphs.

## Graph generator configurations
1. Node count - number of nodes in the graph.
2. Nestedness Ratio - higher the ratio, higher the number of node groups.
3. Outbound Links Ratio - higher the ratio, higher the number of outgoing links from any given node.
4. Loops Allowed - If set to false, the generated graph is acylic.

## Assumptions or Constraints
1. Links are not permitted from a node to any of its ancestor node group. For example :- If node group C encloses node group B which is inturn encloses node A forming a containment relationship such as C->B->A, then links are not allowed from node A to node group B or node group C

