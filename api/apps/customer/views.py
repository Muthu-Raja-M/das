from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Customer
from .serializers import CustomerSerializer
from apps.employer.models import Employer


def email_exists_in_any_table(email):
    return (
        Customer.objects.filter(email=email).exists() or
        Employer.objects.filter(email=email).exists()
    )


@api_view(['POST'])
def create_customer(request):
    data = request.data.copy()

    email = data.get("email", "").strip().lower()
    data["email"] = email

    if not email:
        return Response(
            {"error": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if email_exists_in_any_table(email):
        return Response(
            {"error": "Email already registered in customer or employer account"},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = CustomerSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Customer created successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_customers(request):
    customers = Customer.objects.all()
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_customer_profile(request):
    email = request.GET.get("email", "").strip().lower()

    if not email:
        return Response(
            {"error": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        customer = Customer.objects.get(email=email)
    except Customer.DoesNotExist:
        return Response(
            {"error": "Customer not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CustomerSerializer(customer)
    return Response(serializer.data, status=status.HTTP_200_OK)