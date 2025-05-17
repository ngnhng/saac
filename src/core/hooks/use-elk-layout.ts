import { useEffect, useState } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import {
  ElkGraph,
  ElkNode,
  ElkEdge,
  ElkLayoutOptions,
} from "../types/elk-diagram";

// Prepare data for ELK layout engine
const prepareElkGraph = (
  nodes: ElkNode[],
  edges: ElkEdge[],
  rootId: string = "root"
): any => {
  return {
    id: rootId,
    children: nodes.map((node) => ({
      ...node,
      // Ensure minimum dimensions for nodes without specified width/height
      width: node.width ?? 150,
      height: node.height ?? 50,
      // Recursively prepare children if they exist
      children: node.children
        ? node.children.map((child) => ({
            ...child,
            width: child.width ?? 120,
            height: child.height ?? 40,
          }))
        : undefined,
    })),
    edges: edges.map((edge) => ({
      ...edge,
      // Ensure each edge has a unique ID
      id: edge.id || `${edge.sources[0]}-${edge.targets[0]}`,
    })),
  };
};

const defaultLayoutOptions: ElkLayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.spacing.nodeNodeBetweenLayers": "80",
  "elk.spacing.nodeNode": "50",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
};

/**
 * Hook to calculate layout for hierarchical directed graphs using ElkJS
 *
 * @param nodes Array of nodes to be included in the layout
 * @param edges Array of edges defining connections between nodes
 * @param options Layout options to customize the algorithm's behavior
 * @param deps Additional dependencies to trigger layout recalculation
 * @returns The calculated layout with positioned nodes and edge routes
 */
export const useElkLayout = (
  nodes: ElkNode[],
  edges: ElkEdge[],
  options: ElkLayoutOptions = {},
  deps: any[] = []
): { layoutGraph: ElkGraph | null; loading: boolean; error: Error | null } => {
  const [layoutGraph, setLayoutGraph] = useState<ElkGraph | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const calculateLayout = async () => {
      try {
        setLoading(true);
        setError(null);

        const elk = new ELK();
        const graph = prepareElkGraph(nodes, edges);

        // Merge default options with custom options
        const layoutOptions = { ...defaultLayoutOptions, ...options };

        // Perform layout calculation
        const calculatedLayout = await elk.layout(graph, {
          layoutOptions,
          logging: true,
        });

        // Convert the ELK layout result to our ElkGraph type
        setLayoutGraph(calculatedLayout as unknown as ElkGraph);
        setLoading(false);
      } catch (err) {
        console.error("Error calculating ElkJS layout:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    calculateLayout();
  }, [nodes, edges, options, ...deps]);

  return { layoutGraph, loading, error };
};
