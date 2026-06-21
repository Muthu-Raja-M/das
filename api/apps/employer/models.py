from django.db import models
class Employer(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    address = models.TextField()
    job_role = models.CharField(max_length=100)
    experience = models.CharField(max_length=100)
    daily_rate = models.IntegerField()
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, default="employer")
    profile_image = models.ImageField(upload_to="employer_profiles/", null=True, blank=True)

    is_verified = models.BooleanField(default=False)
    employer_id = models.CharField(max_length=30, unique=True, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    delete_message = models.TextField(null=True, blank=True)


    def __str__(self):
        return self.username