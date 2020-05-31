import React from 'react';
import { GraphConfig } from '../types';
import './GraphConfigForm.css';

const GraphConfigForm: React.SFC<{
  config: GraphConfig;
  onSubmit: (config: GraphConfig) => void;
  onChange: (config: GraphConfig) => void;
}> = ({ config, onSubmit, onChange }) => {
  const {
    loopsAllowed,
    nestedNessRatio,
    outBoundLinkRatio,
    nodeCount
  } = config;
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(config);
  };
  const loopsAllowedChange = () =>
    onChange({ ...config, loopsAllowed: !config.loopsAllowed });
  const outBoundLinkRatioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...config, outBoundLinkRatio: +e.target.value });
  const nestedNessRatioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...config, nestedNessRatio: +e.target.value });
  const nodeCountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...config, nodeCount: +e.target.value });

  return (
    <form className="graph-config-form" onSubmit={onFormSubmit}>
      <label htmlFor="loopsAllowed">
        <span>Loops Allowed</span>
        <input
          id="loopsAllowed"
          type="checkbox"
          checked={loopsAllowed}
          onChange={loopsAllowedChange}
        />
      </label>
      <label htmlFor="nodeCount">
        <span>Node Count</span>
        <input
          id="nodeCount"
          type="number"
          min="1"
          max="100"
          step="1"
          value={nodeCount}
          onChange={nodeCountChange}
        />
      </label>
      <label htmlFor="nestedNessRatio">
        <span>Nestedness Ratio</span>
        <input
          id="nestedNessRatio"
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={nestedNessRatio}
          onChange={nestedNessRatioChange}
        />
      </label>
      <label htmlFor="outBoundLinkRatio">
        <span>Outbound Links Ratio</span>
        <input
          id="outBoundLinkRatio"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={outBoundLinkRatio}
          onChange={outBoundLinkRatioChange}
        />
      </label>
      <button type="submit">New Graph</button>
    </form>
  );
};

export default GraphConfigForm;
