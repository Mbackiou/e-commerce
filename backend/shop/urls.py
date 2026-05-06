from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
from django.urls import path
from . import views

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
   # ✅ Après (correct)
path('test/', views.test_connexion),
]