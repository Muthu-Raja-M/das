# SETUP_COMPLETE.md

Welcome to the **Blue Connect** developer setup guide. This document provides step-by-step setup instructions, environment variables configuration, database commands, dependency explanations, troubleshooting tips, and development workflows to help you run Blue Connect on **Windows** and **Linux** systems.

---

## 1. Project Overview

* **Project Name**: Blue Connect
* **Description**: A web application that connects customers with local, verified service providers and employers (e.g., housekeepers, plumbers, carpenters, drivers, mechanics).
* **Purpose**: Provides a unified portal for service seekers to filter verified service providers by category and location, send hire requests, and communicate securely.
* **Core Features**:
  * Dual-role registration (Customer / Employer).
  * KYC Verification flow (Employers upload identity cards, face images, and licenses for admin audit).
  * Booking/Hiring request lifecycle (Create request -> Accept/Reject request -> Chat interface activates).
  * Real-time notifications for hiring requests and status updates.
  * Admin dashboard for document preview, approval/rejection audits, and account management.
  * OpenTelemetry tracing for database, server, and requests monitoring.
* **Technology Stack**:
  * **Backend**: Django REST Framework (DRF), SimpleJWT, OpenTelemetry, Psycopg2.
  * **Frontend**: React (v19), Vite (v7), Material-UI (MUI v7), Axios, TanStack React Query.
  * **Database**: PostgreSQL (Production/Dev), SQLite (Dev fallback).
* **Architecture Overview**:
  * The project follows a decoupled client-server architecture. The backend Django service processes requests and exposes RESTful API endpoints. The React single-page application (SPA) queries APIs via Axios and renders components dynamically.

---

## 2. Folder Structure

```text
blue-connect-feature-login/
├── api/                             # Django Backend Codebase
│   ├── apps/                        # Django Applications
│   │   ├── adminpanel/              # Admin dashboard data lists and stats
│   │   ├── authentication/          # User login, session setup, and token refresh
│   │   ├── customer/                # Customer profile creation and fetching
│   │   ├── employer/                # Employer profile details, category lists
│   │   ├── hire_request/            # Hire request creations, updates, and counts
│   │   ├── messaging/               # In-app chat, messages list and sender views
│   │   ├── notifications/           # Triggers alerts and JWT authorization wrappers
│   │   ├── password_reset/          # OTP creation, validation, and email dispatch
│   │   └── verification/            # Documents KYC storage and approval views
│   ├── common/                      # Shared Backend Services
│   │   └── utils/                   # password_validation.py, telemetry.py, otel_metrics.py
│   ├── config/                      # Core configurations (settings.py, urls.py)
│   ├── media/                       # Holds uploaded KYC documents and images
│   ├── static/                      # Django static files
│   ├── db.sqlite3                   # Local fallback SQLite database
│   ├── manage.py                    # Django administration command-line utility
│   ├── requirements.txt             # Backend dependencies list
│   └── .env.example                 # Environment configuration template
└── ui/                              # React Frontend Codebase
    ├── public/                      # Static entry assets
    ├── src/                         # React UI code
    │   ├── api/                     # Axios configuration and backend URL mappings
    │   ├── app/                     # React App setup, CSS rules, and routes
    │   ├── assets/                  # Frontend image, logo and category icons
    │   ├── features/                # Domain-specific components, pages and hooks
    │   └── shared/                  # Common drawers, headers, and footer components
    ├── package.json                 # Node package configuration
    └── vite.config.js               # Vite compilation settings
```

---

## 3. System Requirements

### Operating Systems
* **Windows**: Windows 10, Windows 11 (64-bit).
* **Linux**: Ubuntu 20.04+, Debian 11+, Linux Mint 20+.

### Software Requirements
* **Python**: v3.10.x up to v3.14.0 (Latest v3.14.0 environment is fully supported).
* **Node.js**: v18.x or v20.x (LTS recommended).
* **npm**: v9.x or v10.x.
* **PostgreSQL**: v14, v15, or v16.
* **Git**: v2.34+ (for version control).

