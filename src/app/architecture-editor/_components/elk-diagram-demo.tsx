import React, { useState } from "react";
import { ElkDiagram } from "@/core/components/elk-diagram";
import { ElkNode, ElkEdge, ElkLayoutOptions } from "@/core/types/elk-diagram";

/**
 * Demo component to showcase the ElkDiagram capabilities
 *
 * This component demonstrates a hierarchical system diagram with:
 * - Multiple node types (clients, servers, databases)
 * - Nested nodes to represent subsystems
 * - Directed edges with labels
 * - Customizable layout options
 */
export const ElkDiagramDemo = () => {
  // Sample nodes for the diagram
  const [nodes, setNodes] = useState<ElkNode[]>([
    {
      id: "client",
      label: "Client Application",
      subtitle: "User Interface",
      width: 180,
      height: 80,
      icon: "/globe.svg",
    },
    // {
    //   id: "api_gateway",
    //   label: "API Gateway",
    //   subtitle: "Request Routing",
    //   width: 160,
    //   height: 70,
    //   icon: "/window.svg",
    // },
    // {
    //   id: "services",
    //   label: "Microservices",
    //   subtitle: "Business Logic",
    //   width: 160,
    //   height: 120,
    //   children: [
    //     {
    //       id: "auth_service",
    //       label: "Auth Service",
    //       width: 120,
    //       height: 50,
    //     },
    //     {
    //       id: "user_service",
    //       label: "User Service",
    //       width: 120,
    //       height: 50,
    //     },
    //   ],
    // },
    // {
    //   id: "database",
    //   label: "Database",
    //   subtitle: "Data Storage",
    //   width: 140,
    //   height: 70,
    //   icon: "/file.svg",
    // },
  ]);

  // Sample edges for the diagram
  const [edges, setEdges] = useState<ElkEdge[]>([
    // {
    //   id: "client_to_gateway",
    //   sources: ["client"],
    //   targets: ["api_gateway"],
    //   label: "REST API requests",
    // },
    // {
    //   id: "gateway_to_auth",
    //   sources: ["api_gateway"],
    //   targets: ["auth_service"],
    //   label: "Auth requests",
    // },
    // {
    //   id: "gateway_to_user",
    //   sources: ["api_gateway"],
    //   targets: ["user_service"],
    //   label: "User data requests",
    // },
    // {
    //   id: "auth_to_db",
    //   sources: ["auth_service"],
    //   targets: ["database"],
    //   label: "Verify credentials",
    // },
    // {
    //   id: "user_to_db",
    //   sources: ["user_service"],
    //   targets: ["database"],
    //   label: "Query user data",
    // },
  ]);

  // Layout options for ElkJS
  const layoutOptions: ElkLayoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.layered.spacing.nodeNodeBetweenLayers": "100",
    "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  };

  // Handle node click events
  const handleNodeClick = (node: ElkNode) => {
    console.log("Node clicked:", node);
  };

  // Handle edge click events
  const handleEdgeClick = (edge: ElkEdge) => {
    console.log("Edge clicked:", edge);
  };

  return (
    <div
      className="elk-diagram-demo w-full h-[600px] border border-border"
    >
      <h2
        className="p-4 m-0 border-b border-muted text-foreground"
      >
        System Architecture Diagram
      </h2>

      <div className="h-[calc(100%-60px)]">
        <ElkDiagram
          nodes={nodes}
          edges={edges}
          layoutOptions={layoutOptions}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
        />
      </div>
    </div>
  );
};

export default ElkDiagramDemo;
