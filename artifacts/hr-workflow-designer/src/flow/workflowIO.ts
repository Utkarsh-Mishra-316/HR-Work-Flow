import type { WorkflowDocument, WorkflowEdge, WorkflowNode } from "./types";

export function serializeWorkflow(
  name: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): WorkflowDocument {
  return {
    version: 1,
    name,
    nodes,
    edges,
  };
}

export function downloadWorkflowJson(doc: WorkflowDocument) {
  const blob = new Blob([JSON.stringify(doc, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = doc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  a.download = `${safeName || "workflow"}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseWorkflowJson(text: string): WorkflowDocument {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid workflow file: not an object");
  }
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error("Invalid workflow file: missing nodes or edges arrays");
  }
  return {
    version: 1,
    name: typeof parsed.name === "string" ? parsed.name : "Untitled Workflow",
    nodes: parsed.nodes as WorkflowNode[],
    edges: parsed.edges as WorkflowEdge[],
  };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("File read failed"));
    reader.readAsText(file);
  });
}
