from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from apps.customer.models import Customer
from apps.employer.models import Employer
from .serializers import (
    CustomerVerificationSerializer,
    EmployerVerificationSerializer,
)


@api_view(["GET"])
def get_all_customers(request):
    customers = Customer.objects.all().order_by("-id")
    serializer = CustomerVerificationSerializer(customers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_all_employers(request):
    employers = Employer.objects.all().order_by("-id")
    serializer = EmployerVerificationSerializer(employers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
def delete_customer(request, customer_id):
    try:
        customer = Customer.objects.get(id=customer_id)
    except Customer.DoesNotExist:
        return Response(
            {"message": "Customer not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    customer.delete()

    return Response(
        {
            "success": True,
            "message": "Customer deleted successfully",
        },
        status=status.HTTP_200_OK
    )


@api_view(["GET"])
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