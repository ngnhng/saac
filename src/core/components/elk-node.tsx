import React, { useState, useRef } from "react";
import { ElkNodeComponentProps } from "../types/elk-diagram";
import { animate } from "animejs";
/**
 * ElkNode component renders a single node in the diagram
 *
 * This component handles the visual representation of nodes including:
 * - Basic styling and positioning
 * - Display of node label, subtitle, and icon
 * - Handling click events with expansion animation using anime.js
 * - Rendering of nested child nodes
 */
export const ElkNode: React.FC<ElkNodeComponentProps> = ({
  node,
  onClick,
  children,
  className = "",
  style = {},
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Define base and expanded dimensions
  const baseWidth = node.width || 150;
  const baseHeight = node.height || 50;
  const expandedWidth = baseWidth * 1.5;
  const expandedHeight = baseHeight * 1.2;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Toggle expanded state
    const targetExpandedState = !isExpanded;
    setIsExpanded(targetExpandedState);

    // Use anime.js to animate the expansion/collapse
    if (nodeRef.current) {
      animate(".elk-node", {
        width: targetExpandedState ? expandedWidth : baseWidth,
        height: targetExpandedState ? expandedHeight : baseHeight,
        duration: 300,
        easing: "easeOutElastic(1, .5)",
        complete: function () {
          // Optional callback after animation completes
        },
      });
    }

    // Call the original onClick handler if provided
    if (onClick) onClick(node, e);
  };

  // Base styles for the node combined with Tailwind classes
  const nodeStyle: React.CSSProperties = {
    position: "absolute",
    left: node.x || 0,
    top: node.y || 0,
    width: baseWidth,
    height: baseHeight,
    padding: "8px",
    ...style,
  };

  return (
    <div
      ref={nodeRef}
      className={`elk-node rounded bg-card border border-border flex flex-col justify-center overflow-hidden select-none shadow-sm cursor-pointer ${className}`}
      style={nodeStyle}
      onClick={handleClick}
      data-node-id={node.id}
    >
      <div className="elk-node-content">
        {/* Icon if available */}
        {node.icon && (
          <div className="elk-node-icon mb-1">
            <img
              src={node.icon}
              alt=""
              className="w-4 h-4"
            />
          </div>
        )}

        {/* Node label */}
        <div
          className="elk-node-label font-bold text-sm text-foreground"
        >
          {node.label || node.id}
        </div>

        {/* Node subtitle if available */}
        {node.subtitle && (
          <div
            className="elk-node-subtitle text-xs text-muted-foreground"
          >
            {node.subtitle}
          </div>
        )}
      </div>

      {/* Render children (which could be nested nodes or other content) */}
      {children}
    </div>
  );
};
