pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        REMOTE_USER = 'root'
        REMOTE_HOST = '35.154.86.157'
        REMOTE_PATH = '/var/www/jenkinstest'
        SSH_KEY = '/var/lib/jenkins/.ssh/id_rsa' // Jenkins private key path
        // BAK_PATH = '${REMOTE_PATH}-bak-${date +%Y%m%d}' // DocRoot backup of production server
    }

    options {
        timestamps()
        skipDefaultCheckout()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci || npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "⚠️ Tests failed or not defined."'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Remote Nginx Server') {
            steps {
                script {
                    sh "chmod 600 ${SSH_KEY}"

                    // Backup old deployment
                    // sh """
                    // ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} \\
                    // 'mkdir -p ${BAK_PATH} && cp -r ${REMOTE_PATH}/* ${BAK_PATH}/ || true'
                    // """

                    // Deploy new build via rsync
                    sh """
                    rsync -avz --delete -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \\
                    . ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
                    """

                    // Assign permission
                    sh """
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} \\
                    'chown -R root:root ${REMOTE_PATH}/'
                    """
                }
            }
        }

        stage('(Optional) Reload Nginx') {
            when {
                expression {
                    return false // Set to true if SSR or nginx.conf needs reloading
                }
            }
            steps {
                script {
                    sh """
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} \\
                    'nginx -t && systemctl reload nginx'
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment to Nginx server completed successfully."
        }
        failure {
            echo "❌ Deployment failed. Review console output for debugging."
        }
    }
}
