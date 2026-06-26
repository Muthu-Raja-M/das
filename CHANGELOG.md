# Changelog

All notable changes to the Blue Connect project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
