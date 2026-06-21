from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Customer
from common.utils.password_validation import validate_password_policy

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

    def validate_password(self, value):
        error = validate_password_policy(value)
        if error:
            raise serializers.ValidationError(error)
        return value

    def create(self, validated_data):
        password = validated_data.get("password")

        if password:
            validated_data["password"] = make_password(password)

        return super().create(validated_data)