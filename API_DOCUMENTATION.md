# Blue Connect - REST API Documentation

This document describes all API endpoints exposed by the Blue Connect backend service. All request and response bodies use JSON format. 

---

## Global API Configuration
* **Base URL**: `http://127.0.0.1:8000/api`
* **Content-Type**: `application/json`
* **Default Authentication**: Headers must include the JWT bearer token for protected routes:
  `Authorization: Bearer <access_token>`

---

## 1. Authentication Module (`/api/auth/`)

### 1.1 Login User
* **Route**: `/auth/login/`
* **Method**: `POST`
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Customer login success",
    "role": "customer",
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "access": "eyJhbGciOi...",
    "refresh": "eyJhbGciOi...",
    "user_id": 1
  }
  ```
* **Error Response (`401 Unauthorized`)**:
  ```json
  {
    "error": "Invalid email or password"
  }
  ```

### 1.2 Token Refresh
* **Route**: `/auth/refresh/`
* **Method**: `POST`
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "refresh": "eyJhbGciOi..."
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "access": "eyJhbGciOi...",
    "refresh": "eyJhbGciOi...",
    "role": "customer",
    "user_id": 1,
    "email": "user@example.com"
  }
  ```

### 1.3 Logout User
* **Route**: `/auth/logout/`
* **Method**: `POST`
* **Authentication**: None
* **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

## 2. Customer Module (`/api/customer/`)

### 2.1 Register Customer
* **Route**: `/customer/register/`
* **Method**: `POST`
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "fullname": "John Doe",
    "email": "customer@example.com",
    "phone": "9876543210",
    "aadhaar": "123456789012",
    "password": "Password123!"
  }
  ```
* **Success Response (`210 Created` / `201 Created`)**:
  ```json
  {
    "message": "Customer created successfully"
  }
  ```

### 2.2 Query Customer Profile
* **Route**: `/customer/profile/`
* **Method**: `GET`
* **Parameters**: `?email=customer@example.com`
* **Authentication**: None
* **Success Response (`200 OK`)**:
  ```json
  {
    "id": 1,
    "fullname": "John Doe",
    "email": "customer@example.com",
    "phone": "9876543210",
    "aadhaar": "123456789012",
    "role": "customer",
    "is_verified": false,
    "verification_status": "pending"
  }
  ```

---

## 3. Employer Module (`/api/employer/`)

### 3.1 Register Employer
* **Route**: `/employer/register/`
* **Method**: `POST`
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "username": "Jane ServiceProvider",
    "email": "employer@example.com",
    "phone": "9876543211",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "address": "123 Main Street",
    "job_role": "plumber",
    "experience": "5",
    "daily_rate": 500,
    "password": "Password123!"
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "message": "Employer created successfully"
  }
  ```

### 3.2 Fetch Verified Employers List
* **Route**: `/employer/verified-list/`
* **Method**: `GET`
* **Parameters** (Optional Filters): `?job_role=plumber&state=Tamil Nadu&district=Chennai`
* **Authentication**: None
* **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": 2,
      "username": "Jane ServiceProvider",
      "email": "employer@example.com",
      "phone": "9876543211",
      "state": "Tamil Nadu",
      "district": "Chennai",
      "job_role": "plumber",
      "experience": "5",
      "daily_rate": 500,
      "is_verified": true,
      "employer_id": "EMP0001"
    }
  ]
  ```

### 3.3 Query Employer Profile
* **Route**: `/employer/profile/`
* **Method**: `GET`
* **Parameters**: `?email=employer@example.com`
* **Authentication**: None
* **Success Response (`200 OK`)**:
  ```json
  {
    "id": 2,
    "username": "Jane ServiceProvider",
    "email": "employer@example.com",
    "phone": "9876543211",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "address": "123 Main Street",
    "job_role": "plumber",
    "experience": "5",
    "daily_rate": 500,
    "role": "employer",
    "profile_image": null,
    "is_verified": true,
    "employer_id": "EMP0001"
  }
  ```

### 3.4 Update Employer Profile
* **Route**: `/employer/update-profile/`
* **Method**: `PUT`
* **Parameters**: `?email=employer@example.com`
* **Request Body**:
  ```json
  {
    "name": "Jane UpdatedName",
    "phone": "9876543212",
    "job_role": "plumbing specialist",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "experience": "6",
    "daily_rate": 600
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Profile updated successfully"
  }
  ```

---

## 4. Verification Module (`/api/verification/`)

### 4.1 Submit Employer KYC
* **Route**: `/verification/submit/`
* **Method**: `POST`
* **Content-Type**: `multipart/form-data`
* **Authentication**: None
* **Request Body** (FormData):
  * `email`: (string)
  * `face_image`: (file attachment)
  * `aadhar_image`: (file attachment)
  * `pan_image`: (file attachment)
  * `driving_licence_image`: (file attachment)
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Documents submitted successfully and sent to admin",
    "data": {
      "id": 1,
      "status": "pending",
      "document_submitted": true
    }
  }
  ```

### 4.2 Admin Approve Verification
* **Route**: `/verification/admin/approve/<employer_id>/`
* **Method**: `POST`
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "admin_notes": "Verification complete. Documents approved."
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Employer approved successfully",
    "status": "approved",
    "alert_message": "Verification complete. Documents approved.",
    "employer_id": "EMP0001"
  }
  ```

---

## 5. Hire Request Module (`/api/hirerequest/`)

### 5.1 Create Hire Request
* **Route**: `/hirerequest/create/`
* **Method**: `POST`
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "customer_email": "customer@example.com",
    "employer_email": "employer@example.com",
    "job_role": "plumber",
    "message": "Need leak fixed in kitchen."
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "message": "Hire request sent successfully",
    "data": {
      "id": 5,
      "customer_email": "customer@example.com",
      "employer_email": "employer@example.com",
      "status": "pending"
    }
  }
  ```

### 5.2 Update Request Status
* **Route**: `/hirerequest/update/<request_id>/`
* **Method**: `PUT`
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "status": "accepted"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Request accepted successfully",
    "data": {
      "id": 5,
      "status": "accepted"
    }
  }
  ```

---

## 6. Messaging Module (`/api/messages/`)

### 6.1 Send Message
* **Route**: `/messages/send/`
* **Method**: `POST`
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "sender_email": "customer@example.com",
    "receiver_email": "employer@example.com",
    "hire_request_id": 5,
    "message": "Are you available tomorrow morning?"
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "message": "Message sent successfully",
    "data": {
      "id": 12,
      "message": "Are you available tomorrow morning?",
      "created_at": "2026-06-26T14:40:00Z"
    }
  }
  ```

### 6.2 Fetch Conversation History
* **Route**: `/messages/conversation/<hire_request_id>/`
* **Method**: `GET`
* **Authentication**: None
* **Success Response (`200 OK`)**:
  ```json
  {
    "hire_request_id": 5,
    "messages": [
      {
        "id": 12,
        "sender_email": "customer@example.com",
        "receiver_email": "employer@example.com",
        "message": "Are you available tomorrow morning?",
        "created_at": "2026-06-26T14:40:00Z"
      }
    ]
  }
  ```

---

## 7. Notifications Module (`/api/notifications/`)

### 7.1 Fetch Customer Notifications
* **Route**: `/notifications/customer/`
* **Method**: `GET`
* **Authentication**: JWT Token Required
* **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "title": "Hire Request Accepted",
      "message": "Your request has been approved.",
      "is_read": false
    }
  ]
  ```
