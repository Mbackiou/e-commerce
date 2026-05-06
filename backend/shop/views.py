from rest_framework import generics, permissions, viewsets, parsers
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from django.http import JsonResponse
from .serializers import RegisterSerializer, ProductSerializer, OrderSerializer
from .models import Product, Order


# ✅ Inscription
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


# ✅ Produits — lecture publique, modification admin seulement
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


# ✅ Commandes
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]


# ✅ Test de connexion
def test_connexion(request):
    return JsonResponse({"message": "Django et React sont connectés ! ✅"})