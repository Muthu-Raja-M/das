from rest_framework import serializers
from .models import HireRequest, JobProgress
from apps.employer.models import Employer
from apps.customer.models import Customer


class HireRequestSerializer(serializers.ModelSerializer):
    employer_name = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = HireRequest
        fields = "__all__"

    def get_employer_name(self, obj):
        try:
            emp = Employer.objects.get(email=obj.employer_email)
            return emp.username
        except Employer.DoesNotExist:
            return "Employer"

    def get_customer_name(self, obj):
        try:
            cust = Customer.objects.get(email=obj.customer_email)
            return cust.fullname
        except Customer.DoesNotExist:
            return "Customer"


class JobProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobProgress
        fields = "__all__"