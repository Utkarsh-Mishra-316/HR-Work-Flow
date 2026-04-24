import type { Edge, Node } from "@xyflow/react";

export type NodeKind =
  | "start"
  | "approval"
  | "documentVerification"
  | "decision"
  | "notification"
  | "end";

export type ApproverRole = "Manager" | "HR" | "Director" | "Team Lead";
export type NotificationChannel = "Email" | "Slack" | "SMS";
export type EndOutcome = "Success" | "Rejected" | "Cancelled";

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
}

export interface StartNodeData extends BaseNodeData {}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole: ApproverRole;
  slaHours: number;
}

export interface DocumentVerificationNodeData extends BaseNodeData {
  documents: string[];
  required: boolean;
}

export interface DecisionNodeData extends BaseNodeData {
  condition: string;
}

export interface NotificationNodeData extends BaseNodeData {
  channel: NotificationChannel;
  recipient: string;
  message: string;
}

export interface EndNodeData extends BaseNodeData {
  outcome: EndOutcome;
}

export type WorkflowNodeData =
  | StartNodeData
  | ApprovalNodeData
  | DocumentVerificationNodeData
  | DecisionNodeData
  | NotificationNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData, NodeKind>;
export type WorkflowEdge = Edge;

export interface WorkflowDocument {
  version: 1;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface SimulationLogEntry {
  id: string;
  nodeId: string;
  nodeKind: NodeKind;
  label: string;
  message: string;
  timestamp: number;
  status: "running" | "complete" | "branch" | "error";
}
