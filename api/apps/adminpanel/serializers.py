from rest_framework import serializers
from apps.customer.models import Customer
from apps.employer.models import Employer


class CustomerVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "id",
            "fullname",
            "email",
            "phone",
            "aadhaar",
            "role",
            "is_verified",
            "verification_status",
        ]


class EmployerVerificationSerializer(serializers.ModelSerializer):
    document_submitted = serializers.SerializerMethodField()
    verification_status = serializers.SerializerMethodField()

    class Meta:
        model = Employer
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "state",
            "district",
            "address",
            "job_role",
            "experience",
            "daily_rate",
            "role",
            "profile_image",
            "is_verified",
            "document_submitted",
            "verification_status",
        ]

    def get_document_submitted(self, obj):
        return hasattr(obj, "verification")

    def get_verification_status(self, obj):
        verification = getattr(obj, "verification", None)
        return verification.status if verification else "not_submitted"