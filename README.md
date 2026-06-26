# Blue Connect

Blue Connect is a modern web application designed to link service seekers (Customers) with qualified, verified local service providers and gig workers (Employers) such as housekeepers, plumbers, carpenters, drivers, and mechanics. 

---

## Project Description

### What is Blue Connect?
Blue Connect acts as a matching engine and service-hiring portal. Customers can search for local gig workers by category (e.g., electrician) and location (state and district), request their services, and converse in real-time. Employers upload KYC documentation to obtain verification and display their services to prospective clients.

### Who Uses It?
* **Customers**: Seekers looking for local, verified hands-on help.
* **Employers**: Service providers and contractors advertising their daily rates and skills.
* **Admins**: Auditors who verify employer identity documents and manage active users.

### Main Features
* **Verification Pipeline**: Secure KYC interface for workers to upload face images, Aadhaar cards, PAN cards, and driving licenses.
* **Dual-Dashboard Views**: Unique workspaces tailored for hiring activities, status updates, and KYC states.
* **Real-time Messaging**: Multi-thread conversation history activated automatically upon contract acceptance.
* **Polymorphic Notifications**: Automated notifications delivered upon booking request changes, messages, or KYC status updates.
* **OpenTelemetry Monitoring**: Distributed tracing of backend APIs, database connections, and external queries.

---

## Technology Stack

* **Backend**: Django REST Framework (DRF), SimpleJWT, OpenTelemetry SDK, Psycopg2.
* **Frontend**: React (v19), Vite (v7), Material-UI (MUI v7), Axios, TanStack React Query.
* **Database**: PostgreSQL (Production), SQLite (Local Fallback).
* **Authentication**: JWT (JSON Web Tokens) with a custom verification handler.
* **Third-Party Services**: SendGrid API for OTP delivery.

---

## Core Features

### 1. Customer Module
* Browse category list of verified employers.
* Filter workers by role, state, and district.
* Book services by sending hire requests.
* View booking status, check system notifications, and chat with employers.

