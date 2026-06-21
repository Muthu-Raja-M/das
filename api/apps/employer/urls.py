from django.urls import path
from .views import (
    create_employer,
    get_employer_list,
    get_verified_employer_list,
    get_employer_profile,
    get_employer_detail,
    update_employer_profile,
    verify_employer,
)

urlpatterns = [
    path("register/", create_employer, name="create_employer"),
    path("list/", get_employer_list, name="get_employer_list"),
    path("verified-list/", get_verified_employer_list, name="get_verified_employer_list"),
    path("profile/", get_employer_profile, name="get_employer_profile"),
    path("detail/<int:employer_id>/", get_employer_detail, name="get_employer_detail"),
    path("update-profile/", update_employer_profile, name="update_employer_profile"),
    path("profile/update/", update_employer_profile, name="update_employer_profile_alt"),
    path("verify/<str:id>/", verify_employer, name="verify_employer"),
]