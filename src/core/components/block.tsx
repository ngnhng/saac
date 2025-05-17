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
      className="bg-card border border-border rounded-lg p-4 w-[200px] h-[120px] flex flex-col justify-center items-center text-center shadow-sm"
    >
      {/* Handles remain the same */}
      <Handle type="target" position={Position.Top} style={{ background: "var(--color-border)" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "var(--color-border)" }} />
      <Handle type="target" position={Position.Left} style={{ background: "var(--color-border)" }} />
      <Handle type="source" position={Position.Right} style={{ background: "var(--color-border)" }} />

      {icon && (
        <img
          src={icon}
          alt={`${title} icon`}
          className="w-[30px] h-[30px] mb-2"
          onError={(e) => (e.currentTarget.style.display = "none")} // Hide if icon fails to load
        />
      )}
      <div className="font-bold text-sm mb-1 text-foreground">
        {title ?? "Untitled"} {/* Use nullish coalescing for default */}
      </div>
      {subtitle && (
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      )}
    </div>
  );
});

Block.displayName = "BlockNode";
