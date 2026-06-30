from django.urls import path
from .views import (
    submit_customer_review,
    submit_employer_review,
    get_job_reviews,
    get_employer_reviews_summary,
    get_customer_reviews_summary,
)

urlpatterns = [
    path("customer/", submit_customer_review, name="submit_customer_review"),
    path("employer/", submit_employer_review, name="submit_employer_review"),
    path("job/<int:hire_request_id>/", get_job_reviews, name="get_job_reviews"),
    path("employer/<int:employer_id>/", get_employer_reviews_summary, name="get_employer_reviews_summary"),
    path("customer/<int:customer_id>/", get_customer_reviews_summary, name="get_customer_reviews_summary"),
]
