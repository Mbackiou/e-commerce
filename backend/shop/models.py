from django.db import models,migrations
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    
    def __clstr__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.IntegerField() # Prix en FCFA
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    stock = models.IntegerField(default=5)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    # Tu pourras ajouter plus tard les détails (produits achetés)

class Order(models.Model):
    # Statuts possibles pour la commande
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('PROCESSING', 'En cours'),
        ('SHIPPED', 'Expédié'),
        ('DELIVERED', 'Livré'),
        ('CANCELLED', 'Annulé'),
    ]

    # Lien avec l'utilisateur (si connecté)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    
    # Informations de la commande
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Pour afficher l'email dans React si l'utilisateur est anonyme
    user_email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return f"Commande #{self.id} - {self.total_amount} F"