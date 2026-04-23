from django.urls import path
from . import views

urlpatterns = [
    path('revenue/', views.revenue),
    path('top-tours/', views.top_tours),
    path('summary/', views.summary),
]