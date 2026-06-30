from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from common.permissions.auth import CustomJWTAuthentication
from common.permissions.roles import IsAdminUser
from django.db import transaction
import logging

from apps.customer.models import Customer
from apps.employer.models import Employer
from .serializers import (
    CustomerVerificationSerializer,
    EmployerVerificationSerializer,
)

logger = logging.getLogger(__name__)


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_customers(request):
    customers = Customer.objects.all().order_by("-id")
    serializer = CustomerVerificationSerializer(customers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_employers(request):
    employers = Employer.objects.all().order_by("-id")
    serializer = EmployerVerificationSerializer(employers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_customer(request, customer_id):
    try:
        with transaction.atomic():
            customer = Customer.objects.select_for_update().get(id=customer_id)
            customer_email = customer.email
            customer.delete()
            logger.info(
                "Security Audit Alert: Admin %s deleted Customer account with email %s (ID: %s)",
                request.user.email,
                customer_email,
                customer_id
            )
    except Customer.DoesNotExist:
        return Response(
            {"message": "Customer not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        {
            "success": True,
            "message": "Customer deleted successfully",
        },
        status=status.HTTP_200_OK
    )


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def dashboard_stats(request):
    total_customers = Customer.objects.count()
    total_employers = Employer.objects.count()
    verified_employers = Employer.objects.filter(is_verified=True).count()
    pending_employers = Employer.objects.filter(is_verified=False).count()

    return Response(
        {
            "total_customers": total_customers,
            "total_employers": total_employers,
            "verified_employers": verified_employers,
            "pending_employers": pending_employers,
        },
        status=status.HTTP_200_OK
    )