### Hardware Requirements
* **Minimum RAM**: 8 GB.
* **Recommended RAM**: 16 GB.
* **Minimum Disk Space**: 5 GB of free space (for media attachments and database indexes).

---

## 4. Software Installation Guide

### Windows Installation Guide
1. **Python**: Download the installer from python.org. Ensure the **"Add Python to PATH"** checkbox is checked during installation.
2. **Node.js**: Download the Windows Installer (.msi) from nodejs.org and follow setup prompts.
3. **PostgreSQL**: Download PostgreSQL from EnterpriseDB. During setup, configure password, default port `5432`, and install pgAdmin 4.
4. **Git**: Download and install from git-scm.com using default options.

### Linux Installation Guide (Ubuntu/Debian)
Run the following terminal command to update repositories and install dependencies:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib git -y
```

### Recommended VS Code Extensions
* **Python** (by Microsoft)
* **ES7+ React/Redux/React-Native Snippets**
* **Prettier - Code formatter**
* **ESLint**
* **Thunder Client** or **Postman** (for API testing)

---

## 5. Clone Project

Open your terminal or PowerShell and run:
```bash
git clone <repository-url>
cd blue-connect-feature-login
```

---

## 6. Backend Setup

### Step 1: Create a Virtual Environment
* **Windows (PowerShell)**:
  ```powershell
  python -m venv .venv
  ```
* **Linux**:
  ```bash
  python3 -m venv .venv
  ```

### Step 2: Activate the Virtual Environment
* **Windows (PowerShell)**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
* **Linux**:
  ```bash
  source .venv/bin/activate
  ```

### Step 3: Install Requirements
```bash
cd api
pip install -r requirements.txt
```

### Step 4: Create `.env` file
Duplicate the `.env.example` template:
* **Windows**:
  ```powershell
  copy .env.example .env
  ```
* **Linux**:
  ```bash
  cp .env.example .env
  ```

Open `.env` in a text editor and fill in your details:
```env
DB_NAME=blue_connect_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=127.0.0.1
DB_PORT=5432
SENDGRID_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=your_sendgrid_sender_email@gmail.com
```

---

## 7. PostgreSQL Setup

### Step 1: Access PostgreSQL CLI
* **Windows**: Open the SQL Shell (psql) tool or access pgAdmin.
* **Linux**: Access PostgreSQL using sudo:
  ```bash
  sudo -i -u postgres psql
  ```

### Step 2: Create Database and Role
Run the following SQL commands to configure the database engine:
```sql
CREATE DATABASE blue_connect_db;
CREATE USER postgres WITH PASSWORD 'your_postgres_password';
ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE blue_connect_db TO postgres;
\q
```

---

## 8. Django Setup

From the `api/` directory (with virtual environment activated):

### Step 1: Apply Database Migrations
```bash
python manage.py migrate
```

### Step 2: Create Superuser Account
```bash
python manage.py createsuperuser
```
*(Enter admin email and set password, e.g. `admin@blueconnect.com` / `admin123`)*

### Step 3: Run Development Server
```bash
python manage.py runserver
```
*The backend server should now be running at `http://127.0.0.1:8000/`*

---

## 9. Frontend Setup

Open a new terminal session, navigate to the `ui/` directory:

### Step 1: Install Node Dependencies
```bash
cd ui
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```
*The React application will launch at `http://localhost:5173/`*

### Step 3: Compile and Test Production Build
To create a production-ready static bundle:
```bash
npm run build
npm run preview
```

---

## 10. Environment Variables Guide

