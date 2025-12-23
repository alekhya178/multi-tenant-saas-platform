# Technical Specification

## 1. Project Structure

The project is organized as a Monorepo containing both Backend and Frontend, orchestrated by Docker.

### Root Directory
* `docker-compose.yml`: Orchestration for DB, Backend, and Frontend.
* `README.md`: Project documentation.
* `submission.json`: Test credentials.

### Backend Structure (`/backend`)
* `src/`
    * `config/`: Database connection and env variable setup.
    * `controllers/`: Logic for handling API requests (e.g., `authController.js`, `projectController.js`).
    * `middleware/`: Authentication checks (`authMiddleware.js`), error handling, and validation.
    * `models/`: Database queries and schema definitions.
    * `routes/`: API route definitions (e.g., `authRoutes.js`).
    * `utils/`: Helper functions (e.g., password hashing).
* `migrations/`: SQL files for creating tables.
* `seeds/`: SQL files for initial data.
* `Dockerfile`: Configuration to build the Node.js backend image.

### Frontend Structure (`/frontend`)
* `public/`: Static assets.
* `src/`
    * `components/`: Reusable UI parts (Navbar, Sidebar, Cards).
    * `pages/`: Full page views (Dashboard, Login, ProjectList).
    * `context/`: React Context for managing Auth state globally.
    * `services/`: Axios setup for API calls.
* `Dockerfile`: Configuration to build the React frontend image.

## 2. Development Setup Guide

### Prerequisites
* **Docker Desktop:** Must be installed and running.
* **Node.js (v18+):** For local testing outside Docker (optional).

### Environment Variables (.env)
The following variables are configured in `docker-compose.yml`:
* `DB_HOST`: database
* `DB_PORT`: 5432
* `JWT_SECRET`: [Secure Random String]
* `FRONTEND_URL`: http://frontend:3000

### Installation & Running (Docker)
1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd saas-platform
    ```

2.  **Start the Application:**
    Execute the single command to build and start all services:
    ```bash
    docker-compose up -d
    ```

3.  **Access the Application:**
    * Frontend: `http://localhost:3000`
    * Backend Health Check: `http://localhost:5000/api/health`

### Database Initialization
The system is designed to auto-initialize. The Backend Docker container contains a script that runs the SQL migrations located in `backend/migrations/` immediately upon startup, followed by the seeds. No manual database setup is required.