# API Documentation

## Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register-tenant` | Register a new tenant & admin | No |
| POST | `/api/auth/login` | Login (Returns JWT) | No |
| GET | `/api/auth/me` | Get current user info | Yes |

## Users (Tenant Management)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/tenants/:id/users` | List users for a tenant | Yes (Admin) |
| POST | `/api/tenants/:id/users` | Create a new user | Yes (Admin) |
| PUT | `/api/users/:id` | Update user details | Yes (Admin) |
| DELETE | `/api/users/:id` | Soft delete/Remove user | Yes (Admin) |

## Projects
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/projects` | List all projects | Yes |
| GET | `/api/projects/:id` | Get single project details | Yes |
| POST | `/api/projects` | Create a new project | Yes |
| PUT | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes (Admin) |

## Tasks
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/projects/:id/tasks` | List tasks for a project | Yes |
| POST | `/api/projects/:id/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update task details | Yes |
| PATCH | `/api/tasks/:id/status` | Update task status | Yes |