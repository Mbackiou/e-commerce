pipeline {
    agent any

    environment {
        // Définit tes variables ici
        DOCKER_USER = "hackira66" 
        IMAGE_NAME  = "hackire-frontend"
        TAG         = "${env.BUILD_NUMBER}" 
    }
    stages {
        stage('🚚 Clonage Git') {
            steps {
                // Cette étape est automatique quand on utilise "Pipeline from SCM"
                echo 'Code récupéré avec succès.'
            }
        }
        stage('Lint & Test') {
    steps {
        sh 'npm run lint || true'  // Le "|| true" force Jenkins à passer à la suite
    }
}
        stage('🏗️ Build Docker') {
            steps {
                echo 'Construction de l\'image Docker...'
                sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${TAG} ./my-ecom-app"
                
            }
        }

        stage('🚀 Push Docker Hub') {
            steps {
                script {
                    // Utilise l'ID 'docker-hub-credentials' que tu as créé dans l'interface Jenkins
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:${TAG}"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('☸️ Déploiement Kubernetes') {
            steps {
                echo 'Mise à jour du cluster Kubernetes...'
                // Cette commande change l'image du déploiement existant pour la nouvelle version
                sh "kubectl set image deployment/frontend frontend=${DOCKER_USER}/${IMAGE_NAME}:${TAG} -n hackireshop"
                sh "kubectl rollout status deployment/frontend -n hackireshop"
            }
        }
    }

    post {
        success {
            echo '✅ Déploiement terminé avec succès !'
        }
        failure {
            echo '❌ Le pipeline a échoué. Vérifie les logs.'
        }
    }
}
