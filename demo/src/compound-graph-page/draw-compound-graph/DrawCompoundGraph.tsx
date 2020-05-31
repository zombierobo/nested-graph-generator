import React, { memo } from 'react';
import { GraphLayout, LayoutLink } from '../types';
import { linearLinePathGenerator } from '../utils/geometry';
import {
  getAllLinksFromNodeTree,
  getAllNodesFromNodeTree
} from '../utils/layout-utils';

const GraphLink: React.SFC<{ link: LayoutLink }> = ({ link }) => {
  const arrowCircleColor = 'hsl(' + Math.random() * 360 + ',80%,48%)';
  return (
    <g
      className={`link link-source=${link.element.sourceId} link-target=${link.element.targetId}`}
    >
      <path
        stroke="grey"
        strokeWidth="2"
        fill="none"
        d={linearLinePathGenerator(link.points) || undefined}
      />
      <circle
        fill={arrowCircleColor}
        cx={link.points[link.points.length - 1].x}
        cy={link.points[link.points.length - 1].y}
        r={12}
      />
      <circle
        fill={arrowCircleColor}
        cx={link.points[0].x}
        cy={link.points[0].y}
        r={8}
      />
    </g>
  );
};

const DrawCompoundGraph: React.SFC<{
  layout: GraphLayout;
}> = ({ layout }) => {
  const allNodes = getAllNodesFromNodeTree(layout);
  const allLinks = getAllLinksFromNodeTree(layout);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${layout.size.width} ${layout.size.height}`}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {allNodes.map((n) => (
        <g key={n.element.id} className={`node ${n.element.id}`}>
          <rect
            x={n.position.x}
            y={n.position.y}
            width={n.size.width}
            height={n.size.height}
            style={{
              stroke: 'black',
              fillOpacity: 0,
              strokeWidth: 5,
              strokeOpacity: 1
            }}
          />
          <text x={n.position.x + 30} y={n.position.y + 30}>
            {`${n.element.name} (${n.position.x}, ${n.position.y})`}
          </text>
        </g>
      ))}
      {allLinks.map((l) => (
        <GraphLink
          link={l}
          key={`${l.element.sourceId}-${l.element.targetId}`}
        />
      ))}
    </svg>
  );
};

export default memo(DrawCompoundGraph);
