from rest_framework import serializers
from .models import HireRequest


class HireRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HireRequest
        fields = "__all__"