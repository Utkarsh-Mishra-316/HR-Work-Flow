import { useCallback, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type ReactFlowInstance,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useWorkflowStore } from "./useWorkflowStore";
import { nodeTypes } from "@/components/nodes/nodeTypes";
import { getPaletteItem } from "@/components/nodes/nodePalette";
import type { NodeKind } from "./types";

function CanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const addNode = useWorkflowStore((s) => s.addNode);
  const activeNodeId = useWorkflowStore((s) => s.activeNodeId);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData("application/hrwf-node-kind") as NodeKind;
      if (!kind) return;
      const item = getPaletteItem(kind);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNode(kind, position, { ...item.defaults });
    },
    [screenToFlowPosition, addNode],
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const styledEdges = edges.map((e) => {
    const isActive =
      isSimulating &&
      activeNodeId !== null &&
      (e.source === activeNodeId || e.target === activeNodeId);
    return {
      ...e,
      className: isActive ? "simulating" : undefined,
    } as Edge;
  });

  return (
    <div ref={reactFlowWrapper} className="h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
        }}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
        defaultEdgeOptions={{ type: "smoothstep" }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.4} />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-left"
          pannable
          zoomable
          nodeColor={(n) => {
            switch (n.type) {
              case "start":
                return "hsl(184 60% 38%)";
              case "approval":
                return "hsl(260 50% 55%)";
              case "documentVerification":
                return "hsl(184 60% 38%)";
              case "decision":
                return "hsl(28 80% 55%)";
              case "notification":
                return "hsl(28 80% 55%)";
              case "end":
                return "hsl(142 55% 42%)";
              default:
                return "hsl(200 12% 50%)";
            }
          }}
          nodeStrokeWidth={2}
          maskColor="hsl(200 30% 12% / 0.04)"
        />
      </ReactFlow>
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
