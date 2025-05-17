Develop a Next.js React component that integrates the ElkJS layout engine for system diagramming. The primary goal is to create a modular, customizable diagramming tool that supports a directed, hierarchical layout. This tool should address both the visualization of simple systems and more complex diagrams where nodes may contain nested sub-nodes.

**Key Requirements and Considerations:**

1. **Diagram Structure and Layout:**

   - **Directed, Layered Diagram:**
     - Implement a Hierarchical Layout Algorithm tailored for directed graphs.
     - Position “client” nodes on the left-most side (or as the top layer when using vertical layering), with internal servers or dependent systems placed progressively further in subsequent layers based on their dependency paths.
   - **Hierarchical Layout Algorithm Features:**
     - _Assign Layers/Ranks:_
       - Nodes with no incoming edges (e.g., client systems) are assigned to the first layer.
       - Subsequent nodes are placed in later layers according to their dependencies.
     - _Minimize Edge Crossings:_
       - Optimize the ordering within each layer to reduce overlapping or crossing edges, thereby improving diagram readability.
     - _Determine X/Y Coordinates:_
       - After layer assignment, calculate the final positioning for each node ensuring adequate spacing and alignment within the diagram.

2. **Node and Edge Customization:**

   - **Simple, Flexible Components:**
     - Develop basic node and edge components in React that can be easily customized or extended.
     - Ensure nodes support nesting so that a node can host one or more child nodes. This is crucial for representing hierarchical or compound systems in more detail.
   - **Customization Considerations:**
     - Allow styling and behavior adjustments through props and/or context.
     - Ensure the system diagram supports edge customization (e.g., different colors, thickness, or labels) to distinguish various types of relationships.

3. **Integration with Next.js and React:**

   - **Component Design:**
     - Architect the solution as a reusable React component within a Next.js application.
     - Emphasize clean code separation, including the integration of ElkJS for layout calculations and the rendering of nodes/edges.
   - **Performance and Data Handling:**
     - Consider performance optimizations for larger diagrams.
     - Decide on state management solutions (e.g., React context, Redux, or local component state) for dynamic updates and interactions with the diagram.

4. **Development and Testing Approach:**

   - Outline a development plan that begins with building and testing a minimal viable product (MVP) for the layout engine, followed by iterative enhancements.
   - Include testing strategies for both automated unit tests (to verify layout algorithm behavior) and manual UI testing (to ensure the diagrams render correctly and meet usability expectations).

5. **Documentation and Further Customization:**
   - Document the design decisions and provide examples of how to extend the basic node/edge components.
   - Explain how users can incorporate additional features (such as drag-and-drop or real-time updates) into the diagramming tool once the core layout is stable.

**Summary:**

Your task is to design a scalable and modular system diagramming solution using ElkJS within a Next.js React environment. The solution should leverage a hierarchical layout algorithm to generate directed, layered diagrams with a focus on minimizing edge crossings and ensuring a clear, organized visualization. Furthermore, the implementation must be designed with customization in mind, particularly to support nested nodes and easily stylable edges, making it adaptable for various system diagramming scenarios.
