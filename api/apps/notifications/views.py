import logging
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from .models import Notification
from .serializers import NotificationSerializer
from common.permissions.auth import CustomJWTAuthentication
from apps.hire_request.models import HireRequest
from apps.customer.models import Customer
from apps.employer.models import Employer
from apps.messaging.models import ChatMessage

logger = logging.getLogger(__name__)

@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_employee_notifications(request):
    if request.user.role != "employer":
        return Response({"error": "Only employers/employees can access this endpoint"}, status=status.HTTP_403_FORBIDDEN)
    
    notifications = Notification.objects.filter(
        recipient_type="employer",
        recipient_id=request.user.id,
        is_deleted=False
    ).order_by("-created_at")
    
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_customer_notifications(request):
    if request.user.role != "customer":
        return Response({"error": "Only customers can access this endpoint"}, status=status.HTTP_403_FORBIDDEN)
    
    notifications = Notification.objects.filter(
        recipient_type="customer",
        recipient_id=request.user.id,
        is_deleted=False
    ).order_by("-created_at")
    
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["PATCH"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def mark_notification_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Strict ownership validation on notification endpoint
    if notification.recipient_type != request.user.role or notification.recipient_id != request.user.id:
        return Response({"error": "Unauthorized to access this notification"}, status=status.HTTP_403_FORBIDDEN)
    
    notification.is_read = True
    notification.save()
    
    serializer = NotificationSerializer(notification)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def accept_hire_request_api(request, request_id):
    try:
        with transaction.atomic():
            try:
                hire_request = HireRequest.objects.select_for_update().get(id=request_id)
            except HireRequest.DoesNotExist:
                return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

            # Validate ownership on the hire request
            if request.user.role != "employer" or hire_request.employer_email != request.user.email:
                return Response({"error": "Unauthorized to accept this request"}, status=status.HTTP_403_FORBIDDEN)

            # Prevent duplicate accept/reject actions by validating pending status
            if hire_request.status != "pending":
                return Response({"error": "Request is not pending"}, status=status.HTTP_400_BAD_REQUEST)

            hire_request.status = "accepted"
            hire_request.save()

            # Mark corresponding HIRE_REQUEST notifications for this employer as read
            Notification.objects.filter(
                recipient_type="employer",
                recipient_id=request.user.id,
                reference_id=hire_request.id,
                notification_type="HIRE_REQUEST"
            ).update(is_read=True)

            # Create ChatMessage (Keep existing behavior)
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

            # Create Customer Notification
            try:
                customer = Customer.objects.filter(email=hire_request.customer_email).first()
                employer = Employer.objects.filter(email=hire_request.employer_email).first()
                if customer and employer:
                    Notification.objects.create(
                        recipient_type="customer",
                        recipient_id=customer.id,
                        sender_type="employer",
                        sender_id=employer.id,
                        notification_type="HIRE_ACCEPTED",
                        title="Hire Request Accepted",
                        message=f"Your hire request has been accepted by {employer.username}.",
                        reference_id=hire_request.id
                    )
            except Exception as ex:
                logger.exception("Notification creation failed on accept action: %s", ex)

            return Response({
                "message": "Request accepted successfully",
                "data": {
                    "id": hire_request.id,
                    "status": hire_request.status
                }
            }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error accepting hire request: %s", e)
        return Response({"error": "An error occurred during status update"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def reject_hire_request_api(request, request_id):
    try:
        with transaction.atomic():
            try:
                hire_request = HireRequest.objects.select_for_update().get(id=request_id)
            except HireRequest.DoesNotExist:
                return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

            # Validate ownership on the hire request
            if request.user.role != "employer" or hire_request.employer_email != request.user.email:
                return Response({"error": "Unauthorized to reject this request"}, status=status.HTTP_403_FORBIDDEN)

            # Prevent duplicate accept/reject actions by validating pending status
            if hire_request.status != "pending":
                return Response({"error": "Request is not pending"}, status=status.HTTP_400_BAD_REQUEST)

            hire_request.status = "rejected"
            hire_request.save()

            # Mark corresponding HIRE_REQUEST notifications for this employer as read
            Notification.objects.filter(
                recipient_type="employer",
                recipient_id=request.user.id,
                reference_id=hire_request.id,
                notification_type="HIRE_REQUEST"
            ).update(is_read=True)

            # Create Customer Notification
            try:
                customer = Customer.objects.filter(email=hire_request.customer_email).first()
                employer = Employer.objects.filter(email=hire_request.employer_email).first()
                if customer and employer:
                    Notification.objects.create(
                        recipient_type="customer",
                        recipient_id=customer.id,
                        sender_type="employer",
                        sender_id=employer.id,
                        notification_type="HIRE_REJECTED",
                        title="Hire Request Rejected",
                        message=f"Your hire request has been rejected by {employer.username}.",
                        reference_id=hire_request.id
                    )
            except Exception as ex:
                logger.exception("Notification creation failed on reject action: %s", ex)

            return Response({
                "message": "Request rejected successfully",
                "data": {
                    "id": hire_request.id,
                    "status": hire_request.status
                }
            }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error rejecting hire request: %s", e)
        return Response({"error": "An error occurred during status update"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def mark_all_notifications_as_read(request):
    try:
        Notification.objects.filter(
            recipient_type=request.user.role,
            recipient_id=request.user.id,
            is_read=False,
            is_deleted=False
        ).update(is_read=True)
        return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error marking all notifications as read: %s", e)
        return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

