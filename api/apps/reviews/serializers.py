from rest_framework import serializers
from .models import JobReview


class JobReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobReview
        fields = "__all__"

    def validate_overall_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Overall rating must be between 1 and 5.")
        return value
