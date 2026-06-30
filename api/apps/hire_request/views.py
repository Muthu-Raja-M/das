from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from common.permissions.auth import CustomJWTAuthentication
from common.permissions.roles import IsCustomerUser
from common.permissions.ownership import (
    IsProfileOwnerOrAdmin,
    IsHireRequestEmployerOrAdmin,
    IsConversationParticipant
)
from django.db import transaction
from django.utils import timezone
import logging
import random

from .models import HireRequest, JobProgress
from .serializers import HireRequestSerializer, JobProgressSerializer
from apps.messaging.models import ChatMessage

logger = logging.getLogger(__name__)


@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsCustomerUser])
def create_hire_request(request):
    try:
        with transaction.atomic():
            serializer = HireRequestSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                logger.info(
                    "Security Audit Alert: Customer %s created a hire request for Employer %s",
                    request.user.email,
                    request.data.get("employer_email")
                )
                return Response(
                    {
                        "message": "Hire request sent successfully",
                        "data": serializer.data
                    },
                    status=status.HTTP_201_CREATED
                )
    except Exception as e:
        logger.exception("Error creating hire request: %s", e)
        return Response({"error": "Failed to create hire request"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsProfileOwnerOrAdmin])
def get_employer_requests(request):
    email = request.GET.get("email")

    if not email:
        return Response(
            {"error": "Employer email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    requests = HireRequest.objects.filter(
        employer_email=email
    ).order_by('-created_at')

    serializer = HireRequestSerializer(requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsHireRequestEmployerOrAdmin])
