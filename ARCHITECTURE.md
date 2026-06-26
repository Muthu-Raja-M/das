# Blue Connect - Architectural Blueprint

This document details the software architecture, design patterns, security frameworks, and monitoring infrastructures of the **Blue Connect** platform.

---

## 1. Architectural Style Overview

Blue Connect uses a **Decoupled Client-Server Architecture** separating user interfaces from computational services.

```text
       ┌──────────────────────────────┐
       │   React Single-Page Client   │ (Port 5173)
       └──────────────┬───────────────┘
                      │
            (JSON REST / HTTPS)
                      ▼
       ┌──────────────────────────────┐
       │     Django API Backend       │ (Port 8000)
       └──────────────┬───────────────┘
                      │
               (SQL Queries)
                      ▼
       ┌──────────────────────────────┐
       │    PostgreSQL Database       │ (Port 5432)
       └──────────────────────────────┘
```

* **Frontend Client (Vite / React)**: Handles user experience, navigation routers, form validations, dynamic tables, and responsive page views.
* **Backend API (Django REST Framework)**: Manages database transactions, authentication token lifecycle, password validations, KYC media storage, notifications dispatching, and metrics monitoring.
* **Database Layer (PostgreSQL)**: Handles persistent models, uniqueness limits, and relationship lookups.

---

## 2. Backend Architecture (Django)

The backend follows the standard **Django MTV (Model-Template-View) Pattern** adapted for headless RESTful APIs (without HTML templates):

* **Config Layer (`api/config/`)**: Manages project-wide settings, middleware stacks, root URL routing, database connection credentials, and OpenTelemetry instrumentation hooks.
* **Core Application Layer (`api/apps/`)**: Composed of 9 micro-applications (Apps). Each app operates in isolation and defines:
  * `models.py`: Database tables and schemas.
  * `views.py`: Request handlers, logic checks, status code returns, and JSON responses.
  * `serializers.py`: Marshals database queries into JSON and validates incoming payloads.
  * `urls.py`: App-specific routes mapped to backend view methods.
* **Common Library (`api/common/`)**: Core utility algorithms (e.g. complexity validators, OTEL tracers, and metrics exporters).

---

## 3. Frontend Architecture (React)

The frontend is organized using a **Feature-Driven Architecture** to keep the project modular and scalable.

```text
ui/src/
├── api/                  # Axios configuration, interceptors, and endpoints mapping
├── app/                  # App routes configuration and layout css rules
├── assets/               # Image resources and vector categories icons
├── features/             # Feature-specific structures (Redux/Query scopes)
│   ├── auth/             # Login forms and password update wizards
│   ├── customer/         # Search portals and seekers dashboards
│   ├── employer/         # Rate configurations and provider dashboards
│   └── ...
└── shared/               # Reusable headers, footers, and alert providers
```

* **Data Synchronization (TanStack React Query)**: Manages server-state tracking, queries caching, mutations, and manual query invalidation.
* **Visual Theme (Material-UI v7)**: Fully customizable themed controls including cards, grids, dialog panels, inputs, tables, and chips.
* **Form Handling (Formik & Yup)**: Client-side field checking, error reporting, and submit event management.

---

## 4. API Request & Data Flow Lifecycle

This flowchart illustrates the path of a typical request (e.g., retrieving verified employers):

```text
[ React UI Page ] 
       │
       ▼ (Triggers TanStack queryFn)
[ Custom Hook: useEmployer ] 
       │
       ▼ (Queries API endpoint)
[ Axios API Client (axios.js) ]
       │
       ├─► (Request Interceptor: Appends Bearer Token)
       │
       ▼ (Dispatched to Network)
[ Django URL Dispatcher (urls.py) ]
       │
       ▼ (Dispatched to View)
[ View Function: get_verified_employer_list ]
       │
       ├─► (Checks Database via ORM)
       ├─► (Serializes Employer Records to JSON)
       │
       ▼ (Dispatched back to Network)
[ Axios Response Interceptor ]
       │
       ├─► (Resolves clean response.data)
       │
       ▼ (Updates State Cache)
[ React UI re-renders Page ]
```

---

## 5. Security Architecture

### 5.1 JSON Web Tokens (JWT)
* Authentication uses **SimpleJWT** tokens.
* Successful login outputs:
  * `access`: 15-minute lifetime (used for authorization headers).
  * `refresh`: 7-day lifetime (used to claim new access keys).
* Backend validation uses a custom token parser class `CustomJWTAuthentication` that extracts payload fields (`user_id`, `role`, `email`) and checks them against the database.

### 5.2 Role-Based Access Control (RBAC)
User authorization scopes are defined by three roles:
* `customer`: Seekers who browse profiles, request bookings, and read notifications.
* `employer`: Gig workers who upload credentials, set daily rates, and accept bookings.
* `admin`: Staff who audit files and review verifications.

---

## 6. Observability & Telemetry

Blue Connect implements backend distributed tracing using **OpenTelemetry**:

* **Instrumentations**: Database connections (psycopg2), Django HTTP requests, and backend API handlers are tracked.
* **Exporter**: Traces are processed via `BatchSpanProcessor` and pushed as OpenTelemetry logs to Jaeger endpoints at `http://127.0.0.1:4318/v1/traces`.
* **Telemetry Core (`telemetry.py`)**: Initializes `TracerProvider`, configures endpoints, and launches instrumentation hooks on startup.
