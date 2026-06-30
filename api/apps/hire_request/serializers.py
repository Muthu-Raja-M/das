from rest_framework import serializers
from .models import HireRequest, JobProgress


class JobProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobProgress
        fields = "__all__"


class HireRequestSerializer(serializers.ModelSerializer):
    progress = JobProgressSerializer(read_only=True)

    class Meta:
        model = HireRequest
        fields = "__all__"