def update_request_status(request, request_id):
    try:
        with transaction.atomic():
            hire_request = HireRequest.objects.select_for_update().get(id=request_id)
            status_value = request.data.get("status", "").strip().lower()

            print("STATUS RECEIVED:", status_value)
            print("REQUEST ID:", request_id)

            if status_value not in ["accepted", "rejected", "completed"]:
                return Response(
                    {"error": "Invalid status"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            hire_request.status = status_value
            hire_request.save()

            if status_value == "accepted":
                already_exists = ChatMessage.objects.filter(
                    hire_request=hire_request,
                    sender_email=hire_request.employer_email,
                    receiver_email=hire_request.customer_email,
                    message__icontains="accepted"
                ).exists()

                if not already_exists:
                    ChatMessage.objects.create(
                        hire_request=hire_request,
                        sender_email=hire_request.employer_email,
                        receiver_email=hire_request.customer_email,
                        message=f"Your hire request for {hire_request.job_role} has been accepted by the employer."
                    )

            logger.info("Security Audit Alert: User %s updated HireRequest %s status to %s", request.user.email, request_id, status_value)
    except HireRequest.DoesNotExist:
        return Response(
            {"error": "Request not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        {
            "message": f"Request {status_value} successfully",
            "data": HireRequestSerializer(hire_request).data
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsProfileOwnerOrAdmin])
def get_employer_stats(request):
    email = request.GET.get("email")

    if not email:
        return Response(
            {"error": "Employer email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    queryset = HireRequest.objects.filter(employer_email=email)

    total_jobs = queryset.count()
    completed_jobs = queryset.filter(status="completed").count()
    pending_requests = queryset.filter(status="pending").count()
    accepted_requests = queryset.filter(status="accepted").count()
    rejected_requests = queryset.filter(status="rejected").count()

    return Response(
        {
            "total_jobs": total_jobs,
            "completed_jobs": completed_jobs,
            "pending_requests": pending_requests,
            "accepted_requests": accepted_requests,
            "rejected_requests": rejected_requests,
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsProfileOwnerOrAdmin])
def get_customer_requests(request):
    email = request.GET.get("email")

    if not email:
        return Response(
            {"error": "Customer email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    requests = HireRequest.objects.filter(
        customer_email=email
    ).order_by('-created_at')

    serializer = HireRequestSerializer(requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsConversationParticipant])
def get_job_progress(request, hire_request_id):
    try:
        hire_request = HireRequest.objects.get(id=hire_request_id)
    except HireRequest.DoesNotExist:
        return Response({"error": "Hire request not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        progress = hire_request.progress
    except JobProgress.DoesNotExist:
        if hire_request.status == "accepted":
            otp_code = f"{random.randint(100000, 999999)}"
            progress = JobProgress.objects.create(
                hire_request=hire_request,
                otp=otp_code,
                otp_status="generated"
            )
        else:
            return Response({"error": "Job progress not initiated (request not accepted yet)"}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobProgressSerializer(progress)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsHireRequestEmployerOrAdmin])
def update_job_progress(request, request_id):
    try:
        with transaction.atomic():
            hire_request = HireRequest.objects.select_for_update().get(id=request_id)
            progress = JobProgress.objects.select_for_update().get(hire_request=hire_request)

            step = int(request.data.get("step"))
            if step not in [3]:  # Step 3: Complete Work (Step 2 is verify-otp, Step 4 is submit-payment)
                return Response({"error": "Invalid step transition. Use verify-otp for step 2 and submit-payment for step 4."}, status=status.HTTP_400_BAD_REQUEST)

            if step == 3:
                if progress.step != 2:
                    return Response({"error": "Must reach location (step 2) before completing work"}, status=status.HTTP_400_BAD_REQUEST)
                progress.step = 3
                progress.completed_at = timezone.now()
                progress.save()
                logger.info("Security Audit Alert: Employer %s marked HireRequest %s as WORK COMPLETED", request.user.email, request_id)
    except HireRequest.DoesNotExist:
        return Response({"error": "Hire request not found"}, status=status.HTTP_404_NOT_FOUND)
    except JobProgress.DoesNotExist:
        return Response({"error": "Job progress not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(JobProgressSerializer(progress).data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsHireRequestEmployerOrAdmin])
def verify_job_otp(request, request_id):
    try:
        with transaction.atomic():
            hire_request = HireRequest.objects.select_for_update().get(id=request_id)
            progress = JobProgress.objects.select_for_update().get(hire_request=hire_request)

            if progress.step != 1:
                return Response({"error": "OTP already verified or work completed"}, status=status.HTTP_400_BAD_REQUEST)

            otp_entered = request.data.get("otp", "").strip()
            if progress.otp == otp_entered:
                progress.step = 2
                progress.otp_status = "verified"
                progress.arrived_at = timezone.now()
                progress.save()
                logger.info("Security Audit Alert: Employer %s verified OTP for HireRequest %s successfully", request.user.email, request_id)
                return Response(JobProgressSerializer(progress).data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid OTP. Please check with the customer."}, status=status.HTTP_400_BAD_REQUEST)
    except HireRequest.DoesNotExist:
        return Response({"error": "Hire request not found"}, status=status.HTTP_404_NOT_FOUND)
    except JobProgress.DoesNotExist:
        return Response({"error": "Job progress not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsHireRequestEmployerOrAdmin])
def submit_job_payment(request, request_id):
    try:
        with transaction.atomic():
            hire_request = HireRequest.objects.select_for_update().get(id=request_id)
            progress = JobProgress.objects.select_for_update().get(hire_request=hire_request)

            if progress.step != 3:
                return Response({"error": "Work must be marked completed (step 3) before submitting payment"}, status=status.HTTP_400_BAD_REQUEST)

            amount = request.data.get("payment_amount")
            method = request.data.get("payment_method", "Online")

            if not amount or int(amount) <= 0:
                return Response({"error": "Valid payment amount is required"}, status=status.HTTP_400_BAD_REQUEST)

            progress.step = 4
            progress.payment_amount = int(amount)
            progress.payment_status = "paid"
            progress.payment_method = method
            progress.paid_at = timezone.now()
            progress.save()

            hire_request.status = "completed"
            hire_request.save()

            logger.info("Security Audit Alert: Employer %s submitted payment of ₹%s for HireRequest %s", request.user.email, amount, request_id)
            return Response(JobProgressSerializer(progress).data, status=status.HTTP_200_OK)
    except HireRequest.DoesNotExist:
        return Response({"error": "Hire request not found"}, status=status.HTTP_404_NOT_FOUND)
    except JobProgress.DoesNotExist:
        return Response({"error": "Job progress not found"}, status=status.HTTP_404_NOT_FOUND)