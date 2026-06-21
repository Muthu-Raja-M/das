from rest_framework import serializers
from .models import Notification
from apps.hire_request.models import HireRequest

class NotificationSerializer(serializers.ModelSerializer):
    hire_request_status = serializers.SerializerMethodField()

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
        ]

    def get_hire_request_status(self, obj):
        if obj.notification_type == "HIRE_REQUEST" and obj.reference_id:
            try:
                hr = HireRequest.objects.get(id=obj.reference_id)
                return hr.status
            except HireRequest.DoesNotExist:
                return None
        return None
