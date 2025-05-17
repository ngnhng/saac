import React from "react";
import { ElkEdgeComponentProps, ElkPoint } from "../types/elk-diagram";

/**
 * ElkEdge component renders a connection between nodes
 *
 * This component handles the visual representation of edges including:
 * - SVG path for the connection line
 * - Edge labels
 * - Visual styling based on edge type
 * - Click handling for edge interactions
 */
export const ElkEdge: React.FC<ElkEdgeComponentProps> = ({
  edge,
  onClick,
  className = "",
  style = {},
}) => {
  // Return null if no sections are provided
  if (!edge.sections || edge.sections.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick(edge, e);
  };

  // Prepare SVG path for the edge
  const renderPath = (points: ElkPoint[]): string => {
    if (!points || points.length < 2) return ""; // Return empty string instead of null

    // Create path using start point, bend points, and end point
    const pathCommands = [
      `M ${points[0].x} ${points[0].y}`, // Move to start point
    ];

    // Add line segments for each bend point
    for (let i = 1; i < points.length; i++) {
      pathCommands.push(`L ${points[i].x} ${points[i].y}`);
    }

    return pathCommands.join(" ");
  };

  // Render each section of the edge
  return (
    <>
      {edge.sections.map((section, index) => {
        // Combine all points (start, bend points if any, end)
        const allPoints = [
          section.startPoint,
          ...(section.bendPoints || []),
          section.endPoint,
        ];

        // Calculate label position (midpoint of the path)
        const labelPoint = (() => {
          const midIndex = Math.floor(allPoints.length / 2);
          return allPoints[midIndex];
        })();

        // We'll use CSS variables for colors that match our theme
        const edgeStyle: React.CSSProperties = {
          stroke: "var(--color-border)",
          strokeWidth: 1.5,
          fill: "none",
          ...style,
        };

        // Generate a unique key for this section
        const sectionKey = section.id || `${edge.id}-section-${index}`;

        return (
          <g
            key={sectionKey}
            className={`elk-edge ${className}`}
            onClick={handleClick}
          >
            {/* Edge path */}
            <path
              d={renderPath(allPoints)}
              style={edgeStyle}
              markerEnd="url(#arrowhead)"
              data-edge-id={edge.id}
            />

            {/* Edge label if available */}
            {edge.label && labelPoint && (
              <text
                x={labelPoint.x}
                y={labelPoint.y - 10}
                textAnchor="middle"
                style={{
                  fontSize: "12px",
                  fill: "var(--color-muted-foreground)",
                  pointerEvents: "none",
                }}
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
};
