from django.urls import path
from .views import login_user, token_refresh, logout_user

urlpatterns = [
    path("login/", login_user, name="login_user"),
    path("refresh/", token_refresh, name="token_refresh"),
    path("logout/", logout_user, name="logout_user"),
]