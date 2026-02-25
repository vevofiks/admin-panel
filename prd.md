# PRD: Nexus AI – Universal eCommerce Admin IDE

## 1. Project Overview
**Nexus AI** is a high-performance, system-agnostic administrative interface designed for the 2026 eCommerce ecosystem. It acts as a "Mission Control" for multiple store backends, prioritizing a "Developer Experience" (DX) for store managers.

- **Primary Goal:** Provide a unified UI to manage Shopify, MedusaJS, and Custom APIs.
- **Visual Style:** "Sleek/Modern" – high-contrast typography, subtle glassmorphism, and minimal borders (Stripe/Vercel aesthetic).

---

## 2. Tech Stack & Architecture
To ensure extreme reusability and scalability:

* **Framework:** Next.js 15 (App Router) + React 19.
* **Styling:** Tailwind CSS v4 (using CSS variables for dynamic branding).
* **Components:** Shadcn/ui (Radix Primitives).
* **Data Layer:** TanStack Query v5 (Server-side fetching + Client-side caching).
* **Table Engine:** TanStack Table (Headless UI for complex data grids).
* **Animations:** Framer Motion (for micro-interactions).

---

## 3. The "Universal Adapter" Strategy
To support different systems, the codebase must never call a backend-specific SDK directly within a UI component.



### Standardized Interfaces (The "Nexus Contract")
All external data must be mapped to these internal TypeScript types:
- `UnifiedProduct`: Standardizes variants, pricing, and stock.
- `UnifiedOrder`: Standardizes fulfillment status and customer data.
- `UnifiedCustomer`: Standardizes lifetime value (LTV) and segmenting.

---

## 4. Key Functional Modules

### A. The "Command Center" (AI IDE Core)
- **Feature:** A global `CMD + K` command bar.
- **Requirement:** Must support natural language processing (NLP) to trigger UI actions.
- **Example:** "Search orders from London" or "Toggle dark mode".

### B. Adaptive Data Tables
- **Feature:** A reusable `<DataTable />` wrapper.
- **Requirement:** - Server-side pagination and filtering.
    - Column visibility toggles.
    - Export to CSV/JSON functionality.
    - Skeleton loading states.

### C. Multi-Tenant Switcher
- **Feature:** A workspace selector in the sidebar.
- **Requirement:** Switching stores updates the `Provider` context without a full page reload.

---

## 5. UI/UX Design Tokens (The "Sleek" Specs)

| Property | Value |
| :--- | :--- |
| **Primary Palette** | Zinc-950 (BG), Zinc-50 (Text), Indigo-500 (Accent) |
| **Surface** | `bg-white/50` with `backdrop-blur-md` (Glassmorphism) |
| **Borders** | `border-zinc-200` (Light) / `border-zinc-800` (Dark) |
| **Radius** | `0.75rem` for Cards, `9999px` for Pills |
| **Typography** | Font: `Geist Sans`, Weight: 450 (Regular) / 600 (Semibold) |

---

## 6. Directory Structure Template
```text
src/
├── app/                  # Route Handlers & Layouts
├── components/
│   ├── ui/               # Atomic Shadcn (Buttons, Inputs)
│   ├── shared/           # Complex Organisms (Sidebar, Shell)
│   └── modules/          # Domain-specific (ProductTable, AICmd)
├── core/
│   ├── adapters/         # ShopifyAdapter.ts, MedusaAdapter.ts
│   ├── hooks/            # useUnifiedProducts, useAIAction
│   └── store/            # State management (Zustand)
└── lib/                  # Formatting, tailwind-merge, etc.