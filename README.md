# nested-graph-generator
A random graph generator for generating compound graphs with nodes, node group(container node) and links.
Visit [demo site](https://zombierobo.github.io/nested-graph-generator) to visualize the graphs generated using this library.

## Why
Imagine you are writing an application or a library which handles rendering of graphs. You will need a good dataset of graphs to test your application for various types and sizes of graphs.

## Graph generator configurations
1. Node count - number of nodes in the graph.
2. Nestedness Ratio - higher the ratio, higher the number of node groups.
3. Outbound Links Ratio - higher the ratio, higher the number of outgoing links from any given node.
4. Loops Allowed - If set to false, the generated graph is acylic.

## Assumptions or Constraints
1. Links are not permitted from a node to any of its ancestor node group. For example :- If node group C encloses node group B which is inturn encloses node A forming a containment relationship such as C->B->A, then links are not allowed from node A to node group B or node group C

## Install

using npm
```
$ npm install nested-graph-generator
```
using yarn
```
$ yarn add nested-graph-generator
```

## Example Usage

```typescript
import { generateNestedGraph } from "nested-graph-generator";
const graph = generateNestedGraph();
/*
{
    nodes: [
        { id: '0' }, { id: '1' },
        { id: '2' }, { id: '3' },
        { id: '4' }, { id: '5' },
        { id: '6' }, { id: '7' },
        { id: '8' }, { id: '9' }
    ],
    links: [
        { sourceId: '0', targetId: '5' },
        { sourceId: '1', targetId: '4' },
        { sourceId: '2', targetId: '6' },
        { sourceId: '3', targetId: '7' },
        { sourceId: '5', targetId: '3' },
        { sourceId: '6', targetId: '4' },
        { sourceId: '6', targetId: '8' },
        { sourceId: '7', targetId: '9' },
        { sourceId: '8', targetId: '3' },
        { sourceId: '9', targetId: '4' }
    ]
}
*/
```

With configuration parameters

```typescript
import { generateNestedGraph } from "nested-graph-generator";
const graph = generateNestedGraph({
    nodeCount: 10,
    nestedNessRatio: 0.3,
    outBoundLinkRatio: 0.2
})
/*
{
    nodes: [
        { id: '0' },
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
        { id: '6', parentId: '7' },
        { id: '7', parentId: '0' },
        { id: '8' },
        { id: '9', parentId: '6' }
    ],
    links: [
        { sourceId: '1', targetId: '2' },
        { sourceId: '1', targetId: '4' },
        { sourceId: '1', targetId: '6' },
        { sourceId: '2', targetId: '3' },
        { sourceId: '2', targetId: '7' },
        { sourceId: '3', targetId: '4' },
        { sourceId: '3', targetId: '8' },
        { sourceId: '5', targetId: '4' },
        { sourceId: '5', targetId: '8' },
        { sourceId: '8', targetId: '0' },
        { sourceId: '8', targetId: '9' }
    ]
}
*/
```