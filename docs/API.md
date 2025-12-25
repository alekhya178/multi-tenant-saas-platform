# API Documentation

This documentation covers all 19 available endpoints for the SaaS Project Management Platform.

**Authentication:** All endpoints (except Register/Login) require a valid JWT token in the header:
`Authorization: Bearer <your_token_here>`

---

## 🔐 1. Authentication & Tenants

### 1. Register Tenant
**POST** `/api/auth/register-tenant`
* **Auth:** No
* **Description:** Creates a new tenant organization and its first admin user.
* **Request:**
    ```json
    {
      "tenantName": "Tech Corp",
      "subdomain": "tech",
      "adminEmail": "admin@tech.com",
      "adminPassword": "password123",
      "adminFullName": "John Doe"
    }
    ```
* **Response:**
    ```json
    { "success": true, "message": "Tenant registered successfully" }
    ```

### 2. Login
**POST** `/api/auth/login`
* **Auth:** No
* **Description:** Authenticates a user and returns a JWT token.
* **Request:**
    ```json
    { "email": "admin@tech.com", "password": "password123" }
    ```
* **Response:**
    ```json
    {
      "success": true,
      "data": { "token": "eyJhbG...", "user": { "id": 1, "role": "tenant_admin" } }
    }
    ```

### 3. Get Current User (Me)
**GET** `/api/auth/me`
* **Auth:** Yes
* **Description:** Returns details of the currently logged-in user.
* **Response:**
    ```json
    { "success": true, "data": { "id": 1, "email": "admin@tech.com", "role": "tenant_admin" } }
    ```

### 4. Logout
**POST** `/api/auth/logout`
* **Auth:** Yes
* **Description:** Logs out the user (client-side token removal).
* **Response:**
    ```json
    { "success": true, "message": "Logged out successfully" }
    ```

---

## 👥 2. User Management
*Manage team members within a specific tenant.*

### 5. List Users
**GET** `/api/tenants/:tenantId/users`
* **Auth:** Yes (Admin/Member)
* **Description:** Lists all users belonging to a specific tenant.
* **Response:**
    ```json
    { "success": true, "data": { "users": [ { "id": 2, "full_name": "Jane Doe" } ] } }
    ```

### 6. Create User
**POST** `/api/tenants/:tenantId/users`
* **Auth:** Yes (Tenant Admin)
* **Description:** Adds a new team member to the tenant.
* **Request:**
    ```json
    {
      "email": "employee@tech.com",
      "password": "password123",
      "fullName": "Jane Smith",
      "role": "user"
    }
    ```
* **Response:**
    ```json
    { "success": true, "message": "User created successfully" }
    ```

### 7. Get Single User
**GET** `/api/users/:id`
* **Auth:** Yes
* **Description:** Get profile details of a specific user.
* **Response:**
    ```json
    { "success": true, "data": { "id": 5, "email": "employee@tech.com" } }
    ```

### 8. Update User
**PUT** `/api/users/:id`
* **Auth:** Yes (Tenant Admin)
* **Description:** Update user details (Name, Role).
* **Request:**
    ```json
    { "full_name": "Jane Doe Smith", "role": "tenant_admin" }
    ```
* **Response:**
    ```json
    { "success": true, "message": "User updated" }
    ```

### 9. Delete User
**DELETE** `/api/users/:id`
* **Auth:** Yes (Tenant Admin)
* **Description:** Permanently remove a user from the tenant.
* **Response:**
    ```json
    { "success": true, "message": "User deleted successfully" }
    ```

---

## 📂 3. Project Management

### 10. List Projects
**GET** `/api/projects`
* **Auth:** Yes
* **Description:** List all projects for the current tenant.
* **Response:**
    ```json
    { "success": true, "data": { "projects": [ { "id": 10, "name": "Website Redesign" } ] } }
    ```

### 11. Create Project
**POST** `/api/projects`
* **Auth:** Yes
* **Description:** Start a new project.
* **Request:**
    ```json
    {
      "name": "Q1 Marketing Campaign",
      "description": "Planning for Q1",
      "status": "active"
    }
    ```
* **Response:**
    ```json
    { "success": true, "data": { "id": 12, "name": "Q1 Marketing Campaign" } }
    ```

### 12. Get Project Details
**GET** `/api/projects/:id`
* **Auth:** Yes
* **Description:** Get full details of a single project.
* **Response:**
    ```json
    { "success": true, "data": { "id": 12, "name": "Q1 Marketing Campaign", "status": "active" } }
    ```

### 13. Update Project
**PUT** `/api/projects/:id`
* **Auth:** Yes
* **Description:** Update project name, description, or status.
* **Request:**
    ```json
    { "status": "completed" }
    ```
* **Response:**
    ```json
    { "success": true, "message": "Project updated" }
    ```

### 14. Delete Project
**DELETE** `/api/projects/:id`
* **Auth:** Yes (Admin/Creator)
* **Description:** Delete a project and all its tasks.
* **Response:**
    ```json
    { "success": true, "message": "Project deleted" }
    ```

---

## ✅ 4. Task Management

### 15. List Tasks
**GET** `/api/projects/:projectId/tasks`
* **Auth:** Yes
* **Description:** Get all tasks associated with a specific project.
* **Response:**
    ```json
    { "success": true, "data": { "tasks": [ { "id": 50, "title": "Draft content" } ] } }
    ```

### 16. Create Task
**POST** `/api/projects/:projectId/tasks`
* **Auth:** Yes
* **Description:** Add a new task to a project.
* **Request:**
    ```json
    {
      "title": "Design Mockups",
      "priority": "high",
      "due_date": "2023-12-31"
    }
    ```
* **Response:**
    ```json
    { "success": true, "data": { "id": 51, "title": "Design Mockups" } }
    ```

### 17. Update Task Details
**PUT** `/api/tasks/:id`
* **Auth:** Yes
* **Description:** Edit task title, description, or priority.
* **Request:**
    ```json
    { "priority": "medium" }
    ```
* **Response:**
    ```json
    { "success": true, "message": "Task updated" }
    ```

### 18. Update Task Status
**PATCH** `/api/tasks/:id/status`
* **Auth:** Yes
* **Description:** Move task between columns (todo -> in_progress -> completed).
* **Request:**
    ```json
    { "status": "in_progress" }
    ```
* **Response:**
    ```json
    { "success": true, "message": "Task status updated" }
    ```

---

## 🛡️ 5. System Administration

### 19. View Audit Logs
**GET** `/api/audit-logs`
* **Auth:** Yes (Super Admin Only)
* **Description:** View system-wide logs of critical actions (login, delete, create).
* **Response:**
    ```json
    {
      "success": true,
      "data": [
        { "action": "DELETE_USER", "performed_by": "admin@tech.com", "timestamp": "2023-10-01T10:00:00Z" }
      ]
    }
    ```