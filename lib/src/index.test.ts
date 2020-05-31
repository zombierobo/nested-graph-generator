import { generateNestedGraph } from './index';
import { isAcyclicGraph } from './is-acyclic-graph';

describe('generateNestedGraph', () => {
  it('should generate random graph', () => {
    const { nodes, links } = generateNestedGraph();
    expect(nodes.length).toBeGreaterThan(0);
    expect(links.length).toBeGreaterThan(0);
    expect(isAcyclicGraph(links)).toBeTruthy();
  });

  it('should throw error on invalid inputs', () => {
    expect(() => generateNestedGraph({ nodeCount: -1 })).toThrowError(
      new Error('nodeCount must be greater than zero')
    );
    expect(() => generateNestedGraph({ nodeCount: 0 })).toThrow(
      new Error('nodeCount must be greater than zero')
    );
    expect(() => generateNestedGraph({ nestedNessRatio: -1 })).toThrowError(
      new Error('nestedNessRatio must be in the range [0, 1.0]')
    );
    expect(() => generateNestedGraph({ nestedNessRatio: 1.5 })).toThrow(
      new Error('nestedNessRatio must be in the range [0, 1.0]')
    );
    expect(() => generateNestedGraph({ outBoundLinkRatio: -1 })).toThrow(
      new Error('outBoundLinkRatio must be in the range [0, 1.0]')
    );
    expect(() => generateNestedGraph({ outBoundLinkRatio: 1.5 })).toThrow(
      new Error('outBoundLinkRatio must be in the range [0, 1.0]')
    );
  });

  it('some graphs generated should be cyclic when loopsAllowed flag is true', () => {
    /**
     * The reason why some graphs rather than all graphs are cyclic because the number
     * of links produced may not be enough to form a cycle in the graph.
     */
    let nodeCount = 5;
    while (nodeCount++ < 50) {
      let outBoundLinkRatio = 0;
      while (outBoundLinkRatio <= 1) {
        let iteration = 0;
        let cyclicGraphFound = false;
        while (!cyclicGraphFound && iteration++ < 100) {
          const { links } = generateNestedGraph({
            loopsAllowed: true,
            nodeCount,
            outBoundLinkRatio
          });
          cyclicGraphFound = !isAcyclicGraph(links);
        }
        if (outBoundLinkRatio > 0) {
          expect(cyclicGraphFound).toBeTruthy();
        } else {
          expect(cyclicGraphFound).toBeFalsy();
        }
        outBoundLinkRatio += 0.1;
      }
    }
  });

  it('graph should have some container elements if nestedNessRatio is greater than zero', () => {
    let nodeCount = 1;
    while (nodeCount++ < 30) {
      let nestedNessRatio = 0;
      while (nestedNessRatio <= 1) {
        let iteration = 0;
        let containerElementsFound = false;
        while (!containerElementsFound && iteration++ < 100) {
          const { nodes } = generateNestedGraph({
            nodeCount,
            nestedNessRatio
          });
          containerElementsFound = nodes.some(
            (n) =>
              n.parentId !== undefined &&
              n.id !== n.parentId &&
              nodes.some((a) => a.id === n.parentId)
          );
        }
        if (nodeCount > 1 && nestedNessRatio > 0) {
          expect(containerElementsFound).toBeTruthy();
        } else {
          expect(containerElementsFound).toBeFalsy();
        }
        nestedNessRatio += 0.1;
      }
    }
  });
});
