from rest_framework import serializers
from .models import Notification
from apps.hire_request.models import HireRequest
from apps.customer.models import Customer
from apps.employer.models import Employer


class NotificationSerializer(serializers.ModelSerializer):
    hire_request_status = serializers.SerializerMethodField()
    sender_name = serializers.SerializerMethodField()
    sender_location = serializers.SerializerMethodField()
    service_type = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "recipient_type",
            "recipient_id",
            "sender_type",
            "sender_id",
            "notification_type",
            "title",
            "message",
            "reference_id",
            "is_read",
            "is_deleted",
            "created_at",
            "updated_at",
            "hire_request_status",
            "sender_name",
            "sender_location",
            "service_type",
        ]

    def get_hire_request_status(self, obj):
        if obj.notification_type == "HIRE_REQUEST" and obj.reference_id:
            try:
                hr = HireRequest.objects.get(id=obj.reference_id)
                return hr.status
            except HireRequest.DoesNotExist:
                return None
        return None

    def get_sender_name(self, obj):
        if obj.sender_type == "customer":
            try:
                c = Customer.objects.get(id=obj.sender_id)
                return c.fullname
            except Customer.DoesNotExist:
                return "Unknown Customer"
        elif obj.sender_type == "employer":
            try:
                e = Employer.objects.get(id=obj.sender_id)
                return e.username
            except Employer.DoesNotExist:
                return "Unknown Employer"
        return "System"

    def get_sender_location(self, obj):
        if obj.sender_type == "employer":
            try:
                e = Employer.objects.get(id=obj.sender_id)
                loc_parts = [e.district, e.state]
                return ", ".join([p for p in loc_parts if p])
            except Employer.DoesNotExist:
                return None
        return None

    def get_service_type(self, obj):
        if obj.notification_type in ["HIRE_REQUEST", "HIRE_ACCEPTED", "HIRE_REJECTED"] and obj.reference_id:
            try:
                hr = HireRequest.objects.get(id=obj.reference_id)
                return hr.job_role
            except HireRequest.DoesNotExist:
                return None
        return None
