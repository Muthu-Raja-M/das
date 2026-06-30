from django.urls import path
from .views import (
    create_hire_request,
    get_employer_requests,
    update_request_status,
    get_employer_stats,
    get_customer_requests,
    get_job_progress,
    update_job_progress,
    verify_job_otp,
    submit_job_payment,
)

from apps.notifications.views import accept_hire_request_api, reject_hire_request_api

urlpatterns = [
    path("create/", create_hire_request, name="create_hire_request"),
    path("employer/", get_employer_requests, name="get_employer_requests"),
    path("customer/", get_customer_requests, name="get_customer_requests"),
    path("stats/", get_employer_stats, name="get_employer_stats"),
    path("update/<int:request_id>/", update_request_status, name="update_request_status"),
    path("<int:request_id>/accept/", accept_hire_request_api, name="accept_hire_request_api"),
    path("<int:request_id>/reject/", reject_hire_request_api, name="reject_hire_request_api"),
    
    # Job Progress URLs
    path("progress/<int:hire_request_id>/", get_job_progress, name="get_job_progress"),
    path("progress/<int:request_id>/update/", update_job_progress, name="update_job_progress"),
    path("progress/<int:request_id>/verify-otp/", verify_job_otp, name="verify_job_otp"),
    path("progress/<int:request_id>/submit-payment/", submit_job_payment, name="submit_job_payment"),
]