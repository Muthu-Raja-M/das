from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Employer
from common.utils.password_validation import validate_password_policy


class EmployerSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    verification_id = serializers.SerializerMethodField()
    document_submitted = serializers.SerializerMethodField()
    verification_status = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=True)

    def validate_password(self, value):
        error = validate_password_policy(value)
        if error:
            raise serializers.ValidationError(error)
        return value

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
            "password",
            "role",
            "profile_image",
            "is_verified",
            "employer_id",
            "verification_id",
            "document_submitted",
            "verification_status",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image:
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

    def get_verification_id(self, obj):
        verification = getattr(obj, "verification", None)
        return verification.id if verification else None

    def get_document_submitted(self, obj):
        return hasattr(obj, "verification")

    def get_verification_status(self, obj):
        verification = getattr(obj, "verification", None)
        return verification.status if verification else "not_submitted"

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        employer = Employer(**validated_data)

        if password:
            employer.password = make_password(password)

        employer.save()
        return employer