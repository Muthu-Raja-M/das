from django.utils import timezone
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from apps.employer.models import Employer
from .models import EmployerVerification
from .serializers import EmployerVerificationSerializer


def generate_employer_id():
    last_record = (
        EmployerVerification.objects
        .exclude(employer_unique_id__isnull=True)
        .order_by("-id")
        .first()
    )

    if last_record and last_record.employer_unique_id:
        try:
            last_number = int(last_record.employer_unique_id.replace("EMP", ""))
            new_number = last_number + 1
        except Exception:
            new_number = 1
    else:
        new_number = 1

    return f"EMP{new_number:04d}"


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def submit_employer_verification(request):
    email = request.data.get("email")

    if not email:
        return Response({"message": "Employer email is required"}, status=400)

    try:
        employer = Employer.objects.get(email=email)
    except Employer.DoesNotExist:
        return Response({"message": "Employer not found"}, status=404)

    verification, created = EmployerVerification.objects.get_or_create(
        employer=employer
    )

    verification.face_image = request.FILES.get("face_image", verification.face_image)
    verification.aadhar_image = request.FILES.get("aadhar_image", verification.aadhar_image)
    verification.pan_image = request.FILES.get("pan_image", verification.pan_image)
    verification.driving_licence_image = request.FILES.get(
        "driving_licence_image",
        verification.driving_licence_image
    )

    verification.status = "pending"
    verification.admin_notes = ""
    verification.approved_at = None
    verification.save()

    serializer = EmployerVerificationSerializer(
        verification,
        context={"request": request}
    )

    return Response({
        "success": True,
        "message": "Documents submitted successfully and sent to admin",
        "data": serializer.data,
    }, status=200)


@api_view(["GET"])
def get_employer_documents(request, employer_id):
    try:
        employer = Employer.objects.get(id=employer_id)
    except Employer.DoesNotExist:
        return Response({"message": "Employer not found"}, status=404)

    verification = EmployerVerification.objects.filter(employer=employer).first()

    data = {
        "id": employer.id,
        "username": employer.username,
        "email": employer.email,
        "phone": employer.phone,
        "job_role": employer.job_role,
        "state": employer.state,
        "district": employer.district,
        "is_verified": employer.is_verified,
        "employer_id": employer.employer_id,

        "verification_id": verification.id if verification else None,
        "document_submitted": verification.status in ["pending", "approved", "rejected"] if verification else False,
        "status": verification.status if verification else "not_submitted",
        "admin_notes": verification.admin_notes if verification else "",

        "face_image": verification.face_image.url if verification and verification.face_image else None,
        "aadhar_image": verification.aadhar_image.url if verification and verification.aadhar_image else None,
        "pan_image": verification.pan_image.url if verification and verification.pan_image else None,
        "driving_licence_image": verification.driving_licence_image.url if verification and verification.driving_licence_image else None,
    }

    return Response(data, status=200)


@api_view(["POST"])
def admin_approve_verification(request, employer_id):
    try:
        employer = Employer.objects.get(id=employer_id)
    except Employer.DoesNotExist:
        return Response({"message": "Employer not found"}, status=404)

    verification = EmployerVerification.objects.filter(employer=employer).first()

    if not verification:
        return Response({"message": "Verification record not found"}, status=404)

    if not verification.employer_unique_id:
        generated_id = generate_employer_id()
        verification.employer_unique_id = generated_id
    else:
        generated_id = verification.employer_unique_id

    verification.status = "approved"
    verification.approved_at = timezone.now()
    verification.admin_notes = (
        request.data.get("admin_notes")
        or "Your account has been verified by Admin."
    )
    verification.save()

    employer.is_verified = True
    employer.employer_id = generated_id
    employer.save()

    return Response({
        "success": True,
        "message": "Employer approved successfully",
        "status": "approved",
        "alert_message": verification.admin_notes,
        "employer_id": generated_id,
    }, status=200)


@api_view(["POST"])
def admin_reject_verification(request, employer_id):
    try:
        employer = Employer.objects.get(id=employer_id)
    except Employer.DoesNotExist:
        return Response({"message": "Employer not found"}, status=404)

    verification = EmployerVerification.objects.filter(employer=employer).first()

    if not verification:
        return Response({"message": "Verification record not found"}, status=404)

    reject_message = (
        request.data.get("admin_notes")
        or request.data.get("message")
        or "Your verification was rejected by Admin."
    ).strip()

    verification.status = "rejected"
    verification.admin_notes = reject_message
    verification.approved_at = None
    verification.save()

    employer.is_verified = False
    employer.save()

    return Response({
        "success": True,
        "message": "Employer verification rejected",
        "status": "rejected",
        "alert_message": reject_message,
    }, status=200)


@api_view(["GET"])
def get_employer_alert(request):
    email = request.GET.get("email")

    if not email:
        return Response({"message": "Email is required"}, status=400)

    try:
        employer = Employer.objects.get(email=email)
    except Employer.DoesNotExist:
        return Response({"message": "Employer not found"}, status=404)

    verification = EmployerVerification.objects.filter(employer=employer).first()

    if not verification:
        return Response({
            "status": "not_submitted",
            "message": "",
            "count": 0,
            "employer_id": employer.employer_id,
        }, status=200)

    message = verification.admin_notes or ""

    if verification.status == "approved":
        message = message or "Your account has been verified by Admin."

    if verification.status == "rejected":
        message = message or "Your verification was rejected by Admin."

    count = 1 if verification.status in ["approved", "rejected"] else 0

    return Response({
        "status": verification.status,
        "message": message,
        "count": count,
        "employer_id": employer.employer_id,
    }, status=200)


@api_view(["GET"])
def admin_verification_list(request):
    verifications = EmployerVerification.objects.all().order_by("-id")
    serializer = EmployerVerificationSerializer(verifications, many=True, context={"request": request})
    return Response(serializer.data, status=200)


@api_view(["GET"])
def admin_verification_detail(request, verification_id):
    try:
        verification = EmployerVerification.objects.get(id=verification_id)
    except EmployerVerification.DoesNotExist:
        return Response({"message": "Verification not found"}, status=404)

    serializer = EmployerVerificationSerializer(verification, context={"request": request})
    return Response(serializer.data, status=200)