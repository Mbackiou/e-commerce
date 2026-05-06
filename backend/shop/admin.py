from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Category,Order

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Ce qu'on voit dans la liste principale
    list_display = ('aperçu', 'name', 'category', 'price_fcfa', 'stock_status')
    
    # Filtres sur le côté droit
    list_filter = ('category', 'created_at')
    
    # Champs cliquables pour modifier
    list_editable = ('category',)
    
    # Recherche par nom
    search_fields = ('name', 'description')

    # Fonction pour afficher l'image dans l'admin
    def aperçu(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;" />', obj.image.url)
        return "Pas d'image"

    # Affichage du prix avec l'unité
    def price_fcfa(self, obj):
        return f"{obj.price:,} FCFA".replace(',', ' ')
    price_fcfa.short_description = "Prix"

    # Indicateur visuel de stock
    def stock_status(self, obj):
        if obj.stock <= 0:
            return format_html('<span style="color: red; font-weight: bold;">Épuisé</span>')
        elif obj.stock < 5:
            return format_html('<span style="color: orange; font-weight: bold;">Critique ({})</span>', obj.stock)
        return format_html('<span style="color: green;">{} en stock</span>', obj.stock)
    stock_status.short_description = "État du Stock"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')