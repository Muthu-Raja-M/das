# Blue Connect - Database Design & Schema Guide

This document describes the database design, tables, relations, constraints, migration routines, and database maintenance operations for the Blue Connect platform.

---

## 1. Database Configuration

The backend is configured to connect to a **PostgreSQL** database engine. Development fallbacks can use **SQLite**.

### Connection Settings (`api/config/settings.py`)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'blue_connect_db',
        'USER': 'postgres',
        'PASSWORD': 'your_secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 2. Table Schemas & Models

The database contains 8 main tables:

### 2.1 Table: `customer_customer`
Stores account and credentials of service seekers.
* **Fields**:
  * `id`: BigInt (Primary Key, Auto-increment).
  * `fullname`: VarChar(100).
  * `email`: VarChar(254) (Unique constraint, used for logins).
  * `phone`: VarChar(15).
  * `aadhaar`: VarChar(12).
  * `password`: VarChar(255) (Django PBKDF2 hashed string).
  * `role`: VarChar(20) (Default: `"customer"`).
  * `is_verified`: Boolean.
  * `verification_status`: VarChar(20) (Default: `"pending"`).

### 2.2 Table: `employer_employer`
Stores profiles and rates of gig workers.
* **Fields**:
  * `id`: BigInt (Primary Key, Auto-increment).
  * `username`: VarChar(100).
  * `email`: VarChar(254) (Unique constraint, used for logins).
  * `phone`: VarChar(15).
  * `state`: VarChar(100).
  * `district`: VarChar(100).
  * `address`: TextField.
  * `job_role`: VarChar(100).
  * `experience`: VarChar(100).
  * `daily_rate`: Integer.
  * `password`: VarChar(255) (Django PBKDF2 hashed string).
  * `role`: VarChar(20) (Default: `"employer"`).
  * `profile_image`: VarChar(100) (Upload path: `employer_profiles/`, Nullable).
  * `is_verified`: Boolean (Default: `False`).
  * `employer_id`: VarChar(30) (Unique, format: `EMP0001`, Nullable).
  * `is_deleted`: Boolean (Default: `False`).
  * `delete_message`: TextField (Nullable).

### 2.3 Table: `verification_employerverification`
Stores uploads and decisions for employer verification audits.
* **Fields**:
  * `id`: BigInt (Primary Key, Auto-increment).
  * `employer_id`: BigInt (One-To-One Relationship to `employer_employer`, Foreign Key, Cascades on delete).
  * `face_image`: VarChar(100) (Upload path: `verification/face/`).
  * `aadhar_image`: VarChar(100) (Upload path: `verification/aadhar/`).
  * `pan_image`: VarChar(100) (Upload path: `verification/pan/`).
  * `driving_licence_image`: VarChar(100) (Upload path: `verification/licence/`).
  * `status`: VarChar(20) (Choices: `"pending"`, `"approved"`, `"rejected"`, Default: `"pending"`).
  * `admin_notes`: TextField (Nullable).
  * `submitted_at`: DateTime (Auto-add).
  * `approved_at`: DateTime (Nullable).
  * `employer_unique_id`: VarChar(30) (Unique, Nullable).
  * `is_alert_read`: Boolean (Default: `False`).
  * `is_alert_removed`: Boolean (Default: `False`).

### 2.4 Table: `hire_request_hirerequest`
Stores service booking requests.
* **Fields**:
  * `id`: BigInt (Primary Key, Auto-increment).
  * `customer_email`: VarChar(254) (Non-relational text reference).
  * `employer_email`: VarChar(254) (Non-relational text reference).
  * `job_role`: VarChar(100).
  * `message`: TextField (Blank allowed).
  * `status`: VarChar(20) (Default: `"pending"`).
  * `created_at`: DateTime (Auto-add).

