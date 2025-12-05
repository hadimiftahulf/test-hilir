# Server Architecture

## Database (TypeORM)
The project uses **TypeORM** with a relational schema. The `AppDataSource` is initialized in `src/server/db/datasource.ts`.

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ Role : "has_roles"
    Role ||--o{ Permission : "has_permissions"
    User ||--|{ Calculation : "creates"
    
    User {
        string id PK
        string email UK
        string name
        string passwordHash
        string avatarUrl
    }

    Role {
        string id PK
        string name UK
        string description
    }

    Permission {
        string id PK
        string resource
        string action
        string scope
        string key "resource:action:scope"
    }

    Calculation {
        string id PK
        float adSpend
        float costPerResult
        float averageOrderValue
        float productPrice
        float totalProfit
        float roiPercentage
        string userId FK
    }
```

## RBAC (Role-Based Access Control)
Access control is implemented via the `Permission` and `Role` entities.

### Logic
1.  **Permissions**: Defined by `resource` (e.g., 'user'), `action` (e.g., 'read'), and `scope` (e.g., 'any', 'own').
2.  **Assignment**: Permissions are assigned to Roles. Roles are assigned to Users.
3.  **Session Hydration**: On login (`auth.service.ts`), the system fetches all roles for the user and collects all unique permission keys. These keys are stored in the user session.
4.  **Verification**: The `can(keys, resource, action, scope)` function checks if the user's session keys include the required permission.

## Services
Business logic is encapsulated in services found in `src/server/services`.
-   **Auth Service** (`auth.service.ts`): Handles user verification against the database.
-   **Permission Service**: (Likely) manages creation/retrieval of permissions.
