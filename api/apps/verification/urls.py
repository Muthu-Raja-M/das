from django.urls import path
from .views import (
    submit_employer_verification,
    get_employer_documents,
    admin_approve_verification,
    admin_reject_verification,
    get_employer_alert,
    admin_verification_list,
    admin_verification_detail,
)

urlpatterns = [
    path("submit/", submit_employer_verification, name="submit_employer_verification"),

    path(
        "admin/employer/<int:employer_id>/",
        get_employer_documents,
        name="get_employer_documents"
    ),

    path(
        "admin/approve/<int:employer_id>/",
        admin_approve_verification,
        name="admin_approve_verification"
    ),

    path(
        "admin/reject/<int:employer_id>/",
        admin_reject_verification,
        name="admin_reject_verification"
    ),

    path(
        "employer/alert/",
        get_employer_alert,
        name="get_employer_alert"
    ),
    path(
        "alerts/employer/",
        get_employer_alert,
        name="get_employer_alert_alt"
    ),
    path(
        "admin/list/",
        admin_verification_list,
        name="admin_verification_list"
    ),
    path(
        "admin/detail/<int:verification_id>/",
        admin_verification_detail,
        name="admin_verification_detail"
    ),
]