# 1. Utilise une version récente et légère
FROM python:3.12-slim

# 2. Empêche la création de fichiers .pyc et assure des logs fluides
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

# 3. Installation des dépendances système nécessaires pour Postgres et Pillow (Images)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# 4. Installation des dépendances Python
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copie du code
COPY . .

EXPOSE 8000

# 6. Lancement
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]