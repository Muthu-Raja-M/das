import random
import traceback
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from common.utils.password_validation import validate_password_policy

from .models import EmailOTP
from .send_email import send_otp_to_email
from apps.customer.models import Customer
from apps.employer.models import Employer


@api_view(["POST"])
def send_otp(request):
    try:
        email = request.data.get("email", "").strip().lower()

        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_exists = (
            Customer.objects.filter(email=email).exists() or
            Employer.objects.filter(email=email).exists()
        )

        if not user_exists:
            return Response(
                {"error": "Email not registered"},
                status=status.HTTP_404_NOT_FOUND
            )

        otp = str(random.randint(100000, 999999))

        EmailOTP.objects.filter(email=email).delete()
        EmailOTP.objects.create(email=email, otp=otp)

        sent = send_otp_to_email(email, otp)

        if sent:
            return Response(
                {"message": "OTP sent successfully"},
                status=status.HTTP_200_OK
            )

        return Response(
            {"error": "Failed to send OTP"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    except Exception as e:
        print("SEND OTP ERROR:", str(e))
        traceback.print_exc()
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def verify_otp(request):
    try:
        email = request.data.get("email", "").strip().lower()
        otp = request.data.get("otp", "").strip()

        if not email or not otp:
            return Response(
                {"error": "Email and OTP are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        otp_obj = EmailOTP.objects.filter(email=email, otp=otp).last()

        if not otp_obj:
            return Response(
                {"error": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if otp_obj.is_expired():
            otp_obj.delete()
            return Response(
                {"error": "OTP expired"},
                status=status.HTTP_400_BAD_REQUEST
            )

        otp_obj.is_verified = True
        otp_obj.save()

        return Response(
            {"message": "OTP verified successfully"},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print("VERIFY OTP ERROR:", str(e))
        traceback.print_exc()
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def reset_password(request):
    try:
        email = request.data.get("email", "").strip().lower()
        new_password = request.data.get("new_password", "").strip()
        confirm_password = request.data.get("confirm_password", "").strip()

        if not email or not new_password or not confirm_password:
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return Response(
                {"error": "Passwords do not match"},
                status=status.HTTP_400_BAD_REQUEST
            )

        policy_error = validate_password_policy(new_password)
        if policy_error:
            return Response(
                {"error": policy_error},
                status=status.HTTP_400_BAD_REQUEST
            )

        otp_obj = EmailOTP.objects.filter(email=email, is_verified=True).last()

        if not otp_obj:
            return Response(
                {"error": "OTP not verified"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = Customer.objects.filter(email=email).first()
        if not user:
            user = Employer.objects.filter(email=email).first()

        if not user:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        user.password = make_password(new_password)
        user.save()

        EmailOTP.objects.filter(email=email).delete()

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print("RESET PASSWORD ERROR:", str(e))
        traceback.print_exc()
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )