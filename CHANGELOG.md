# Changelog

All notable changes to the Blue Connect project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-06-30

This release adds the Job Progress Tracker, centralized security permissions, enriched API serializers, and critical database alignment fixes.

### Added
* **Job Progress Tracker**: Full 4-step vertical stepper workflow (Work Accepted → Location Arrived → Work Completed → Payment Completed) visible to both Customer and Employer dashboards.
* **OTP Location Verification**: 6-digit OTP auto-generated on job acceptance; employer must verify OTP to confirm arrival at the customer's location.
* **Payment Submission**: Employer can submit payment amount and method to complete job lifecycle.
* **Centralized Permissions Layer** (`common/permissions/`):
  * `auth.py`: `CustomJWTAuthentication` and `AuthenticatedUser` wrapper.
  * `roles.py`: `IsAdminUser`, `IsCustomerUser`, `IsEmployerUser` role guards.
  * `ownership.py`: Object-level BOLA validators (`IsProfileOwner`, `IsHireRequestEmployer`, `IsConversationParticipant`, `IsMessageSenderAndParticipant`).
* **Enriched HireRequest Serializer**: Added `employer_name` and `customer_name` computed fields so dashboards display human-readable names instead of raw email addresses.
* **Employer Stats Cards**: Dashboard stat cards showing total jobs, completed jobs, pending/accepted/rejected request counts.
* **Notification Bell Dropdown**: Unified notification bell component with employer verification alerts and real-time badge counts.

### Fixed
* **Database Schema Mismatch**: Dropped orphaned review columns (`customer_review_submitted`, `employer_review_submitted`, etc.) from `hire_request_jobprogress` table and removed the dangling `reviews_jobreview` table that caused `IntegrityError` on job acceptance.
* **500 Internal Server Error on Accept**: Resolved `null value in column "customer_review_submitted"` error when employers accepted hire requests.
* **Foreign Key Violation**: Removed `reviews_jobreview` FK constraint that blocked hire request deletions.

### Changed
* **API Documentation**: Updated `API_DOCUMENTATION.md` with Job Progress endpoints, OTP verification, and payment submission.
* **Database Documentation**: Updated `DATABASE.md` with `JobProgress` table schema.
* **Security Documentation**: Updated `SECURITY.md` with BOLA permission classes.
* **README**: Updated features, folder structure, API overview, database diagram, and future roadmap.

---

## [1.0.0] - 2026-06-26

This is the initial feature release of the Blue Connect platform, supporting core authentication, user profile management, KYC document verifications, hiring bookings, and direct messaging workflows.

### Added
* **Backend Framework**: Built the API service using Django REST Framework (DRF) and PostgreSQL.
* **Authentication**: Integrated SimpleJWT for token-based logins, refreshes, and access management.
* **Dual Roles**: Added Customer and Employer registration, profile details, and update endpoints.
* **KYC Verification**: Created an EmployerVerification model and media upload endpoints for Face, Aadhaar, PAN, and License images.
* **Admin Controls**: Built verification review actions (`admin_approve_verification`, `admin_reject_verification`) and customer profile deletion features.
* **Hiring Workflow**: Added booking request creation, status updates, and automatic conversation triggers.
* **Messaging**: Implemented in-app text messaging between verified employers and customers.
* **Notifications**: Set up real-time in-app notification boards for booking request events.
* **OpenTelemetry Tracing**: Appended database (psycopg2) and server (django) distributed tracing middleware.
* **Documentation**: Generated project documentation files:
  * `README.md`
  * `SETUP_COMPLETE.md`
  * `API_DOCUMENTATION.md`
  * `ARCHITECTURE.md`
  * `DATABASE.md`
  * `SECURITY.md`
  * `TROUBLESHOOTING.md`
  * `clear_browser_storage.md`
  * `CONTRIBUTING.md`
  * `CHANGELOG.md`
  * `LICENSE`
  * `.env.example`
  * `requirements.txt`
