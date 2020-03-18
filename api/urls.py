from django.contrib import admin
from django.urls import path

from  . import views

urlpatterns = [
    path('handler/<str:api_name>/<str:endpoint>', views.api_handler, name="api"),
]
