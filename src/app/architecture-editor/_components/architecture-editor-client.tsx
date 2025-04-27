"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/core/ui/resizable";

import { ArchitectureDiagram } from "@/core/components/architecture-diagram";
import { Editor } from "@/core/components/code-editor";
import { parseArchitectureYaml } from "@/core/lib/parser";
import { saveLayout } from "@/core/lib/cookies";
import { useDebounce } from "@/core/hooks/use-debounce";

export function ArchitectureEditorClient({
  defaultLayout,
  initialYaml = "",
}: Readonly<{
  defaultLayout: number[];
  initialYaml?: string;
}>) {
  const [layout, setLayout] = useState(defaultLayout);
  // Debounce the layout changes to prevent excessive cookie writes
  const debouncedLayout = useDebounce(layout, 3000);
  const [yamlContent, setYamlContent] = useState(initialYaml);
  const [architectureModel, setArchitectureModel] = useState<any>(null);
  const [selectedPerspective, setSelectedPerspective] = useState("");
  const [perspectives, setPerspectives] = useState<string[]>([]);

  // Load sample YAML on initial load if no initialYaml was provided
  useEffect(() => {
    if (!initialYaml) {
      fetch("/api/get-sample-dsl")
        .then((response) => response.text())
        .then((text) => {
          setYamlContent(text);
          parseYamlContent(text);
        });
    } else {
      parseYamlContent(initialYaml);
    }
  }, [initialYaml]);

  // Save layout to cookie when debounced layout changes
  useEffect(() => {
    saveLayout("recall:architecture-editor-layout", debouncedLayout);
  }, [debouncedLayout]);

  const parseYamlContent = (content: string) => {
    try {
      const model = parseArchitectureYaml(content);
      setArchitectureModel(model);

      // Extract perspective names
      if (model.perspectives && model.perspectives.length > 0) {
        const perspectiveNames = model.perspectives.map((p: any) => p.name);
        setPerspectives(perspectiveNames);
        setSelectedPerspective(perspectiveNames[0]);
      }
    } catch (error) {
      console.error("Failed to parse YAML:", error);
    }
  };

  const handleYamlChange = (content: string) => {
    setYamlContent(content);
    try {
      const model = parseArchitectureYaml(content);
      setArchitectureModel(model);

      // Update perspectives list
      if (model.perspectives && model.perspectives.length > 0) {
        const perspectiveNames = model.perspectives.map((p: any) => p.name);
        setPerspectives(perspectiveNames);

        // Select first perspective if current selection not available
        if (!perspectiveNames.includes(selectedPerspective)) {
          setSelectedPerspective(perspectiveNames[0]);
        }
      } else {
        setPerspectives([]);
        setSelectedPerspective("");
      }
    } catch (error) {
      console.error("Failed to parse YAML:", error);
    }
  };

  // Only update the layout state, don't save to cookies immediately
  const handleLayoutChange = useCallback((sizes: number[]) => {
    setLayout(sizes);
  }, []);

  const EditorPanel = () => (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language="yaml"
        value={yamlContent}
        onContentChange={handleYamlChange}
      />
    </div>
  );

  const DiagramPanel = () => (
    <div className="h-full w-full">
      {architectureModel && (
        <ArchitectureDiagram
          model={architectureModel}
          selectedPerspective={selectedPerspective}
        />
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-3 flex justify-between">
        <h1 className="text-xl font-bold">Architecture Diagram Editor</h1>

        <div className="flex space-x-4">
          <div>
            <label htmlFor="perspective" className="mr-2">
              Perspective:
            </label>
            <select
              id="perspective"
              className="bg-gray-700 text-white p-1 rounded"
              value={selectedPerspective}
              onChange={(e) => setSelectedPerspective(e.target.value)}
            >
              {perspectives.map((perspective) => (
                <option key={perspective} value={perspective}>
                  {perspective}
                </option>
              ))}
            </select>
          </div>

          <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
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
            <EditorPanel />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={layout[1]} minSize={30}>
            <DiagramPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
