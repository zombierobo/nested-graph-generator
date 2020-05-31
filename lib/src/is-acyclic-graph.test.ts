import { isAcyclicGraph } from './is-acyclic-graph';

const cyclicGraphs = [
  [
    {
      sourceId: 'a',
      targetId: 'b'
    },
    {
      sourceId: 'b',
      targetId: 'c'
    },
    {
      sourceId: 'c',
      targetId: 'a'
    }
  ],
  [
    {
      sourceId: 'a',
      targetId: 'b'
    },
    {
      sourceId: 'b',
      targetId: 'a'
    }
  ]
];

const acyclicGraphs = [
  [
    {
      sourceId: 'a',
      targetId: 'b'
    },
    {
      sourceId: 'b',
      targetId: 'c'
    },
    {
      sourceId: 'b',
      targetId: 'e'
    },
    {
      sourceId: 'c',
      targetId: 'd'
    },
    {
      sourceId: 'e',
      targetId: 'd'
    }
  ],
  [
    {
      sourceId: 'a',
      targetId: 'b'
    },
    {
      sourceId: 'd',
      targetId: 'f'
    },
    {
      sourceId: 'm',
      targetId: 'k'
    }
  ]
];

describe('isAcyclicGraph', () => {
  it('should detect a cycle in a graph', () => {
    cyclicGraphs.forEach((g) => expect(isAcyclicGraph(g)).toBeFalsy());
  });

  it('should detect acycle graphs', () => {
    acyclicGraphs.forEach((g) => expect(isAcyclicGraph(g)).toBeTruthy());
  });
});
