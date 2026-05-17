import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

try:
    from django.contrib.auth import get_user_model
    User = get_user_model()

    if not User.objects.filter(username='pendalaye').exists():
        User.objects.create_superuser('pendalaye', 'penda@email.com', 'penda123')
        print("Superuser créé !")
    else:
        print("Superuser existe déjà.")
except Exception as e:
    print(f"Erreur superuser (ignorée): {e}")