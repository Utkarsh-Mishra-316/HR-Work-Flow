 # HR Workflow Designer (React + React Flow)
# #preview 
![Uploading WhatsApp Image 2026-04-24 at 1.43.14 PM.jpeg…]()

## Overview

A visual workflow builder prototype for HR process automation built using **React**, **TypeScript**, and **React Flow**.

This prototype allows HR admins to design, configure, validate, and simulate internal workflows such as:

* Employee onboarding
* Leave approval routing
* Document verification
* Automated notifications

Built as a front-end systems design exercise focused on architecture, configurable workflows, and simulation.

---

## Features

### Visual Workflow Canvas

* Drag-and-drop node palette
* Connect workflow steps with edges
* React Flow powered canvas
* Zoom, pan and minimap controls
* Branching decision nodes

### Supported Node Types

* Start Node
* Approval Step Node
* Document Verification Node
* Decision Node
* Notification Node
* End Node

---

## Node Configuration

Each node supports editable properties through the Inspector panel.

Examples:

### Start Node

* Workflow title
* Metadata

### Approval Step

* Approver role
* SLA duration
* Approval conditions

### Document Verification

* Required document list
* Validation rules

### Decision Node

* Conditional branching (Approve / Reject)

### Notification Node

* Channel selection
* Message payload

### End Node

* Completion outcomes
* Summary state

---

## Workflow Simulation Sandbox

Includes a lightweight execution simulator that:

* Serializes the workflow graph
* Traverses nodes step-by-step
* Displays execution log
* Simulates approval branches
* Shows success/rejection outcomes

Example:

```text
Start
→ Verify Documents
→ Manager Approval
→ Decision
→ Success Path / Rejection Path
```

---

## Tech Stack

```text
React
TypeScript
React Flow
Zustand
TailwindCSS
Vite
pnpm
```

---

## Architecture

Project follows modular front-end decomposition:

```text
src/
├── components/
│   ├── ui/
│   ├── nodes/
│   └── inspector/
│
├── flow/
│   ├── WorkflowCanvas.tsx
│   ├── simulator.ts
│   ├── workflowIO.ts
│   └── useWorkflowStore.ts
│
├── hooks/
├── lib/
└── pages/
```

### Architectural Choices

* **React Flow** for graph modeling and node-edge orchestration
* **Zustand** for lightweight centralized canvas state
* **Type-safe workflow models** for extensibility
* **Component-driven node rendering** for future node additions
* **Simulation engine abstraction** separated from UI

---

## Running Locally

### Install dependencies

```bash
pnpm install
```

### Start dev server

If environment variables are required:

```bash
$env:PORT=5173; $env:BASE_PATH="/"; pnpm dev
```

Open:

```text
http://localhost:5173
```

---

## Export / Import

Supports:

* Save workflow as JSON
* Load workflow from JSON
* Example preload workflow

---

## Validation

Prototype includes basic validation such as:

* Start node existence
* Branch connectivity
* Missing node warnings
* Workflow path completeness checks

---

## Assumptions

* Prototype focuses on front-end workflow orchestration only
* No authentication included
* No persistent backend storage included
* API layer is mocked for simulation purposes

---

## What Was Completed

Implemented:

✅ Visual workflow designer
✅ Custom node palette
✅ Configurable inspector panel
✅ Simulation sandbox
✅ Import/Export workflow JSON
✅ Example onboarding flow

---

## Future Improvements

With more time I would add:

* Undo / Redo
* Auto-layout with Dagre
* Workflow versioning
* Role-based approval routing rules
* BPMN-style conditional expressions
* Real backend persistence
* API driven automation templates

---

## Design Goal

The prototype prioritizes:

* Scalability
* Configurability
* Fast workflow authoring
* Clean state architecture
* Senior-level front-end system design

---

## Repository

```text
https://github.com/Dronzor-svg/hr-workflow-designer
```

---

## Author
Utkarsh Mishra  
