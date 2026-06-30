from django.db import models
from apps.hire_request.models import HireRequest


class JobReview(models.Model):
    hire_request = models.ForeignKey(
        HireRequest,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    reviewer_role = models.CharField(max_length=20)  # "customer" or "employer"
    reviewer_id = models.IntegerField()
    receiver_role = models.CharField(max_length=20)  # "customer" or "employer"
    receiver_id = models.IntegerField()

    overall_rating = models.IntegerField()  # 1 to 5 stars
    work_quality = models.IntegerField(null=True, blank=True)  # Employer review only
    communication = models.IntegerField(null=True, blank=True)
    professionalism = models.IntegerField(null=True, blank=True)  # Employer review only
    behaviour = models.IntegerField(null=True, blank=True)
    payment_experience = models.IntegerField(null=True, blank=True)  # Customer review only

    review_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Prevent multiple reviews from the same role on the same request
        unique_together = ("hire_request", "reviewer_role")

    def __str__(self):
        return f"Review by {self.reviewer_role} (ID: {self.reviewer_id}) for Request {self.hire_request_id}"
