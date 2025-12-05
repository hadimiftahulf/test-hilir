# API Reference

The application uses standard REST patterns, heavily abstracted using a **CRUD Factory** and **API Wrapper** for consistency and security.

## CRUD Factory (`src/server/lib/crud-factory.ts`)
Most resource-based routes are generated using `createCollectionHandlers` and `createItemHandlers`. This ensures consistent:
-   **Authentication**: All routes are protected via `withAuth`.
-   **RBAC**: Permissions are automatically checked (e.g., `users:read`, `users:create`).
-   **Scoping**: Data access is restricted based on the permission scope (`own` vs `any`).

### Standard Endpoints
For resources like **Users**, **Roles**, and **Permissions**, the following endpoints are typically available:

| Method | Endpoint | Description | Required Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/[resource]` | List items (filtered by scope) | `[resource]:read` |
| `POST` | `/api/[resource]` | Create a new item | `[resource]:create` |
| `GET` | `/api/[resource]/[id]` | Get a single item | `[resource]:read` |
| `PUT` | `/api/[resource]/[id]` | Update an item | `[resource]:update` |
| `DELETE` | `/api/[resource]/[id]` | Delete an item | `[resource]:delete` |

## Key Routes

### 1. Dashboard (`src/app/api/dashboard`)
-   `GET /api/dashboard/summary`
    -   **Permission**: `dashboard:read`
    -   **Returns**: Aggregated data for the dashboard (KPIs, Activity Feed, ROI Status).
    -   **Logic**:
        -   Fetches count of `Users`.
        -   Calculates critical ROI from `Calculations`.
        -   Returns recent activity (Registrations + Calculations).

### 2. Auth (`src/app/api/auth`)
-   `/api/auth/[...nextauth]`
    -   Handled by **NextAuth.js**.
    -   Supports Credentials Provider (Email/Password).
    -   Session callbacks hydrate the user roles and permissions from the DB.

### 3. AI (`src/app/api/ai`)
-   `POST /api/ai/analyze`
    -   **Body**: `{ adSpend, cpr, aov, roi, profit }`
    -   **Returns**: JSON analysis of the campaign performance using an LLM.

### 4. Calculations (`src/app/api/calculations`)
-   `POST /api/calculations`
    -   Saves a new calculation result.
    -   **Permission**: `calculations:create` (likely).
-   `GET /api/calculations`
    -   Retrieves history.
