# Utiliser Node.js
FROM node:20-slim

WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port de Vite
EXPOSE 5173

# Lancer en mode host pour que Docker puisse exposer le port
CMD ["npm", "run", "dev", "--", "--host"]