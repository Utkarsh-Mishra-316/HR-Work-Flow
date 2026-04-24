import type {
  ApprovalNodeData,
  DecisionNodeData,
  DocumentVerificationNodeData,
  EndNodeData,
  NotificationNodeData,
  SimulationLogEntry,
  WorkflowEdge,
  WorkflowNode,
} from "./types";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const id = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

interface SimulationCallbacks {
  onActiveNode: (nodeId: string | null) => void;
  onLog: (entry: SimulationLogEntry) => void;
  shouldStop: () => boolean;
}

const STEP_DELAY = 800;

function findStartNode(nodes: WorkflowNode[]): WorkflowNode | undefined {
  return nodes.find((n) => n.type === "start");
}

function findOutgoing(edges: WorkflowEdge[], nodeId: string, sourceHandle?: string): WorkflowEdge[] {
  return edges.filter(
    (e) =>
      e.source === nodeId &&
      (sourceHandle === undefined || (e.sourceHandle ?? null) === (sourceHandle ?? null)),
  );
}

function nodeById(nodes: WorkflowNode[], id: string | undefined): WorkflowNode | undefined {
  if (!id) return undefined;
  return nodes.find((n) => n.id === id);
}

export async function runSimulation(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  cb: SimulationCallbacks,
): Promise<void> {
  const start = findStartNode(nodes);
  if (!start) {
    cb.onLog({
      id: id(),
      nodeId: "",
      nodeKind: "start",
      label: "No Start Node",
      message: "Add a Start node to run the simulation.",
      timestamp: Date.now(),
      status: "error",
    });
    return;
  }

  const visited = new Set<string>();
  let current: WorkflowNode | undefined = start;
  let nextHandle: string | undefined;

  while (current && !cb.shouldStop()) {
    if (visited.has(current.id)) {
      cb.onLog({
        id: id(),
        nodeId: current.id,
        nodeKind: current.type as SimulationLogEntry["nodeKind"],
        label: String(current.data.label ?? "Loop"),
        message: "Loop detected — stopping to avoid infinite traversal.",
        timestamp: Date.now(),
        status: "error",
      });
      break;
    }
    visited.add(current.id);
    cb.onActiveNode(current.id);

    const node = current;
    const baseLog = {
      id: id(),
      nodeId: node.id,
      nodeKind: node.type as SimulationLogEntry["nodeKind"],
      label: String(node.data.label ?? ""),
      timestamp: Date.now(),
    };

    switch (node.type) {
      case "start": {
        cb.onLog({ ...baseLog, message: "Workflow started.", status: "complete" });
        nextHandle = undefined;
        break;
      }
      case "documentVerification": {
        const data = node.data as DocumentVerificationNodeData;
        cb.onLog({
          ...baseLog,
          message: `Verifying ${data.documents.length} document(s): ${data.documents.join(", ") || "none"}.`,
          status: "running",
        });
        await sleep(STEP_DELAY);
        if (cb.shouldStop()) break;
        cb.onLog({
          ...baseLog,
          id: id(),
          message: data.required
            ? "All required documents verified."
            : "Documents verified (optional step).",
          status: "complete",
        });
        nextHandle = undefined;
        break;
      }
      case "approval": {
        const data = node.data as ApprovalNodeData;
        cb.onLog({
          ...baseLog,
          message: `Awaiting approval from ${data.approverRole} (SLA ${data.slaHours}h).`,
          status: "running",
        });
        await sleep(STEP_DELAY);
        if (cb.shouldStop()) break;
        cb.onLog({
          ...baseLog,
          id: id(),
          message: `Approved by ${data.approverRole}.`,
          status: "complete",
        });
        nextHandle = undefined;
        break;
      }
      case "decision": {
        const data = node.data as DecisionNodeData;
        const branch = Math.random() < 0.75 ? "approve" : "reject";
        cb.onLog({
          ...baseLog,
          message: `Evaluating condition: ${data.condition || "(none)"}.`,
          status: "running",
        });
        await sleep(STEP_DELAY);
        if (cb.shouldStop()) break;
        cb.onLog({
          ...baseLog,
          id: id(),
          message:
            branch === "approve"
              ? "Decision: branch taken → Approve."
              : "Decision: branch taken → Reject.",
          status: "branch",
        });
        nextHandle = branch;
        break;
      }
      case "notification": {
        const data = node.data as NotificationNodeData;
        cb.onLog({
          ...baseLog,
          message: `Sending ${data.channel} to ${data.recipient || "(no recipient)"}: "${data.message}"`,
          status: "running",
        });
        await sleep(STEP_DELAY);
        if (cb.shouldStop()) break;
        cb.onLog({
          ...baseLog,
          id: id(),
          message: `${data.channel} delivered.`,
          status: "complete",
        });
        nextHandle = undefined;
        break;
      }
      case "end": {
        const data = node.data as EndNodeData;
        cb.onLog({
          ...baseLog,
          message: `Workflow ended — outcome: ${data.outcome}.`,
          status: "complete",
        });
        cb.onActiveNode(null);
        return;
      }
      default: {
        cb.onLog({
          ...baseLog,
          message: `Unknown node type "${String(node.type)}" — skipping.`,
          status: "error",
        });
        nextHandle = undefined;
      }
    }

    if (cb.shouldStop()) break;

    const outgoing = findOutgoing(edges, node.id, nextHandle);
    if (outgoing.length === 0) {
      cb.onLog({
        id: id(),
        nodeId: node.id,
        nodeKind: node.type as SimulationLogEntry["nodeKind"],
        label: String(node.data.label ?? ""),
        message: "No outgoing connection — workflow halted.",
        timestamp: Date.now(),
        status: "error",
      });
      break;
    }

    const next = nodeById(nodes, outgoing[0]?.target);
    if (!next) {
      cb.onLog({
        id: id(),
        nodeId: node.id,
        nodeKind: node.type as SimulationLogEntry["nodeKind"],
        label: String(node.data.label ?? ""),
        message: "Outgoing edge points to a missing node.",
        timestamp: Date.now(),
        status: "error",
      });
      break;
    }
    current = next;
  }

  cb.onActiveNode(null);
}
