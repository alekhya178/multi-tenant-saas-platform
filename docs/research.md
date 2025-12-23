# Research & Requirements Analysis

## 1. Multi-Tenancy Analysis

### Introduction
Multi-tenancy is an architecture in which a single instance of a software application serves multiple customers (tenants). Each tenant's data must remain invisible to other tenants. For this SaaS Project & Task Management system, we evaluated three primary database architectures.

### Comparison of Approaches

| Feature | 1. Shared Database, Shared Schema | 2. Shared Database, Separate Schemas | 3. Separate Databases |
| :--- | :--- | :--- | :--- |
| **Description** | All tenants share the same database tables. A `tenant_id` column creates logical separation. | One database instance, but each tenant has their own distinct schema (namespace) within it. | Each tenant gets a completely isolated physical database instance. |
| **Data Isolation** | **Low:** relies entirely on application logic (WHERE clauses). High risk of developer error. | **Medium:** Schema-level isolation offers better security than shared tables but less than separate DBs. | **High:** Physical separation ensures strict data isolation. Hardest to breach. |
| **Scalability** | **High:** Supports thousands of tenants easily on one DB. Efficient resource usage. | **Medium:** Postgres can handle many schemas, but thousands of schemas create overhead/CPU load. | **Low:** High resource overhead. Managing thousands of DB instances is operationally heavy. |
| **Cost** | **Lowest:** Single DB instance to pay for and maintain. | **Medium:** Single DB instance, but higher maintenance. | **Highest:** Costs multiply with every new customer. |
| **Migration** | **Easiest:** Run one migration script for all tenants simultaneously. | **Hard:** Migration scripts must run iteratively over every schema. | **Hardest:** Must connect to and update every single database individually. |
| **Development** | **Fastest:** Standard SQL queries. Complexity is in the code (adding filters). | **Complex:** Requires dynamic schema switching in the ORM/Application layer. | **Complex:** Application must manage a catalog of connection strings. |

### Justification for Selected Approach: Shared Database, Shared Schema
For this project, we have selected **Approach 1: Shared Database with Shared Schema**.

**Justification:**
1.  **Operational Simplicity:** As a startup/MVP SaaS, minimizing DevOps overhead is critical. Managing a single database allows for streamlined backups, monitoring, and deployment.
2.  **Cost Efficiency:** This approach requires the least amount of infrastructure resources, fitting within standard cloud tier limits.
3.  **Performance:** Modern databases like PostgreSQL are highly optimized for large tables. By placing an index on the `tenant_id` column, query performance remains high even as data grows.
4.  **Tech Stack Compatibility:** Node.js and standard ORMs handle Row-Level Security (RLS) logic effectively via middleware, mitigating the "developer error" risk associated with this model.
5.  **Docker Requirements:** The mandatory Docker requirement for this project is significantly easier to fulfill with a single database container. Orchestrating dynamic schema creation or multiple DB containers would overcomplicate the deployment pipeline.

---

## 2. Technology Stack Justification

### Backend Framework: Node.js with Express.js
**Why chosen:**
Node.js was selected for its non-blocking, event-driven architecture, which is ideal for I/O-heavy applications like task management where many users are reading/writing concurrently. Express.js provides a minimalist, unopinionated framework that allows for rapid API development.
* **Alternatives Considered:** Python (Django/Flask) and Java (Spring Boot).
* **Reason for Rejection:** Django is synchronous by default; Spring Boot is too heavy for a micro-SaaS MVP. Node.js offers the best JSON handling (native) which streamlines the REST API development.

### Frontend Framework: React.js
**Why chosen:**
React's component-based architecture allows us to build reusable UI elements (Task Cards, Project Lists). The Virtual DOM ensures a responsive UI even when updating task statuses in real-time. The ecosystem (React Router, Context API) is mature and robust.
* **Alternatives Considered:** Angular and Vue.js.
* **Reason for Rejection:** Angular requires a steep learning curve and heavy boilerplate. React's popularity ensures better documentation and library support for features like Drag-and-Drop tasks.

### Database: PostgreSQL
**Why chosen:**
PostgreSQL is the industry standard for reliable relational data. It offers strict ACID compliance (crucial for ensuring data integrity between Tenants and Users) and robust support for JSONB types if we need flexible data structures later.
* **Alternatives Considered:** MongoDB (NoSQL) and MySQL.
* **Reason for Rejection:** MongoDB lacks native foreign key constraints, which are essential for enforcing the strict hierarchy of Tenant -> Project -> Task. MySQL is capable, but Postgres offers better advanced features for complex queries.

### Authentication: JSON Web Tokens (JWT)
**Why chosen:**
JWTs provide stateless authentication, meaning the server does not need to query a session table for every request. This improves scalability. The token payload can carry the `tenant_id` and `role`, making authorization checks instant.
* **Alternatives Considered:** Server-side Sessions (Cookies).
* **Reason for Rejection:** Sessions require shared storage (like Redis) to scale horizontally. JWTs are self-contained and work seamlessly across different domains (subdomains).

### Deployment: Docker
**Why chosen:**
Docker ensures environment consistency ("works on my machine, works in production"). It allows us to bundle the Frontend, Backend, and Database into isolated containers that can be deployed anywhere with a single command.
* **Alternatives Considered:** Traditional VM deployment or PaaS (Heroku).
* **Reason for Rejection:** Docker is a mandatory requirement for this project, but it is also the industry standard for modern DevOps pipelines.

---

## 3. Security Considerations

### 1. Logical Data Isolation Strategy
Since we are using a Shared Schema, isolation is enforced at the Application Layer.
* **Strategy:** Every single database query that retrieves data must include a `WHERE tenant_id = ?` clause.
* **Implementation:** We will use a dedicated Middleware in Express.js that extracts the `tenant_id` from the JWT and injects it into the request object. Controllers will force this ID into all ORM/SQL queries, preventing a user from manually requesting another tenant's ID.

### 2. Authentication & Authorization Approach
* **Authentication:** We use `bcrypt` to verify credentials and issue a signed JWT.
* **Authorization:** We implement Role-Based Access Control (RBAC). A middleware `authorize(role)` will sit before sensitive endpoints.
    * *Super Admin:* Access to everything.
    * *Tenant Admin:* Access to write operations within their tenant.
    * *User:* Read/Write access only to their assigned tasks.

### 3. Password Hashing Strategy
We strictly adhere to never storing plain-text passwords.
* **Algorithm:** `bcrypt` (or Argon2).
* **Configuration:** A minimum salt round of 10. This makes rainbow table attacks infeasible and brute-force attacks significantly slower.

### 4. API Security Measures
* **Input Validation:** All incoming data (registration forms, task details) is sanitized using a library (like Joi or express-validator) to prevent SQL Injection and XSS attacks.
* **Rate Limiting:** To prevent Denial of Service (DoS) attacks, we limit the number of requests a single IP can make within a time window.
* **CORS:** Cross-Origin Resource Sharing will be strictly configured to allow requests only from the frontend domain.

### 5. Secure Headers
We will use Helmet.js to set secure HTTP headers, including:
* `X-Content-Type-Options: nosniff` (Prevent MIME sniffing)
* `X-Frame-Options: DENY` (Prevent Clickjacking)
* `Strict-Transport-Security` (Force HTTPS)