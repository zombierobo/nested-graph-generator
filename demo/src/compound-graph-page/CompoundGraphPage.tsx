import React, { useState } from 'react';
import './CompoundGraphPage.css';
import { DrawCompoundGraph } from './draw-compound-graph';
import { GraphConfigForm } from './graph-config-form';
import { GraphConfig, GraphLayout } from './types';
import { getRandomArbitraryInt } from './utils/general';
import { generateNestedGraph } from 'nested-graph-generator';
import { generateGraphLayout } from './utils/layout-utils';
import { NestedGraph } from './utils/nested-graph';
import ReactJson from 'react-json-view';

function generateRandomGraph(config: GraphConfig) {
  const graph = generateNestedGraph(config);
  const layout = generateGraphLayout(
    new NestedGraph(
      graph.nodes.map((n, i) => ({ ...n, name: `Graph-Node ${i}` })),
      graph.links
    )
  );
  return {
    graph,
    layout
  };
}

const initialConfig: GraphConfig = {
  loopsAllowed: false,
  nodeCount: getRandomArbitraryInt(5, 10),
  nestedNessRatio: 0.2,
  outBoundLinkRatio: 0.3
};

const initialGraphData = generateRandomGraph(initialConfig);

const CompoundGraphPage: React.FC = () => {
  const [config, setConfig] = useState<GraphConfig>(initialConfig);
  const [{ graph, layout }, setGraphData] = useState<{
    graph: any;
    layout: GraphLayout;
  }>(initialGraphData);

  console.table(graph);
  console.table(layout);

  const onGenerateFromConfigSubmit = () =>
    setGraphData(generateRandomGraph(config));

  return (
    <div className="compound-graph-page">
      <div className="compound-graph-page__info">
        <div className="compound-graph-page__params__section">
          <h4 className="compound-graph-page__params__section__header">
            Configuration
          </h4>
          <div className="compound-graph-page__params__section__body">
            <GraphConfigForm
              config={config}
              onChange={setConfig}
              onSubmit={onGenerateFromConfigSubmit}
            />
          </div>
        </div>
      </div>
      <div className="compound-graph-page__json">
        <ReactJson
          src={graph}
          name={null}
          displayDataTypes={false}
          displayObjectSize={false}
        />
      </div>
      <div className="compound-graph-page__draw-area">
        <DrawCompoundGraph layout={layout} />
      </div>
    </div>
  );
};

export default CompoundGraphPage;
