from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import EmployerSerializer
from .models import Employer
from apps.customer.models import Customer
from apps.verification.models import EmployerVerification


def email_exists_in_any_table(email):
    return (
        Customer.objects.filter(email=email).exists() or
        Employer.objects.filter(email=email).exists()
    )


@api_view(["POST"])
def create_employer(request):
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

    serializer = EmployerSerializer(data=data, context={"request": request})

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Employer created successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ADMIN USE (all employers)
@api_view(["GET"])
def get_employer_list(request):
    employers = Employer.objects.filter(is_deleted=False).order_by("-id")

    data = []
    for employer in employers:
        data.append({
            "id": employer.id,
            "username": employer.username,
            "email": employer.email,
            "phone": employer.phone,
            "state": employer.state,
            "district": employer.district,
            "job_role": employer.job_role,
            "is_verified": employer.is_verified,
            "employer_id": employer.employer_id,
            "document_submitted": hasattr(employer, "verification"),
            "verification_status": employer.verification.status if hasattr(employer, "verification") else "not_submitted",
        })

    return Response(data)


# CUSTOMER USE (ONLY VERIFIED)
@api_view(["GET"])
def get_verified_employer_list(request):

    employers = Employer.objects.filter(
        is_verified=True,
        is_deleted=False
    )

    job_role = request.GET.get("job_role")
    state = request.GET.get("state")
    district = request.GET.get("district")


    if job_role:
        employers = employers.filter(
            job_role__iexact=job_role
        )

    if state:
        employers = employers.filter(
            state__iexact=state
        )

    if district:
        employers = employers.filter(
            district__iexact=district
        )


    employers = employers.order_by("-id")


    data = []

    for employer in employers:
        data.append({
            "id": employer.id,
            "username": employer.username,
            "email": employer.email,
            "phone": employer.phone,
            "state": employer.state,
            "district": employer.district,
            "job_role": employer.job_role,
            "experience": employer.experience,
            "daily_rate": employer.daily_rate,
            "is_verified": employer.is_verified,
            "employer_id": employer.employer_id,
        })


    return Response(data)


def generate_employer_id():
    last_employer = Employer.objects.exclude(
        employer_id__isnull=True
    ).exclude(
        employer_id=""
    ).order_by("-id").first()

    if last_employer and last_employer.employer_id:
        try:
            last_number = int(last_employer.employer_id.replace("EMP", ""))
            new_number = last_number + 1
        except ValueError:
            new_number = 1
    else:
        new_number = 1

    return f"EMP{new_number:04d}"


@api_view(["PATCH"])
def verify_employer(request, id):
    action = request.data.get("action")

    try:
        employer = Employer.objects.get(id=id)
    except Employer.DoesNotExist:
        return Response(
            {"message": "Employer not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    verification = EmployerVerification.objects.filter(employer=employer).first()
    document_exists = verification is not None

    if action == "approve":
        if not document_exists:
            return Response(
                {"message": "Cannot approve. Employer has not submitted documents."},
                status=status.HTTP_400_BAD_REQUEST
            )

        employer.is_verified = True

        if not employer.employer_id:
            employer.employer_id = generate_employer_id()

        employer.save()

        if verification:
            verification.status = "approved"
            verification.employer_unique_id = employer.employer_id
            verification.save()

        return Response(
            {
                "success": True,
                "message": "Employer approved successfully",
                "employer_id": employer.employer_id,
            },
            status=status.HTTP_200_OK
        )

    if action == "reject":
        employer.is_verified = False
        employer.save()

        if verification:
            verification.status = "rejected"
            verification.save()

        return Response(
            {
                "success": True,
                "message": "Employer rejected successfully",
            },
            status=status.HTTP_200_OK
        )

    if action == "delete":
        employer.is_deleted = True
        employer.is_verified = False
        employer.delete_message = request.data.get("delete_message") or ""
        employer.save()

        if verification:
            verification.status = "rejected"
            verification.save()

        return Response(
            {
                "success": True,
                "message": "Employer deleted successfully",
            },
            status=status.HTTP_200_OK
        )

    return Response(
        {"message": "Invalid action"},
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
def get_employer_profile(request):
    email = request.GET.get("email", "").strip().lower()

    if not email:
        return Response(
            {"error": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        employer = Employer.objects.get(email=email)
        serializer = EmployerSerializer(employer, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Employer.DoesNotExist:
        return Response(
            {"error": "Employer not found"},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(["GET"])
def get_employer_detail(request, employer_id):
    try:
        employer = Employer.objects.get(id=employer_id)
        serializer = EmployerSerializer(employer, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Employer.DoesNotExist:
        return Response(
            {"error": "Worker not found"},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(["PUT"])
def update_employer_profile(request):
    email = request.GET.get("email")

    if not email:
        return Response(
            {"error": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        employer = Employer.objects.get(email=email)
    except Employer.DoesNotExist:
        return Response(
            {"error": "Employer not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    employer.username = request.data.get("name", employer.username)
    employer.phone = request.data.get("phone", employer.phone)
    employer.job_role = request.data.get("job_role", employer.job_role)
    employer.state = request.data.get("state", employer.state)
    employer.district = request.data.get("district", employer.district)
    employer.experience = request.data.get("experience", employer.experience)
    employer.daily_rate = request.data.get("daily_rate", employer.daily_rate)

    employer.save()

    return Response(
        {"message": "Profile updated successfully"},
        status=status.HTTP_200_OK
    )