### 2.5 Table: `hire_request_jobprogress`
Tracks the job lifecycle stepper progress for accepted hire requests.
* **Fields**:
  * `id`: BigInt (Primary Key, Auto-increment).
  * `hire_request_id`: BigInt (One-To-One Foreign Key referencing `hire_request_hirerequest`, Cascades on delete).
  * `step`: Integer (Default: `1`). Values: 1 = Work Accepted, 2 = Location Arrived, 3 = Work Completed, 4 = Payment Completed.
  * `accepted_at`: DateTime (Auto-add).
  * `arrived_at`: DateTime (Nullable).
  * `completed_at`: DateTime (Nullable).
  * `paid_at`: DateTime (Nullable).
  * `otp`: VarChar(6) (Nullable). 6-digit code for location arrival verification.
  * `otp_status`: VarChar(20) (Choices: `"generated"`, `"verified"`, `"expired"`, Default: `"generated"`).
  * `payment_amount`: Integer (Default: `0`).
  * `payment_status`: VarChar(20) (Choices: `"pending"`, `"paid"`, Default: `"pending"`).
  * `payment_method`: VarChar(50) (Default: `"Online"`).

### 2.5 Table: `messaging_chatmessage`
Stores messages between matched users.
* **Fields**:
  * `id`: BigInt (Primary Key, Auto-increment).
  * `sender_email`: VarChar(254).
  * `receiver_email`: VarChar(254).
  * `hire_request_id`: BigInt (Foreign Key referencing `hire_request_hirerequest`, Cascades on delete).
  * `message`: TextField.
  * `created_at`: DateTime (Auto-add).

### 2.6 Table: `notifications_notification`
Stores system alerts.
* **Fields**:
  * `id`: BigInt (Primary Key, Auto-increment).
  * `recipient_type`: VarChar(20) (Polymorphic: `"customer"` / `"employer"`).
  * `recipient_id`: Integer.
  * `sender_type`: VarChar(20).
  * `sender_id`: Integer.
  * `notification_type`: VarChar(20) (Choices: `"HIRE_REQUEST"`, `"HIRE_ACCEPTED"`, `"HIRE_REJECTED"`).
  * `title`: VarChar(150).
  * `message`: TextField.
  * `reference_id`: Integer (ID of associated HireRequest, Nullable).
  * `is_read`: Boolean (Default: `False`).
  * `is_deleted`: Boolean (Default: `False`).
  * `created_at`: DateTime (Auto-add).
  * `updated_at`: DateTime (Auto-update).

### 2.7 Table: `password_reset_emailotp`
Stores validation tokens for password resets.
* **Fields**:
  * `id`: BigInt (Primary Key, Auto-increment).
  * `email`: VarChar(254).
  * `otp`: VarChar(6).
  * `created_at`: DateTime (Auto-add).
  * `expires_at`: DateTime (Set to `created_at` + 5 minutes).
  * `is_verified`: Boolean (Default: `False`).

---

## 3. Relational Architecture Analysis

### Key Limitations
* **Implicit Connections**: Tables like `HireRequest` link to `Customer` and `Employer` profiles using raw email fields (`customer_email`, `employer_email`) instead of strict relational Foreign Keys. This was likely done to simplify early development, but it bypasses database-level constraints.
* **Integrity Risks**: Deleting or renaming a user's email in the customer or employer tables will leave orphaned rows in the `HireRequest` table, potentially causing database errors during joins or lookups.

---

## 4. Database Commands & Lifecycle

### Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Complete Database Reset
Wipe and reapply migration files:
```bash
# Enter database shell (psql)
DROP DATABASE blue_connect_db;
CREATE DATABASE blue_connect_db;
GRANT ALL PRIVILEGES ON DATABASE blue_connect_db TO postgres;

# Apply migration structures
python manage.py migrate
```

### Backup Schema and Data
Create a database backup SQL script:
```bash
pg_dump -U postgres -d blue_connect_db > backup_db.sql
```

### Restore Database
```bash
psql -U postgres -d blue_connect_db -f backup_db.sql
```
