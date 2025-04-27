import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

// Define the props expected within the node's data object
// Add index signature to satisfy NodeProps constraint
interface BlockData {
  title: string;
  subtitle?: string;
  icon?: string;
  description?: string;
  [key: string]: any; // Index signature
}

// Explicitly type the props passed to the functional component
interface BlockComponentProps extends NodeProps {
  data: BlockData;
}

// Use the explicit props type and access data directly
export const Block: React.FC<BlockComponentProps> = memo(({ data }) => {
  const { title, subtitle, icon } = data; // Destructure data

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        width: 200,
        height: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Handles remain the same */}
      <Handle type="target" position={Position.Top} style={{ background: "#555" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "#555" }} />
      <Handle type="target" position={Position.Left} style={{ background: "#555" }} />
      <Handle type="source" position={Position.Right} style={{ background: "#555" }} />

      {icon && (
        <img
          src={icon}
          alt={`${title} icon`}
          style={{ width: 30, height: 30, marginBottom: 8 }}
          onError={(e) => (e.currentTarget.style.display = "none")} // Hide if icon fails to load
        />
      )}
      <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: 4 }}>
        {title ?? "Untitled"} {/* Use nullish coalescing for default */}
      </div>
      {subtitle && (
        <div style={{ fontSize: "12px", color: "#666" }}>{subtitle}</div>
      )}
    </div>
  );
});

Block.displayName = "BlockNode";
