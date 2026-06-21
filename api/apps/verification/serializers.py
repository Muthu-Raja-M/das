from rest_framework import serializers
from .models import EmployerVerification
from apps.employer.models import Employer


class EmployerNestedSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="username", read_only=True)

    class Meta:
        model = Employer
        fields = ["id", "name", "username", "email", "phone"]


class EmployerVerificationSerializer(serializers.ModelSerializer):
    employer = EmployerNestedSerializer(read_only=True)
    employer_name = serializers.CharField(source="employer.username", read_only=True)
    employer_email = serializers.CharField(source="employer.email", read_only=True)
    employer_phone = serializers.CharField(source="employer.phone", read_only=True)
    employer_role = serializers.CharField(source="employer.job_role", read_only=True)
    document_submitted = serializers.SerializerMethodField()

    class Meta:
        model = EmployerVerification
        fields = [
            "id",
            "employer",
            "employer_name",
            "employer_email",
            "employer_phone",
            "employer_role",
            "face_image",
            "aadhar_image",
            "pan_image",
            "driving_licence_image",
            "status",
            "admin_notes",
            "submitted_at",
            "approved_at",
            "employer_unique_id",
            "document_submitted",
        ]
        read_only_fields = [
            "status",
            "submitted_at",
            "approved_at",
            "employer_unique_id",
        ]

    def get_document_submitted(self, obj):
        # A verification record exists, so documents are submitted
        return True