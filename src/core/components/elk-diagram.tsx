import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useElkLayout } from "../hooks/use-elk-layout";
import { ElkNode } from "./elk-node";
import { ElkEdge } from "./elk-edge";
import {
  ElkDiagramProps,
  ElkNode as ElkNodeType,
  ElkEdge as ElkEdgeType,
  ElkGraph,
} from "../types/elk-diagram";

/**
 * ElkDiagram is a component that renders a hierarchical directed graph
 * using ElkJS for layout calculation and custom React components for rendering
 */
export const ElkDiagram: React.FC<ElkDiagramProps> = ({
  nodes = [],
  edges = [],
  layoutOptions = {},
  width = "100%",
  height = "100%",
  className = "",
  style = {},
  nodeComponent: CustomNodeComponent,
  edgeComponent: CustomEdgeComponent,
  onNodeClick,
  onEdgeClick,
}) => {
  // Reference to the diagram container element
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate layout using ElkJS
  const { layoutGraph, loading, error } = useElkLayout(
    nodes,
    edges,
    layoutOptions
  );

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width,
    height,
    overflow: "hidden",
    // Use CSS variable for background color to respect theme
    backgroundColor: "var(--color-background)",
    ...style,
  };

  // Component to use for rendering nodes
  const NodeComponent = CustomNodeComponent || ElkNode;
  // Component to use for rendering edges
  const EdgeComponent = CustomEdgeComponent || ElkEdge;

  // Function to recursively render nodes from the layout
  const renderNodes = useCallback(
    (node: ElkNodeType, parentPath: string[] = []) => {
      const currentPath = [...parentPath, node.id];

      return (
        <NodeComponent
          key={node.id}
          node={node}
          onClick={onNodeClick}
          className={`elk-node-${node.id}`}
        >
          {/* Recursively render child nodes if present */}
          {node.children?.map((childNode) =>
            renderNodes(childNode, currentPath)
          )}
        </NodeComponent>
      );
    },
    [NodeComponent, onNodeClick]
  );

  // Create arrowhead marker for edges
  const renderArrowheadMarker = () => (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
      </marker>
    </defs>
  );

  // Calculate viewport dimensions from layout
  const viewBox = useMemo(() => {
    if (!layoutGraph) return "0 0 1000 800"; // Default for no graph or error

    // Check for a single, simple node (not a group and no edges)
    const isSingleSimpleNode =
      layoutGraph.children &&
      layoutGraph.children.length === 1 &&
      (!layoutGraph.edges || layoutGraph.edges.length === 0) &&
      (!layoutGraph.children[0].children ||
        layoutGraph.children[0].children.length === 0);

    if (isSingleSimpleNode) {
      const singleNode = layoutGraph.children[0];
      // Use node dimensions from layout, with fallbacks similar to ElkNode defaults
      const nodeWidth = singleNode.width || 150;
      const nodeHeight = singleNode.height || 50;
      const nodeX = singleNode.x || 0;
      const nodeY = singleNode.y || 0;

      // Padding around the single node; adjust for desired "proportion"
      const singleNodePadding = 50;

      const vbX = nodeX - singleNodePadding;
      const vbY = nodeY - singleNodePadding;
      const vbWidth = nodeWidth + 2 * singleNodePadding;
      const vbHeight = nodeHeight + 2 * singleNodePadding;

      return `${vbX} ${vbY} ${vbWidth} ${vbHeight}`;
    } else {
      // Existing logic for multiple nodes, graphs with edges, or single group node
      const padding = 50;
      // Use layoutGraph dimensions, with fallbacks for safety
      const graphWidth = layoutGraph.width || 1000;
      const graphHeight = layoutGraph.height || 800;

      const widthWithPadding = graphWidth + padding * 2;
      const heightWithPadding = graphHeight + padding * 2;

      // The viewBox origin is -padding, -padding to center the graph content (0,0)
      return `-${padding} -${padding} ${widthWithPadding} ${heightWithPadding}`;
    }
  }, [layoutGraph]);

  // Log errors if they occur
  useEffect(() => {
    if (error) {
      console.error("ElkDiagram layout error:", error);
    }
  }, [error]);

  // Extract and flatten all edges from the layout graph
  const flattenedEdges = useCallback((graph: ElkGraph): ElkEdgeType[] => {
    if (!graph) return [];
    return graph.edges || [];
  }, []);

  if (loading) {
    return <div className="elk-diagram-loading">Calculating layout...</div>;
  }

  if (error) {
    return (
      <div className="elk-diagram-error">
        Error calculating diagram layout. Check console for details.
      </div>
    );
  }

  if (!layoutGraph) {
    return <div className="elk-diagram-empty">No diagram data available.</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`elk-diagram-container ${className}`}
      style={containerStyle}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        className="elk-diagram-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Add arrow marker definition for edges */}
        {renderArrowheadMarker()}

        {/* Render all edges */}
        <g className="elk-edges">
          {flattenedEdges(layoutGraph).map((edge) => (
            <EdgeComponent
              key={edge.id}
              edge={edge}
              onClick={onEdgeClick}
              className={`elk-edge-${edge.id}`}
            />
          ))}
        </g>
      </svg>

      {/* Render all nodes */}
      <div className="elk-nodes">
        {layoutGraph.children?.map((node) => renderNodes(node))}
      </div>
    </div>
  );
};
