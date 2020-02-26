from django.contrib import admin
from django.urls import path

from  . import views

urlpatterns = [
    path('', views.search, name="search"),
    path('articles/', views.get_articles, name="get_articles"),
    path('articles/new', views.add_article, name="add_article")
]