### 2. Employer Module
* Set up profile details, experience level, and daily rates.
* Receive real-time hire requests.
* KYC document portal (Face, Aadhaar, PAN, and Driver's License uploads).
* Review verification feedback from the administrator.

### 3. Admin Module
* Admin dashboard reporting system statistics.
* Audit list of pending employer verification files.
* Inline image previewer for uploaded KYC cards.
* Single-click verification approvals or rejection logs.
* Ability to delete customer accounts.

---

## Project Structure

```text
blue-connect-feature-login/
├── api/                             # Backend Django project root
│   ├── apps/                        # Core application modules
│   │   ├── adminpanel/              # Admin dashboard data lists and stats
│   │   ├── authentication/          # User login, session, and token refresh
│   │   ├── customer/                # Customer profile creation and fetching
│   │   ├── employer/                # Employer profile details and categories
│   │   ├── hire_request/            # Hire request creations and updates
│   │   ├── messaging/               # In-app chat messaging between users
│   │   ├── notifications/           # Triggers alerts and JWT auth interceptors
│   │   ├── password_reset/          # OTP creation, validation, and email dispatch
│   │   └── verification/            # Documents KYC storage and approval views
│   ├── common/                      # Shared helper utility files
│   ├── config/                      # Root configuration (settings.py, urls.py)
│   ├── media/                       # Uploaded identity images
│   └── requirements.txt             # Backend dependencies lists
└── ui/                              # React frontend project root
    ├── public/                      # Static client files
    ├── src/                         # React UI code
    │   ├── api/                     # Axios instance and base request setup
    │   ├── app/                     # React App entry and client routing mapping
    │   ├── assets/                  # Images, logo and category icons
    │   ├── features/                # Domain-specific components and pages
    │   └── shared/                  # Common navbars, footers, and providers
    └── package.json                 # Node package dependencies
```

---

## Installation

### 1. System Pre-requisites
* Python v3.10 to v3.14
* Node.js v18 or v20 (LTS)
* PostgreSQL v14+

### 2. Backend Setup
1. Navigate to the `api/` directory:
   ```bash
   cd api
   ```
2. Create and activate a Python virtual environment:
   * **Windows**:
     ```powershell
     python -m venv .venv
     .venv\Scripts\activate.ps1
     ```
   * **Linux/macOS**:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `api/` folder using the provided template:
   ```bash
   cp .env.example .env
   ```

### 3. Frontend Setup
1. Navigate to the `ui/` directory:
   ```bash
   cd ../ui
   ```
2. Install npm packages:
   ```bash
   npm install
   ```

---

## Running the Project

### Database Setup
1. Create a database called `blue_connect_db` in PostgreSQL.
2. In the `api/` folder, run migrations:
   ```bash
   python manage.py migrate
   ```
3. Create an administrator account:
   ```bash
   python manage.py createsuperuser
   ```

### Running Backend Server
From the `api/` directory:
```bash
python manage.py runserver
```
The API backend will run at `http://127.0.0.1:8000/`.

### Running Frontend Server
From the `ui/` directory:
```bash
npm run dev
```
The Vite React UI will launch at `http://localhost:5173/`.

---

## Environment Variables

The backend `.env` file configures the following key settings:

* `DB_NAME`: PostgreSQL database name.
* `DB_USER`: PostgreSQL user name.
* `DB_PASSWORD`: PostgreSQL connection password.
* `DB_HOST`: PostgreSQL database host (e.g. `127.0.0.1`).
* `DB_PORT`: PostgreSQL connection port (default: `5432`).
* `SENDGRID_API_KEY`: Third-party SendGrid API key for OTP delivery.
* `FROM_EMAIL`: Verified sender email address.

---

## Project Architecture

```text
  [ React Frontend (Vite) ]  <--->  [ Axios Request Interceptor ]
                                                │
                                    (JWT Authorization Header)
                                                ▼
                                   [ Django REST API Backend ]
                                                │
                                       (ORM Query Tracing)
                                                ▼
                                    [ PostgreSQL Database ]
```

1. **Client Layer**: Single-page application rendering views using Material-UI components. State syncing is managed by React Query.
2. **Gateway Layer**: Axios interceptor extracts the active JWT access token from local storage and appends it to request headers.
3. **Application Layer**: Django views decode request headers and map authorization roles.
4. **Database Layer**: PostgreSQL manages relational data tables, schemas, and user keys.

---

## API Overview

The backend is composed of the following API endpoints:

* **Authentication (`/api/auth/`)**: Handles login, token generation, token refresh, and logout routines.
* **Customer (`/api/customer/`)**: Registration, lists, and query profile views.
* **Employer (`/api/employer/`)**: Registration, verified lists, detail queries, profile updates, and admin status updates.
* **Verification (`/api/verification/`)**: Submits KYC images, handles admin approvals, document query lists, and status audits.
* **Hire Request (`/api/hirerequest/`)**: Creates requests, queries employer bookings, and updates request states.
* **Messaging (`/api/messages/`)**: Direct message delivery and conversation threads.
* **Notifications (`/api/notifications/`)**: Feeds customer and worker panels, and manages notification updates.
* **Password Reset (`/api/passwordreset/`)**: Sends OTP to email, verifies code, and sets new credentials.

---

## Dependencies

### Backend
* `Django`
* `djangorestframework`
* `djangorestframework-simplejwt`
* `django-cors-headers`
* `psycopg2-binary`
* `pillow`
* `sendgrid`
* `opentelemetry-api` & `opentelemetry-sdk`

### Frontend
* `@mui/material`
* `@tanstack/react-query`
* `axios`
* `formik` & `yup`
* `india-state-district`
* `swiper`

---

## Security Configurations

* **JWT Verification**: Generates tokens with a default 15-minute access lifetime and 7-day refresh lifetime.
* **Role-Based Access Control (RBAC)**: Custom JWT decoder checks roles (`customer`, `employer`, `admin`) to restrict router navigation and endpoints.
* **Password Complexity**: Enforces a minimum 8-character length, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.

---

## Screenshots Section

*(Placeholders for future screenshot assets)*
* *Landing Page Mockup*
* *Customer Dashboard View*
* *Employer KYC Upload Panel*
* *Admin Verification Console*

---

## Future Improvements

* **Centralized Auth State**: Unify token storage inside React Context to replace raw localStorage lookups.
* **Security Locks**: Apply Django backend guards to all admin actions and profile endpoints.
* **Centralized Endpoints**: Refactor the frontend to eliminate direct `fetch` statements and route requests exclusively via Vite Axios configurations.
* **Automated Unit Tests**: Add Vitest for frontend components and TestCase rules for backend views.

---

## Contributors
* Mutha-Raja (Lead Developer)

---

## License
This project is licensed under the MIT License.
