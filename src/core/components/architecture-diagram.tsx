import React, { useState, useEffect, useCallback, memo } from "react";
import { // Use named import for ReactFlow again
  ReactFlow,
  Background,
  Controls,
  NodeTypes,
  EdgeTypes,
  Node,
  Edge,
  ReactFlowProvider,
  MarkerType,
  PanOnScrollMode,
  Position,
  Handle,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ArchitectureModel, Resource, Relation } from "@/core/lib/parser";
import { Block } from "./block"; // Keep this import

interface ArchitectureDiagramProps {
  model: ArchitectureModel;
  selectedPerspective?: string;
  onNodeSelect?: (nodeId: string) => void;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = memo(({
  model,
  selectedPerspective,
  onNodeSelect,
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeMap, setNodeMap] = useState<Record<string, Node>>({});

  // Define custom node types
  const nodeTypes: NodeTypes = {
    block: Block, // This should now work with the corrected Block component type
  };

  // Define custom edge types - Use standard types for now
  const edgeTypes: EdgeTypes = {
    // No custom edges needed for smoothstep
  };

  // Flatten resources - No changes needed here
  const getAllResources = useCallback(
    (resources: Resource[] | undefined): Resource[] => {
      if (!resources || resources.length === 0) return [];

      return resources.reduce<Resource[]>((acc, resource) => {
        if (resource.children && resource.children.length > 0) {
          return [...acc, resource, ...getAllResources(resource.children)];
        }
        return [...acc, resource];
      }, []);
    },
    []
  );

  // Choose node type - No changes needed here
  const getNodeType = (resource: Resource): string => {
    if (resource.icon?.toLowerCase().includes("gateway")) return "gateway";
    if (resource.icon?.toLowerCase().includes("database")) return "database";
    if (resource.name.toLowerCase().includes("gateway")) return "gateway";
    if (
      resource.name.toLowerCase().includes("database") ||
      resource.name.toLowerCase().includes("sql")
    )
      return "database";
    return "service";
  };

  // Create block layout - Corrected implementation
  const createBlockLayout = useCallback((
    resources: Resource[] | undefined,
    startX = 50,
    startY = 50,
    level = 0
  ): {
    nodes: Node[];
    nodeMap: Record<string, Node>;
    maxY: number;
  } => {
    let allNodes: Node[] = [];
    let newNodeMap: Record<string, Node> = {};
    let currentX = startX;
    let currentY = startY;
    let maxY = startY;

    if (!resources || resources.length === 0) {
      return { nodes: [], nodeMap: {}, maxY: startY };
    }

    const horizontalPadding = 150;
    const verticalPadding = 100;
    const nodeBaseWidth = 200;
    const nodeBaseHeight = 120;
    const nodesPerRow = 4;

    resources.forEach((resource, index) => {
      if (level === 0) {
        currentX = startX + (index % nodesPerRow) * (nodeBaseWidth + horizontalPadding);
        currentY = startY + Math.floor(index / nodesPerRow) * (nodeBaseHeight + verticalPadding);
      } else {
        currentX = startX + index * (nodeBaseWidth + horizontalPadding);
        currentY = startY;
      }

      const resourceId = resource.name;
      const node: Node = {
        id: resourceId,
        type: "block",
        position: { x: currentX, y: currentY },
        data: {
          title: resource.name,
          subtitle: resource.subtitle,
          icon: resource.icon || undefined,
          description: resource.description,
        },
        sourcePosition: Position.Right, // Default source handle
        targetPosition: Position.Left,  // Default target handle
        style: { width: nodeBaseWidth, height: nodeBaseHeight },
        draggable: false,
      };

      allNodes.push(node);
      newNodeMap[resourceId] = node;
      maxY = Math.max(maxY, currentY + nodeBaseHeight);

      // Process children recursively
      const hasChildren = resource.children && resource.children.length > 0; // Define hasChildren here
      if (hasChildren) {
        const childStartY = currentY + nodeBaseHeight + verticalPadding;
        const childResult = createBlockLayout(
          resource.children,
          currentX,
          childStartY,
          level + 1
        );

        allNodes = [...allNodes, ...childResult.nodes];
        newNodeMap = { ...newNodeMap, ...childResult.nodeMap };
        maxY = Math.max(maxY, childResult.maxY);
      }
    });

    return { nodes: allNodes, nodeMap: newNodeMap, maxY };
  }, []); // Add dependency array for useCallback

  // Create edges from relations using smoothstep - Corrected implementation
  const createRelationEdges = useCallback((
    relations: Relation[],
    nodeMap: Record<string, Node>
  ): Edge[] => {
    return relations
      .map((relation, index): Edge | null => { // Add return type annotation
        const sourceNode = nodeMap[relation.from];
        const targetNode = nodeMap[relation.to];

        if (!sourceNode || !targetNode) {
          console.warn(
            `Missing node for relation: ${relation.from} -> ${relation.to}`
          );
          return null;
        }

        // Determine handles based on relative positions
        let sourceHandlePosition: Position = Position.Right;
        let targetHandlePosition: Position = Position.Left;
        const nodeBaseWidth = sourceNode.style?.width as number || 200; // Get width for check

        const dx = targetNode.position.x - sourceNode.position.x;
        const dy = targetNode.position.y - sourceNode.position.y;

        if (Math.abs(dx) > Math.abs(dy)) { // More horizontal than vertical
          if (dx > 0) {
            sourceHandlePosition = Position.Right;
            targetHandlePosition = Position.Left;
          } else {
            sourceHandlePosition = Position.Left;
            targetHandlePosition = Position.Right;
          }
        } else { // More vertical than horizontal
          if (dy > 0) {
            sourceHandlePosition = Position.Bottom;
            targetHandlePosition = Position.Top;
          } else {
            sourceHandlePosition = Position.Top;
            targetHandlePosition = Position.Bottom;
          }
        }

        // Corrected edge object structure
        const edge: Edge = {
          id: `relation-${index}`,
          source: relation.from,
          target: relation.to,
          type: "smoothstep",
          label: relation.label,
          sourceHandle: sourceHandlePosition,
          targetHandle: targetHandlePosition,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          data: {
            description: relation.description,
          },
        };
        return edge;
      })
      .filter((edge): edge is Edge => edge !== null); // Type guard for filtering nulls
  }, []); // Add dependency array for useCallback

  // Update diagram when model or perspective changes
  useEffect(() => {
    if (!model || !model.resources) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { nodes: blockLayoutNodes, nodeMap: newNodeMap } = createBlockLayout(
      model.resources
    );
    setNodeMap(newNodeMap);

    let relationsToUse: Relation[] = [];
    if (selectedPerspective && model.perspectives) {
      const perspective = model.perspectives.find(
        (p) => p.name === selectedPerspective
      );
      if (perspective && perspective.relations) {
        relationsToUse = perspective.relations;
      }
    } else if (
      model.perspectives &&
      model.perspectives.length > 0 &&
      model.perspectives[0] &&
      model.perspectives[0].relations
    ) {
      relationsToUse = model.perspectives[0].relations;
    }

    const diagramEdges = createRelationEdges(relationsToUse, newNodeMap);

    setNodes(blockLayoutNodes);
    setEdges(diagramEdges);
  }, [model, selectedPerspective, createBlockLayout, createRelationEdges]); // Add callbacks to dependencies

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    if (onNodeSelect) {
      onNodeSelect(node.id);
    }
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "100%" }}>
        {/* Ensure ReactFlow component usage is correct */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          fitView
          panOnScroll={true}
          nodesDraggable={false}
          elementsSelectable={false}
          preventScrolling={false}
          panOnScrollMode={PanOnScrollMode.Free}
          panOnDrag={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
});

ArchitectureDiagram.displayName = "ArchitectureDiagram";