Here is an explanation of every variable defined inside `api/.env`:

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `DB_NAME` | Yes | `blue_connect_db` | Name of the PostgreSQL database. |
| `DB_USER` | Yes | `postgres` | PostgreSQL username. |
| `DB_PASSWORD` | Yes | None | Database password. |
| `DB_HOST` | Yes | `localhost` | Database host (use `127.0.0.1` locally). |
| `DB_PORT` | Yes | `5432` | Database port. |
| `SENDGRID_API_KEY` | Yes | None | Third-party SendGrid API key for OTP delivery. |
| `FROM_EMAIL` | Yes | None | Verified sender email associated with SendGrid. |

---

## 11. Dependency Documentation

### Backend Python Packages (`api/requirements.txt`)
* **Django==6.0.6**: MVC Framework.
* **djangorestframework==3.17.1**: Serializers and view toolkits.
* **djangorestframework-simplejwt==5.5.1**: Decodes and signs JWT access tokens.
* **django-cors-headers==4.9.0**: Allows frontend client domain to trigger requests.
* **pillow==12.2.0**: Handles image dimension parsing and upload storage.
* **psycopg2-binary==2.9.12**: PostgreSQL driver.
* **python-dotenv==1.2.2**: Reads database credentials from local `.env`.
* **sendgrid==6.12.5**: Mail dispatcher client.
* **opentelemetry-api** & **opentelemetry-sdk**: Django server instrumentation hooks.

### Frontend NPM Packages (`ui/package.json`)
* **react** & **react-dom** (v19.2.0): Virtual DOM renderer.
* **@mui/material** (v7.3.9): Visual cards, grids, buttons and layout grids.
* **@tanstack/react-query** (v5.95.2): Asynchronous state caches.
* **axios** (v1.14.0): Requests handler.
* **formik** & **yup**: Validation helper for user registrations.
* **india-state-district** (v1.0.5): Renders states dropdown menus.
* **swiper**: Marketing slide banners.

---

## 12. API Configuration & Auth Flow

* **Endpoints URL Config**: All requests from the frontend pass through the Axios instance configured in `ui/src/api/axios.js`.
* **JWT Authentication Lifecycle**:
  1. User submits login data to `/api/auth/login/`.
  2. Backend returns `access` and `refresh` tokens, user name, and user role.
  3. Client intercepts response, writes details to `localStorage` as `token` and `user`.
  4. Subsequent Axios calls automatically attach the header:
     `Authorization: Bearer <token>`
  5. The backend validates token fields (`user_id`, `role`, `email`) using the `CustomJWTAuthentication` class.

---

## 13. Database Operations

### Run Django Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Reset / Wipe out Local Database
To clear data and re-run migrations from scratch:
```bash
# PostgreSQL Shell
DROP DATABASE blue_connect_db;
CREATE DATABASE blue_connect_db;
GRANT ALL PRIVILEGES ON DATABASE blue_connect_db TO postgres;

# Apply migrations
python manage.py migrate
```

### Backup Database Data
To dump database content to a SQL file:
* **Windows**:
  ```powershell
  pg_dump -U postgres -d blue_connect_db > backup.sql
  ```
* **Linux**:
  ```bash
  pg_dump -U postgres blue_connect_db > backup.sql
  ```

### Restore Database Data
To restore a database dump:
```bash
psql -U postgres -d blue_connect_db -f backup.sql
```

---

## 14. Default Accounts & Test Seeding

* **Admin Superuser Credentials**:
  * Email: `admin@blueconnect.com`
  * Password: `admin123`
* **Seeding Test Accounts**:
  To seed customers or employers, open the frontend registration pages:
  * Customer registration: `http://localhost:5173/customer/register`
  * Employer registration: `http://localhost:5173/employer/register`
  
*(Note: Newly registered employers will appear on the Admin Dashboard under "Verification" where they must upload KYC documents. Once approved by the admin superuser, they receive an EMP ID and appear in verified customer search queries).*

---

## 15. CLI Project Commands Reference

