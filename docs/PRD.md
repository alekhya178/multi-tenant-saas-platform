# Product Requirements Document (PRD)

## 1. User Personas

### 1.1 Super Admin
* **Role Description:** The system owner and maintainer.
* **Key Responsibilities:** Monitor system health, view all registered tenants, manage subscription plans, and intervene in system-wide issues.
* **Main Goals:** Ensure the platform is running smoothly and that tenants are adhering to their subscription limits.
* **Pain Points:** Lack of visibility into total platform usage; difficulty in diagnosing issues across different tenants without centralized access.

### 1.2 Tenant Admin
* **Role Description:** The manager or owner of a specific organization (customer) using the SaaS.
* **Key Responsibilities:** Onboard team members, manage user roles, oversee all projects, and ensure the team is productive.
* **Main Goals:** Organize company workflow efficiently and ensure data security within their organization.
* **Pain Points:** Time-consuming user management; fear of data leaking to other companies; confusion over subscription limits.

### 1.3 End User
* **Role Description:** A regular employee or team member working on projects.
* **Key Responsibilities:** Create tasks, update task status, comment on work, and meet deadlines.
* **Main Goals:** clear understanding of their daily tasks and priorities.
* **Pain Points:** Overwhelmed by clutter (seeing irrelevant projects); difficulty updating status quickly; unclear instructions on tasks.

## 2. Functional Requirements

### Authentication & Authorization Module
* **FR-001:** The system shall allow new organizations to register by providing a Tenant Name, Subdomain, and Admin credentials.
* **FR-002:** The system shall allow users to log in using Email, Password, and Tenant ID/Subdomain.
* **FR-003:** The system shall authenticate users via JSON Web Tokens (JWT) with a 24-hour expiration.
* **FR-004:** The system shall support three distinct roles: Super Admin, Tenant Admin, and User.

### Tenant Management Module
* **FR-005:** The system shall completely isolate data between tenants using a `tenant_id` identifier.
* **FR-006:** The system shall identify tenants by a unique subdomain (e.g., `company.saas.com`).
* **FR-007:** The system shall enforce subscription limits on the number of Users (Free: 5, Pro: 25, Enterprise: 100).
* **FR-008:** The system shall enforce subscription limits on the number of Projects (Free: 3, Pro: 15, Enterprise: 50).

### User Management Module
* **FR-009:** Tenant Admins shall be able to add new users to their specific tenant.
* **FR-010:** The system shall ensure email addresses are unique per tenant (a user can use the same email for a different tenant).
* **FR-011:** Tenant Admins shall be able to view a list of all users within their organization.

### Project Management Module
* **FR-012:** Users shall be able to create new Projects with a Name, Description, and Status.
* **FR-013:** Users shall be able to view a list of all Projects associated with their tenant.
* **FR-014:** The system shall allow soft-deletion or archiving of Projects.

### Task Management Module
* **FR-015:** Users shall be able to create Tasks within a Project, assigning a Title, Priority, and Due Date.
* **FR-016:** Users shall be able to assign Tasks to other users within the same tenant.
* **FR-017:** Users shall be able to update the status of a Task (Todo -> In Progress -> Completed).

## 3. Non-Functional Requirements

### Performance
* **NFR-001:** API response time shall be under 200ms for 95% of read requests to ensure a snappy user experience.

### Security
* **NFR-002:** All user passwords must be hashed using `bcrypt` or `argon2` before storage in the database.
* **NFR-003:** All API endpoints (except login/register) must require a valid JWT token in the Authorization header.

### Scalability
* **NFR-004:** The database schema shall be indexed on `tenant_id` to support query performance as the number of tenants grows to 1000+.

### Availability
* **NFR-005:** The application must be fully containerized using Docker to ensure consistent deployment and 99.9% uptime availability.