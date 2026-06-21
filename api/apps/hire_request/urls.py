from django.urls import path
from .views import (
    create_hire_request,
    get_employer_requests,
    update_request_status,
    get_employer_stats,
)

urlpatterns = [
    path("create/", create_hire_request, name="create_hire_request"),
    path("employer/", get_employer_requests, name="get_employer_requests"),
    path("update/<int:request_id>/", update_request_status, name="update_request_status"),
    path("stats/", get_employer_stats, name="get_employer_stats"),
]