| Operation | Command | Location |
| :--- | :--- | :--- |
| Activate Virtualenv (Windows) | `.venv\Scripts\Activate.ps1` | `api/` |
| Activate Virtualenv (Linux) | `source .venv/bin/activate` | `api/` |
| Start Backend Server | `python manage.py runserver` | `api/` |
| Apply DB Migrations | `python manage.py migrate` | `api/` |
| Create Superuser | `python manage.py createsuperuser` | `api/` |
| Install Node Packages | `npm install` | `ui/` |
| Run React UI Dev Server | `npm run dev` | `ui/` |
| Compile React UI Prod Bundle | `npm run build` | `ui/` |
| Preview Production Build | `npm run preview` | `ui/` |

---

## 16. Launch Checklist & Running the Project

Follow these steps to run the complete workspace locally:

1. **Start PostgreSQL**: Make sure the PostgreSQL service is active on your machine.
2. **Launch Backend**:
   ```bash
   cd api
   # Activate virtualenv
   python manage.py runserver
   ```
3. **Launch Frontend**:
   ```bash
   cd ui
   npm run dev
   ```
4. **Access the application**: Navigate to `http://localhost:5173/` in your browser.

---

## 17. Testing Guide

### Manual Smoke Test Plan
1. **Login validation**: Attempt logging in with invalid credentials to confirm error messages.
2. **Registration pipeline**: Register a new employer, login, and verify that a warning banner states verification files are missing.
3. **KYC Document Upload**: Upload face, Aadhaar, PAN, and license images under `http://localhost:5173/employer-verify`.
4. **Admin Approval**: Login to the admin panel (`admin@blueconnect.com` / `admin123`). Navigate to verifications, view uploaded cards, click **"Approve Employer"**, and verify that the employer's status updates.
5. **Customer Search**: Login as a customer, verify that you can search for the approved employer by category (e.g. driver), send a hire request, and initiate a chat conversation once the employer accepts.

---

## 18. Logging & Telemetry

* **OpenTelemetry Tracing**:
  On backend start, OpenTelemetry starts automatically and instruments database psycopg2 queries and http calls.
  Traces are pushed to local Jaeger collectors at `http://127.0.0.1:4318/v1/traces`.
* **Browser Logs**:
  Open DevTools (`F12`) to review state mutations, axios interceptor outputs, and route redirects.

---

## 19. Troubleshooting common problems

### 1. `ModuleNotFoundError: No module named '...'`
* **Cause**: Packages are not installed, or virtual environment is deactivated.
* **Solution**: Ensure your prompt prefix reads `(.venv)` and run `pip install -r requirements.txt`.

### 2. `Database Connection Failed`
* **Cause**: PostgreSQL service is off, or credentials inside `.env` are mismatching.
* **Solution**: Check pgAdmin status, test connecting manually via SQL Shell, and double-check `.env` values.

### 3. `CORS Error: Blocked by CORS policy`
* **Cause**: Allowed origins are restricted.
* **Solution**: Verify that `corsheaders` is active in `INSTALLED_APPS` and settings contain `CORS_ALLOW_ALL_ORIGINS = True` for dev.

### 4. `npm install Failed`
* **Cause**: Node version mismatch.
* **Solution**: Delete `node_modules` and `package-lock.json`, and run `npm install --legacy-peer-deps` or use Node.js v20.

---

## 20. Production Deployment Checklist

* [ ] Set `DEBUG = False` inside `settings.py`.
* [ ] Configure your deployment domains in `ALLOWED_HOSTS`.
* [ ] Switch `CORS_ALLOW_ALL_ORIGINS` to `False` and define `CORS_ALLOWED_ORIGINS` pointing strictly to the frontend host.
* [ ] Bind database credentials to system environment vars instead of committing `.env`.
* [ ] Configure static collect files storage and run `python manage.py collectstatic`.
* [ ] Enforce HTTPS redirect rules in Django.

---

## 21. Recommended Git Ignore

### Backend (`api/.gitignore`)
```text
*.pyc
__pycache__/
.venv/
.env
db.sqlite3
media/
```

### Frontend (`ui/.gitignore`)
```text
node_modules/
dist/
.env
.DS_Store
```
