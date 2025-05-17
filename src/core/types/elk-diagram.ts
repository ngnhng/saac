// Types for ElkJS diagram components
export interface ElkNode {
  id: string;
  label?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  children?: ElkNode[];
  ports?: ElkPort[];
  // Additional properties for styling and metadata
  subtitle?: string;
  description?: string;
  icon?: string;
  data?: Record<string, any>;
}

export interface ElkPort {
  id: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface ElkEdge {
  id: string;
  sources: string[];
  targets: string[];
  sections?: ElkEdgeSection[];
  // Additional properties for styling and metadata
  label?: string;
  description?: string;
  type?: string;
  data?: Record<string, any>;
}

export interface ElkEdgeSection {
  id?: string;
  startPoint: ElkPoint;
  endPoint: ElkPoint;
  bendPoints?: ElkPoint[];
}

export interface ElkPoint {
  x: number;
  y: number;
}

export interface ElkGraph {
  id: string;
  children: ElkNode[];
  edges: ElkEdge[];
  width?: number; // Total width of the graph layout
  height?: number; // Total height of the graph layout
  x?: number; // X-coordinate in parent
  y?: number; // Y-coordinate in parent
}

// Options for ElkJS layout algorithm
export interface ElkLayoutOptions {
  algorithm?: string;
  direction?: "RIGHT" | "LEFT" | "DOWN" | "UP";
  aspectRatio?: number;
  spacing?: number;
  nodeNodeBetweenLayers?: number;
  nodeLayerSpacingFactor?: number;
  edgeEdgeSpacingFactor?: number;
  nodePlacement?: "BRANDES_KOEPF" | "NETWORK_SIMPLEX" | "SIMPLE";
  [key: string]: any;
}

// Props for the ElkDiagram component
export interface ElkDiagramProps {
  nodes: ElkNode[];
  edges: ElkEdge[];
  layoutOptions?: ElkLayoutOptions;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  nodeComponent?: React.ComponentType<ElkNodeComponentProps>;
  edgeComponent?: React.ComponentType<ElkEdgeComponentProps>;
  onNodeClick?: (node: ElkNode, event: React.MouseEvent) => void;
  onEdgeClick?: (edge: ElkEdge, event: React.MouseEvent) => void;
}

// Props for the ElkNode component
export interface ElkNodeComponentProps {
  node: ElkNode;
  onClick?: (node: ElkNode, event: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Props for the ElkEdge component
export interface ElkEdgeComponentProps {
  edge: ElkEdge;
  onClick?: (edge: ElkEdge, event: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}
