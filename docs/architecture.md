# System Architecture Design

## 1. System Architecture Diagram

The system follows a classic **3-Tier Architecture** wrapped in Docker containers.

1.  **Client Tier (Frontend):**
    * **Technology:** React.js (Single Page Application).
    * **Role:** Handles user interface, state management, and API consumption.
    * **Communication:** Sends HTTP REST requests to the Backend.

2.  **Application Tier (Backend):**
    * **Technology:** Node.js with Express.
    * **Role:** Business logic, Authentication (JWT), Authorization (RBAC), and Tenant Isolation logic.
    * **Communication:** Processes JSON requests and queries the Database.

3.  **Data Tier (Database):**
    * **Technology:** PostgreSQL.
    * **Role:** Persistent storage of relational data.
    * **Isolation:** Shared schema with row-level logical isolation via `tenant_id`.

**Flow:**
Browser -> Load Balancer/Docker Port (3000) -> React App -> API Call (5000) -> Express Server -> SQL Query (5432) -> PostgreSQL.

---

## 2. Database Schema Design (ERD)

The database consists of 5 core tables. Every table (except `tenants` and `audit_logs`) has a Foreign Key linking to `tenants(id)`.

**Tables:**
1.  **Tenants:** `id` (PK), `name`, `subdomain`, `subscription_plan`, `status`.
2.  **Users:** `id` (PK), `tenant_id` (FK), `email`, `password_hash`, `role`.
3.  **Projects:** `id` (PK), `tenant_id` (FK), `created_by` (FK), `name`, `status`.
4.  **Tasks:** `id` (PK), `tenant_id` (FK), `project_id` (FK), `assigned_to` (FK), `status`, `priority`.
5.  **Audit_Logs:** `id` (PK), `tenant_id` (FK), `action`, `entity_type`.

**Key Relationships:**
* One Tenant -> Many Users
* One Tenant -> Many Projects
* One Project -> Many Tasks
* One User -> Many Tasks (Assignment)

---

## 3. API Architecture

All endpoints follow RESTful conventions.

**Authentication Module**
1.  `POST /api/auth/register-tenant` (Public)
2.  `POST /api/auth/login` (Public)
3.  `GET /api/auth/me` (Auth Required)
4.  `POST /api/auth/logout` (Auth Required)

**Tenant Module**
5.  `GET /api/tenants` (Super Admin only)
6.  `GET /api/tenants/:id` (Admin/Super Admin)
7.  `PUT /api/tenants/:id` (Admin/Super Admin)

**User Module**
8.  `POST /api/tenants/:id/users` (Tenant Admin only)
9.  `GET /api/tenants/:id/users` (Auth Required)
10. `PUT /api/users/:id` (Auth Required)
11. `DELETE /api/users/:id` (Tenant Admin only)

**Project Module**
12. `POST /api/projects` (Auth Required)
13. `GET /api/projects` (Auth Required)
14. `PUT /api/projects/:id` (Auth Required)
15. `DELETE /api/projects/:id` (Admin/Creator only)

**Task Module**
16. `POST /api/projects/:id/tasks` (Auth Required)
17. `GET /api/projects/:id/tasks` (Auth Required)
18. `PATCH /api/tasks/:id/status` (Auth Required)
19. `PUT /api/tasks/:id` (Auth Required)