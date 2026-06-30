from rest_framework import serializers
from .models import HireRequest, JobProgress


class HireRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HireRequest
        fields = "__all__"


class JobProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobProgress
        fields = "__all__"