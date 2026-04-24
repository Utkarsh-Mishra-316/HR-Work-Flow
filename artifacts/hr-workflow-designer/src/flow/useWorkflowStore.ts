import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import type {
  NodeKind,
  SimulationLogEntry,
  WorkflowDocument,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
} from "./types";
import { onboardingExample } from "./exampleWorkflow";

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  activeNodeId: string | null;
  isSimulating: boolean;
  simulationLog: SimulationLogEntry[];
  workflowName: string;

  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  addNode: (kind: NodeKind, position: { x: number; y: number }, defaults: WorkflowNodeData) => void;
  deleteNode: (id: string) => void;

  loadWorkflow: (doc: WorkflowDocument) => void;
  clearWorkflow: () => void;
  setWorkflowName: (name: string) => void;

  setActiveNode: (id: string | null) => void;
  setIsSimulating: (v: boolean) => void;
  appendLog: (entry: SimulationLogEntry) => void;
  clearLog: () => void;
}

const colorForBranch = (handleId: string | undefined) => {
  if (handleId === "approve") return "hsl(142 55% 42%)";
  if (handleId === "reject") return "hsl(0 72% 50%)";
  return undefined;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: onboardingExample.nodes,
  edges: onboardingExample.edges,
  selectedNodeId: null,
  activeNodeId: null,
  isSimulating: false,
  simulationLog: [],
  workflowName: onboardingExample.name,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[] }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) => {
    const branchColor = colorForBranch(connection.sourceHandle ?? undefined);
    const label =
      connection.sourceHandle === "approve"
        ? "Approve"
        : connection.sourceHandle === "reject"
          ? "Reject"
          : undefined;
    const newEdge: WorkflowEdge = {
      ...connection,
      id: `e-${connection.source}-${connection.target}-${connection.sourceHandle ?? "default"}-${Date.now().toString(36)}`,
      type: "smoothstep",
      ...(label
        ? {
            label,
            style: { stroke: branchColor, strokeWidth: 2 },
            labelStyle: { fill: branchColor, fontWeight: 600, fontSize: 11 },
            labelBgStyle: { fill: "hsl(38 30% 97%)" },
          }
        : {}),
    } as WorkflowEdge;
    set({ edges: addEdge(newEdge, get().edges) });
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, data) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? ({ ...n, data: { ...n.data, ...data } } as WorkflowNode) : n,
      ),
    }),

  addNode: (kind, position, defaults) => {
    const id = `${kind}-${
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).slice(2, 10)
    }`;
    const newNode = {
      id,
      type: kind,
      position,
      data: { ...defaults },
    } as WorkflowNode;
    set({ nodes: [...get().nodes, newNode], selectedNodeId: id });
  },

  deleteNode: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    }),

  loadWorkflow: (doc) =>
    set({
      nodes: doc.nodes,
      edges: doc.edges,
      workflowName: doc.name,
      selectedNodeId: null,
      activeNodeId: null,
      simulationLog: [],
    }),

  clearWorkflow: () =>
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      activeNodeId: null,
      simulationLog: [],
    }),

  setWorkflowName: (name) => set({ workflowName: name }),

  setActiveNode: (id) => set({ activeNodeId: id }),
  setIsSimulating: (v) => set({ isSimulating: v }),
  appendLog: (entry) => set({ simulationLog: [...get().simulationLog, entry] }),
  clearLog: () => set({ simulationLog: [] }),
}));
