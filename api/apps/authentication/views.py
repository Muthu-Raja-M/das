# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth.hashers import check_password
# from customer.models import Customer
# from employer.models import Employer


# @api_view(["POST"])
# def login_user(request):
#     email = request.data.get("email", "").strip().lower()
#     password = request.data.get("password", "")

#     # ADMIN LOGIN
#     if email == "admin@blueconnect.com" and password == "admin123":
#         return Response({
#             "message": "Admin login success",
#             "role": "admin",
#             "name": "Admin",
#             "email": email
#         }, status=status.HTTP_200_OK)

#     # CUSTOMER LOGIN
#     try:
#         customer = Customer.objects.get(email=email)
#         if check_password(password, customer.password):
#             return Response({
#                 "message": "Customer login success",
#                 "role": "customer",
#                 "id": customer.id,
#                 "name": customer.fullname,
#                 "email": customer.email
#             }, status=status.HTTP_200_OK)
#     except Customer.DoesNotExist:
#         pass

#     # EMPLOYER LOGIN
#     try:
#         employer = Employer.objects.get(email=email)
#         if check_password(password, employer.password):
#             return Response({
#                 "message": "Employer login success",
#                 "role": "employer",
#                 "id": employer.id,
#                 "name": employer.username,
#                 "email": employer.email
#             }, status=status.HTTP_200_OK)
#     except Employer.DoesNotExist:
#         pass

#     return Response(
#         {"error": "Invalid email or password"},
#         status=status.HTTP_401_UNAUTHORIZED
#     )
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from apps.customer.models import Customer
from apps.employer.models import Employer

# OpenTelemetry import
from opentelemetry import trace


tracer = trace.get_tracer("blueconnect")


def get_tokens_for_user(user_id, role, email):
    refresh = RefreshToken()
    refresh['user_id'] = user_id
    refresh['role'] = role
    refresh['email'] = email
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(["POST"])
def login_user(request):

    # Main custom span
    with tracer.start_as_current_span("login_user_api") as span:

        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        # Add attributes (Tags)
        span.set_attribute("login.email", email)
        span.set_attribute("http.method", "POST")


        # ADMIN LOGIN
        with tracer.start_as_current_span("admin_login") as admin_span:

            if not User.objects.filter(is_staff=True).exists():
                User.objects.create_superuser(
                    username="admin",
                    email="admin@blueconnect.com",
                    password="admin123"
                )

            admin_user = User.objects.filter(email=email, is_staff=True).first()
            if admin_user and admin_user.check_password(password):

                admin_span.set_attribute("user.role", "admin")
                admin_span.set_attribute("login.status", "success")

                span.add_event("Admin login successful")

                tokens = get_tokens_for_user(admin_user.id, "admin", email)

                return Response({
                    "message": "Admin login success",
                    "role": "admin",
                    "name": "Admin",
                    "email": email,
                    "access": tokens["access"],
                    "refresh": tokens["refresh"],
                    "user_id": admin_user.id,
                })


        # CUSTOMER LOGIN
        with tracer.start_as_current_span("customer_login") as customer_span:

            try:
                customer = Customer.objects.get(email=email)

                customer_span.set_attribute(
                    "db.customer_found",
                    True
                )


                if check_password(password, customer.password):

                    customer_span.set_attribute(
                        "user.role",
                        "customer"
                    )

                    customer_span.set_attribute(
                        "login.status",
                        "success"
                    )

                    tokens = get_tokens_for_user(customer.id, "customer", email)

                    return Response({
                        "message": "Customer login success",
                        "role": "customer",
                        "id": customer.id,
                        "name": customer.fullname,
                        "email": customer.email,
                        "access": tokens["access"],
                        "refresh": tokens["refresh"],
                        "user_id": customer.id,
                    })


            except Customer.DoesNotExist:

                customer_span.set_attribute(
                    "db.customer_found",
                    False
                )


        # EMPLOYER LOGIN
        with tracer.start_as_current_span("employer_login") as employer_span:

            try:
                employer = Employer.objects.get(email=email)


                if check_password(password, employer.password):

                    employer_span.set_attribute(
                        "user.role",
                        "employer"
                    )

                    employer_span.set_attribute(
                        "login.status",
                        "success"
                    )

                    tokens = get_tokens_for_user(employer.id, "employer", email)

                    return Response({
                        "message": "Employer login success",
                        "role": "employer",
                        "id": employer.id,
                        "name": employer.username,
                        "email": employer.email,
                        "access": tokens["access"],
                        "refresh": tokens["refresh"],
                        "user_id": employer.id,
                    })


            except Employer.DoesNotExist:

                employer_span.set_attribute(
                    "db.employer_found",
                    False
                )


        # Failure
        span.set_attribute(
            "login.status",
            "failed"
        )

        span.add_event(
            "Invalid email or password"
        )


        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
def token_refresh(request):
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refresh = RefreshToken(refresh_token)
        user_id = refresh.payload.get("user_id")
        role = refresh.payload.get("role")
        email = refresh.payload.get("email")

        new_access = str(refresh.access_token)

        return Response({
            "access": new_access,
            "refresh": refresh_token,
            "role": role,
            "user_id": user_id,
            "email": email
        }, status=status.HTTP_200_OK)
    except Exception:
        return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def logout_user(request):
    # Since permissions are not applied and blacklist db migration is avoided, simply return success response
    return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)