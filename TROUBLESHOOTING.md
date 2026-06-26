# Blue Connect - Troubleshooting Manual

This guide describes how to diagnose and resolve common setup issues, runtime errors, and deployment blockers in the Blue Connect project.

---

## 1. Backend Application Errors

### 1.1 `ModuleNotFoundError: No module named '...'`
* **Symptom**: Starting the server throws `ModuleNotFoundError` for packages like `django` or `rest_framework`.
* **Causes**:
  * The Python virtual environment is not activated.
  * Dependencies have not been installed.
* **Resolution**:
  1. Make sure your shell prompt is prefixed with `(.venv)`. If not, activate the virtual environment:
     * **Windows**: `.venv\Scripts\Activate.ps1`
     * **Linux**: `source .venv/bin/activate`
  2. Install requirements:
     ```bash
     pip install -r requirements.txt
     ```

### 1.2 Database Connection Failures
* **Symptom**: Runserver or migrate commands fail with:
  `connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused`
* **Causes**:
  * The PostgreSQL service is not running on your local machine.
  * DB credentials inside `.env` (password, database name, port) do not match PostgreSQL.
* **Resolution**:
  1. Verify the PostgreSQL service is active:
     * **Windows**: Open `services.msc`, locate **postgresql**, and verify its status is "Running".
     * **Linux**: Run `sudo systemctl status postgresql`.
  2. Verify credentials in your `.env` file match your database setup.

### 1.3 Django Migration Errors
* **Symptom**: `django.db.utils.OperationalError` or out-of-sync database exceptions during backend startup.
* **Causes**:
  * Local models have changes that have not been compiled into migration files, or migration files in the repo conflict with your database state.
* **Resolution**:
  If developing locally, you can safely wipe and reapply migrations:
  ```bash
  # Delete and recreate database
  # Run commands from the api/ folder:
  python manage.py makemigrations
  python manage.py migrate
  ```

---

## 2. Frontend Application Errors

### 2.1 `npm install` Dependency Conflicts
* **Symptom**: Running `npm install` fails with conflict warnings regarding React 19 and peer dependencies.
* **Causes**:
  * Node v18+ is used with legacy packages that have not updated their peer dependency declarations.
* **Resolution**:
  Install packages using the legacy peer deps flag:
  ```bash
  npm install --legacy-peer-deps
  ```

### 2.2 Port Already in Use (`8000` or `5173`)
* **Symptom**: Starting runserver or npm run dev fails because the default port is occupied.
* **Resolution**:
  * **Windows**: Run the following in Command Prompt to find and end the process using the port:
    ```cmd
    netstat -ano | findstr :8000
    taskkill /PID <PID> /F
    ```
  * **Linux**:
    ```bash
    sudo kill -9 $(lsof -t -i:8000)
    ```

---

## 3. Security & Integration Failures

### 3.1 `401 Unauthorized` / Invalid Token Error
* **Symptom**: Requests return `401 Unauthorized` even after logging in.
* **Causes**:
  * Stale JWT tokens are cached in the browser.
  * The backend `SECRET_KEY` was rotated, invalidating existing tokens.
* **Resolution**:
  Clear browser storage. Open your browser's Developer Tools (`F12`), go to the **Application** tab, click **Clear site data**, and reload (`Ctrl + F5`).

### 3.2 CORS Errors in Browser Console
* **Symptom**: Console shows `Access to XMLHttpRequest at ... has been blocked by CORS policy`.
* **Causes**:
  * The backend CORS settings restrict requests from your frontend domain.
* **Resolution**:
  Make sure `corsheaders` is in `INSTALLED_APPS` and settings contain:
  ```python
  CORS_ALLOW_ALL_ORIGINS = True
  ```

### 3.3 SendGrid Email Dispatch Failures
* **Symptom**: Requesting a password reset OTP fails, and backend prints:
  `SendGrid error: Unauthorized (401)`
* **Causes**:
  * The SendGrid API key or default sender email is invalid or unverified.
* **Resolution**:
  1. Make sure your SendGrid API key in `.env` is correct.
  2. Verify that `FROM_EMAIL` matches a Sender Identity verified in your SendGrid console.

### 3.4 OpenTelemetry Telemetry Failures
* **Symptom**: Backend startup logs output trace connection timeouts:
  `Failed to export batch: connection timed out`
* **Causes**:
  * The backend is trying to push trace telemetry but the Jaeger server is offline.
* **Resolution**:
  Jaeger must be running locally. If you do not need tracing for local development, you can safely comment out `telemetry.py` imports inside `manage.py` and `wsgi.py`.
