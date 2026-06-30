# Blue Connect - Security Specification & Policy

This document details the security frameworks, policies, risks, and remediations for the Blue Connect platform.

---

## 1. Authentication Framework

Blue Connect uses token-based authentication via **JSON Web Tokens (JWT)**.

* **Backend Token Library**: `djangorestframework-simplejwt`
* **Signing Algorithm**: HMAC-SHA256
* **Token Lifetimes**:
  * Access Token: 15 minutes.
  * Refresh Token: 7 days.
* **Token Structure**:
  ```json
  {
    "token_type": "access",
    "exp": 1782398400,
    "jti": "5aefb...",
    "user_id": 12,
    "role": "customer",
    "email": "user@example.com"
  }
  ```

### Custom Authentication Handler (`CustomJWTAuthentication`)
To bridge JWT payloads with custom models, the backend defines `CustomJWTAuthentication` in `common/permissions/auth.py`.
It intercepts incoming requests, decodes the token, and resolves the identity using the payload's `role` claim:
* If `role == "customer"`: Fetches account from `Customer` model.
* If `role == "employer"`: Fetches account from `Employer` model.
* If `role == "admin"`: Fetches account from Django core `User` model.

---

## 2. Role-Based Access Control (RBAC)

The system restricts routes and features based on the logged-in user's role.
Role guards are defined in `common/permissions/roles.py`:
* `IsCustomerUser`: Allows access only to users with `role == "customer"`.
* `IsEmployerUser`: Allows access only to users with `role == "employer"`.
* `IsAdminUser`: Allows access only to users with `role == "admin"`.

| Module / Endpoint | Allowed Customer | Allowed Employer | Allowed Admin |
| :--- | :---: | :---: | :---: |
| Search verified providers (`/employer/verified-list/`) | **Yes** | No | No |
| Upload verification documents (`/verification/submit/`) | No | **Yes** | No |
| View upload documents (`/verification/admin/employer/<id>/`) | No | No | **Yes** |
| Approve/Reject worker verification | No | No | **Yes** |
| Delete Customer profiles | No | No | **Yes** |
| Accept/Reject hire requests | No | **Yes** | **Yes** |
| View job progress | **Yes** | **Yes** | **Yes** |
| Update job progress steps | No | **Yes** | **Yes** |

---

## 2.1 Object-Level Authorization (BOLA Protection)

Beyond role checks, the backend enforces fine-grained ownership validation on every protected endpoint.
These permission classes are defined in `common/permissions/ownership.py`:

* **`IsProfileOwner`**: Ensures the `email` query parameter matches the authenticated user's email.
* **`IsProfileOwnerOrAdmin`**: Same as above, but also allows admin users.
* **`IsHireRequestEmployer`**: Checks that the authenticated employer is the one assigned to the specific hire request.
* **`IsHireRequestEmployerOrAdmin`**: Same as above, but also allows admin users.
* **`IsConversationParticipant`**: Verifies the authenticated user is either the customer or employer on the hire request before allowing message access.
* **`IsMessageSenderAndParticipant`**: Validates that the `sender_email` in chat payloads matches the authenticated user AND the user is a participant in the hire request.

---

## 3. Password Security Policy

Password safety rules are enforced on both the client (via Yup schemas) and the backend (via `validate_password_policy` in `api/common/utils/password_validation.py`):

* **Minimum Length**: 8 characters.
* **Complexity Requirements**:
  * At least 1 uppercase letter (`A-Z`).
  * At least 1 lowercase letter (`a-z`).
  * At least 1 numeric digit (`0-9`).
  * At least 1 special symbol (e.g. `!@#$%^&*()`).

---

## 4. File Upload Security

Employers upload identity files (Face image, Aadhaar, PAN, and License) during KYC.

* **Storage Root**: Uploads are saved inside the `media/` folder.
* **Database Paths**:
  * Face Images: `media/verification/face/`
  * Aadhaar Images: `media/verification/aadhar/`
  * PAN Images: `media/verification/pan/`
  * License Images: `media/verification/licence/`
* **Vulnerabilities**: Currently, the server does not restrict uploaded files by size, MIME-type, or verify image magic bytes. This creates a risk where users could upload malicious files (e.g. HTML or shell scripts).

---

## 5. Network & Configuration Security Risks

### 5.1 Cross-Origin Resource Sharing (CORS)
In `settings.py`, the backend has:
```python
CORS_ALLOW_ALL_ORIGINS = True
```
* **Risk**: This setting allows any domain to make cross-origin requests to your API.
* **Remediation**: Before deploying to production, set `CORS_ALLOW_ALL_ORIGINS` to `False` and define `CORS_ALLOWED_ORIGINS` with your specific frontend domain.

### 5.2 Exposed Credentials & Secrets
* The Django project has a committed `.env` file containing production SendGrid keys and database credentials.
* The `SECRET_KEY` is hardcoded in `settings.py` as a fallback.
* **Remediation**: Remove the `.env` file from Git tracking using `.gitignore` and rotate the SendGrid API keys immediately. Use system environment variables on the production host instead of static files.
