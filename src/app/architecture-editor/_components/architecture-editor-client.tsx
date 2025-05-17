"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/core/ui/resizable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/ui/select";

import { ArchitectureDiagram } from "@/core/components/architecture-diagram";
import { ElkDiagram } from "@/core/components/elk-diagram";
import { Editor } from "@/core/components/code-editor";
import { parseArchitectureYaml } from "@/core/lib/parser";
import { saveLayout } from "@/core/lib/cookies";
import { useDebounce } from "@/core/hooks/use-debounce";
import { ElkNode, ElkEdge } from "@/core/types/elk-diagram";

export function ArchitectureEditorClient({
  defaultLayout,
  initialYaml = "",
}: Readonly<{
  defaultLayout: number[];
  initialYaml?: string;
}>) {
  const [layout, setLayout] = useState(defaultLayout);
  const debouncedLayout = useDebounce(layout, 3000);
  const [yamlContent, setYamlContent] = useState(initialYaml);
  const debouncedYamlContent = useDebounce(yamlContent, 500); // Debounce YAML parsing
  const [architectureModel, setArchitectureModel] = useState<any>(null);
  const [selectedPerspective, setSelectedPerspective] = useState("");
  const [perspectives, setPerspectives] = useState<string[]>([]);
  const [diagramView, setDiagramView] = useState<"default" | "elk">("elk");

  // Unified function to parse YAML and update model/perspectives
  const updateModelAndPerspectives = useCallback((content: string) => {
    try {
      const model = parseArchitectureYaml(content);
      setArchitectureModel(model);

      if (model && model.perspectives && model.perspectives.length > 0) {
        const perspectiveNames = model.perspectives.map((p: any) => p.name);
        setPerspectives(perspectiveNames);

        setSelectedPerspective((currentSelectedPerspective) => {
          if (
            !currentSelectedPerspective ||
            !perspectiveNames.includes(currentSelectedPerspective)
          ) {
            return perspectiveNames[0] || "";
          }
          return currentSelectedPerspective;
        });
      } else {
        setPerspectives([]);
        setSelectedPerspective("");
      }
    } catch (error) {
      console.error("Failed to parse YAML:", error);
      setArchitectureModel(null);
      setPerspectives([]);
      setSelectedPerspective("");
    }
  }, []); // setArchitectureModel, setPerspectives, setSelectedPerspective are stable

  // Load sample YAML on initial load if no initialYaml was provided
  // Or use initialYaml if provided. Parsing is handled by the debouncedYamlContent effect.
  useEffect(() => {
    if (!initialYaml) {
      fetch("/api/get-sample-dsl")
        .then((response) => response.text())
        .then((text) => {
          setYamlContent(text);
        });
    } else {
      // yamlContent is already initialized with initialYaml via useState
      // The debouncedYamlContent effect will handle the initial parse.
    }
  }, [initialYaml]);

  // Effect to parse YAML when debouncedYamlContent changes
  useEffect(() => {
    // Pass empty string if debouncedYamlContent is null/undefined to handle initial empty state
    updateModelAndPerspectives(debouncedYamlContent || "");
  }, [debouncedYamlContent, updateModelAndPerspectives]);

  // Save layout to cookie when debounced layout changes
  useEffect(() => {
    saveLayout("recall:architecture-editor-layout", debouncedLayout);
  }, [debouncedLayout]);

  // handleYamlChange now only updates yamlContent. Parsing is handled by the debounced effect.
  const handleYamlChange = useCallback(
    (content: string) => {
      setYamlContent(content);
    },
    [] // setYamlContent is stable
  );

  // Only update the layout state, don't save to cookies immediately
  const handleLayoutChange = useCallback((sizes: number[]) => {
    setLayout(sizes);
  }, []);

  // Convert architecture model to ElkJS format
  const elkData = useMemo(() => {
    if (!architectureModel || !selectedPerspective)
      return { nodes: [], edges: [] };

    // Find the selected perspective
    const perspective = architectureModel.perspectives?.find(
      (p: any) => p.name === selectedPerspective
    );

    if (!perspective) return { nodes: [], edges: [] };

    // Process resources into nodes
    const nodes: ElkNode[] = [];
    const idToNodeMap = new Map<string, ElkNode>();
    const processedNodes = new Set<string>();

    // Helper function to process resources recursively
    const processResource = (resource: any, parentId?: string): ElkNode => {
      const nodeId = resource.name.replace(/\s+/g, "_");

      const node: ElkNode = {
        id: nodeId,
        label: resource.name,
        subtitle: resource.subtitle,
        icon: resource.icon,
        width: 180,
        height: resource.children ? 100 : 60,
        children: [],
      };

      idToNodeMap.set(nodeId, node);
      processedNodes.add(nodeId);

      // Process children if any
      if (resource.children && resource.children.length > 0) {
        node.children = resource.children.map((child: any) =>
          processResource(child, nodeId)
        );
      }

      if (!parentId) {
        nodes.push(node);
      }

      return node;
    };

    // Process all resources
    if (architectureModel.resources) {
      architectureModel.resources.forEach((resource: any) => {
        // Ensure processResource is only called for top-level resources if not already processed
        const nodeId = resource.name.replace(/\s+/g, "_");
        if (!processedNodes.has(nodeId)) {
          processResource(resource);
        }
      });
    }

    // Process relations into edges
    const edges: ElkEdge[] = [];
    if (perspective.relations) {
      perspective.relations.forEach((relation: any, index: number) => {
        // Convert names to IDs by replacing spaces with underscores
        const fromId = relation.from.replace(/\s+/g, "_");
        const toId = relation.to?.replace(/\s+/g, "_");

        // Only add edges for nodes that were processed
        if (processedNodes.has(fromId) && processedNodes.has(toId)) {
          edges.push({
            id: `edge_${index}`,
            sources: [fromId],
            targets: [toId],
            label: relation.label || "",
            description: relation.description,
          });
        }
      });
    }

    return { nodes, edges };
  }, [architectureModel, selectedPerspective]);

  const editorView = useMemo(
    () => (
      <div className="h-full w-full">
        <Editor
          height="100%"
          language="yaml"
          value={yamlContent}
          onContentChange={handleYamlChange}
        />
      </div>
    ),
    [yamlContent, handleYamlChange]
  );

  const handleNodeClick = useCallback((node: ElkNode) => {
    console.log("Node clicked:", node.label);
  }, []);

  const handleEdgeClick = useCallback((edge: ElkEdge) => {
    console.log("Edge clicked:", edge.label);
  }, []);

  const elkLayoutOptions = useMemo(
    () => ({
      "elk.algorithm": "layered",
      "elk.direction": "CENTER",
      "elk.layered.spacing.nodeNodeBetweenLayers": "100",
      "elk.spacing.nodeNode": "50",
    }),
    []
  );

  const diagramPanelContent = useMemo(
    () => (
      <div className="h-full w-full bg-card/80 dark:bg-card/40 p-4">
        {diagramView === "default" && architectureModel && (
          <ArchitectureDiagram
            model={architectureModel}
            selectedPerspective={selectedPerspective}
          />
        )}
        {diagramView === "elk" && architectureModel && (
          <ElkDiagram
            nodes={elkData.nodes}
            edges={elkData.edges}
            layoutOptions={elkLayoutOptions}
            height="100%"
            width="100%"
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
          />
        )}
      </div>
    ),
    [
      diagramView,
      architectureModel,
      selectedPerspective,
      elkData,
      handleNodeClick,
      handleEdgeClick,
      elkLayoutOptions,
    ]
  );

  return (
    <div className="h-screen flex flex-col">
      <div
        className="bg-muted/10 text-foreground p-3 flex justify-between shadow-sm
        items-center border-b border-b-border"
      >
        <h1 className="text-xl font-bold">Architecture Diagram Editor</h1>

        <div className="flex space-x-4 items-center">
          <div>
            <label htmlFor="perspective" className="mr-2">
              Perspective:
            </label>
            <Select
              value={selectedPerspective}
              onValueChange={setSelectedPerspective}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a perspective" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {perspectives.map((perspective) => (
                    <SelectItem key={perspective} value={perspective}>
                      {perspective}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <label htmlFor="diagramType" className="mr-2">
              Layout:
            </label>
            <div className="flex bg-muted/30 rounded">
              <button
                className={`px-3 py-1 ${
                  diagramView === "elk"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setDiagramView("elk")}
              >
                elkjs
              </button>
            </div>
          </div>

          <button className="bg-accent text-accent-foreground px-3 py-1 rounded hover:bg-accent/90 transition-colors">
            Export
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full"
          onLayout={handleLayoutChange}
          autoSaveId="recall:architecture-editor-layout"
        >
          <ResizablePanel defaultSize={layout[0]} minSize={20}>
            {editorView}
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={layout[1]} minSize={30}>
            {diagramPanelContent}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
