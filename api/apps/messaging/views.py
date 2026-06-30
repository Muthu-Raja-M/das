from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from common.permissions.auth import CustomJWTAuthentication
from common.permissions.ownership import (
    IsProfileOwnerOrAdmin,
    IsMessageSenderAndParticipant,
    IsConversationParticipant
)
from django.db import transaction
import logging

from .models import ChatMessage
from .serializers import ChatMessageSerializer
from ..hire_request.models import HireRequest

logger = logging.getLogger(__name__)


@api_view(["POST"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsMessageSenderAndParticipant])
def send_message(request):
    sender_email = request.data.get("sender_email")
    receiver_email = request.data.get("receiver_email")
    hire_request_id = request.data.get("hire_request_id")
    message = request.data.get("message")

    if not sender_email:
        return Response({"error": "Sender email is required"}, status=status.HTTP_400_BAD_REQUEST)

    if not receiver_email:
        return Response({"error": "Receiver email is required"}, status=status.HTTP_400_BAD_REQUEST)

    if not hire_request_id:
        return Response({"error": "Hire request id is required"}, status=status.HTTP_400_BAD_REQUEST)

    if not message:
        return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            hire_request = HireRequest.objects.select_for_update().get(id=hire_request_id)

            if str(hire_request.status).lower() != "accepted":
                return Response(
                    {"error": "Messages are allowed only after request is accepted"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            chat = ChatMessage.objects.create(
                sender_email=sender_email.strip().lower(),
                receiver_email=receiver_email.strip().lower(),
                hire_request=hire_request,
                message=message.strip(),
            )

            logger.info("Security Audit Alert: Chat message sent by %s to %s for HireRequest %s", sender_email, receiver_email, hire_request_id)
    except HireRequest.DoesNotExist:
        return Response({"error": "Hire request not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ChatMessageSerializer(chat)

    return Response(
        {
            "message": "Message sent successfully",
            "data": serializer.data
        },
        status=status.HTTP_201_CREATED
    )


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsConversationParticipant])
def get_conversation(request, hire_request_id):
    try:
        hire_request = HireRequest.objects.get(id=hire_request_id)
    except HireRequest.DoesNotExist:
        return Response(
            {"error": "Hire request not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    messages = ChatMessage.objects.filter(
        hire_request=hire_request
    ).order_by("created_at")

    serializer = ChatMessageSerializer(messages, many=True)

    return Response(
        {
            "hire_request_id": hire_request.id,
            "messages": serializer.data
        },
        status=status.HTTP_200_OK
    )


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsProfileOwnerOrAdmin])
def get_employer_message_threads(request):
    employer_email = request.GET.get("email")

    if not employer_email:
        return Response({"error": "Employer email is required"}, status=status.HTTP_400_BAD_REQUEST)

    employer_email = employer_email.strip().lower()

    accepted_requests = HireRequest.objects.filter(
        employer_email__iexact=employer_email,
        status="accepted"
    ).order_by("-created_at")

    data = []
    for req in accepted_requests:
        last_message = ChatMessage.objects.filter(hire_request=req).order_by("-created_at").first()

        data.append({
            "hire_request_id": req.id,
            "customer_email": req.customer_email,
            "job_role": req.job_role,
            "status": req.status,
            "last_message": last_message.message if last_message else "",
            "last_message_time": last_message.created_at if last_message else None,
        })

    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsProfileOwnerOrAdmin])
def get_customer_message_threads(request):
    customer_email = request.GET.get("email")

    if not customer_email:
        return Response({"error": "Customer email is required"}, status=status.HTTP_400_BAD_REQUEST)

    customer_email = customer_email.strip().lower()

    accepted_requests = HireRequest.objects.filter(
        customer_email__iexact=customer_email,
        status="accepted"
    ).order_by("-created_at")

    data = []
    for req in accepted_requests:
        last_message = ChatMessage.objects.filter(hire_request=req).order_by("-created_at").first()

        data.append({
            "hire_request_id": req.id,
            "employer_email": req.employer_email,
            "job_role": req.job_role,
            "status": req.status,
            "last_message": last_message.message if last_message else "",
            "last_message_time": last_message.created_at if last_message else None,
        })

    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsProfileOwnerOrAdmin])
def get_customer_messages(request):
    customer_email = request.GET.get("customer_email", "").strip().lower()

    if not customer_email:
        return Response(
            {"error": "customer_email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    messages = ChatMessage.objects.filter(
        receiver_email__iexact=customer_email
    ).order_by("-created_at")

    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)