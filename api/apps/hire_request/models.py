from django.db import models

class HireRequest(models.Model):
    customer_email = models.EmailField()
    employer_email = models.EmailField()
    job_role = models.CharField(max_length=100)
    message = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_email} → {self.employer_email}"