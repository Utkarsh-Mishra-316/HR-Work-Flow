import type { WorkflowDocument } from "./types";

export const onboardingExample: WorkflowDocument = {
  version: 1,
  name: "Employee Onboarding",
  nodes: [
    {
      id: "start-1",
      type: "start",
      position: { x: 40, y: 240 },
      data: { label: "New Hire Accepted" },
    },
    {
      id: "doc-1",
      type: "documentVerification",
      position: { x: 280, y: 220 },
      data: {
        label: "Verify Onboarding Documents",
        documents: ["ID", "Tax Form", "NDA"],
        required: true,
      },
    },
    {
      id: "approval-1",
      type: "approval",
      position: { x: 580, y: 220 },
      data: {
        label: "Manager Sign-off",
        approverRole: "Manager",
        slaHours: 24,
      },
    },
    {
      id: "decision-1",
      type: "decision",
      position: { x: 880, y: 220 },
      data: {
        label: "All Checks Passed?",
        condition: "documents.verified && approval.granted",
      },
    },
    {
      id: "notify-success",
      type: "notification",
      position: { x: 1180, y: 80 },
      data: {
        label: "Welcome Email",
        channel: "Email",
        recipient: "new.hire@company.com",
        message: "Welcome aboard! Your first day is set.",
      },
    },
    {
      id: "end-success",
      type: "end",
      position: { x: 1480, y: 80 },
      data: {
        label: "Onboarded",
        outcome: "Success",
      },
    },
    {
      id: "notify-blocked",
      type: "notification",
      position: { x: 1180, y: 380 },
      data: {
        label: "Notify HR",
        channel: "Slack",
        recipient: "#hr-ops",
        message: "Onboarding blocked — please follow up.",
      },
    },
    {
      id: "end-blocked",
      type: "end",
      position: { x: 1480, y: 380 },
      data: {
        label: "Blocked",
        outcome: "Rejected",
      },
    },
  ],
  edges: [
    { id: "e-start-doc", source: "start-1", target: "doc-1", type: "smoothstep" },
    { id: "e-doc-approval", source: "doc-1", target: "approval-1", type: "smoothstep" },
    {
      id: "e-approval-decision",
      source: "approval-1",
      target: "decision-1",
      type: "smoothstep",
    },
    {
      id: "e-decision-notify-success",
      source: "decision-1",
      sourceHandle: "approve",
      target: "notify-success",
      type: "smoothstep",
      label: "Approve",
      style: { stroke: "hsl(142 55% 42%)", strokeWidth: 2 },
      labelStyle: { fill: "hsl(142 55% 42%)", fontWeight: 600, fontSize: 11 },
      labelBgStyle: { fill: "hsl(38 30% 97%)" },
    },
    {
      id: "e-notify-end-success",
      source: "notify-success",
      target: "end-success",
      type: "smoothstep",
    },
    {
      id: "e-decision-notify-blocked",
      source: "decision-1",
      sourceHandle: "reject",
      target: "notify-blocked",
      type: "smoothstep",
      label: "Reject",
      style: { stroke: "hsl(0 72% 50%)", strokeWidth: 2 },
      labelStyle: { fill: "hsl(0 72% 50%)", fontWeight: 600, fontSize: 11 },
      labelBgStyle: { fill: "hsl(38 30% 97%)" },
    },
    {
      id: "e-notify-end-blocked",
      source: "notify-blocked",
      target: "end-blocked",
      type: "smoothstep",
    },
  ],
};
