pipeline {
  agent any
  tools {
    nodejs 'Node 22'
  }
  environment {
    DEPLOY_PATH = '/var/www/jenkinstest'
    REACT_APP_ENV = 'production'
  }
  stages {    
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'  // Clean install for production consistency
        sh 'npm install --save-dev eslint'
      }
    }

    stage('Lint Code') {
      steps {
        sh 'npm run lint || true'
      }
    }

    stage('Build and Export Static Site') {
      steps {
        sh 'npm run build'
        sh 'npm run export'
      }
    }

    stage('Verify Export Build') {
      steps {
        sh 'ls -la out/'
        sh 'test -f out/index.html || (echo "❌ Export failed - no index.html found" && exit 1)'
      }
    }

    stage('Deploy Static Files to Production') {
      steps {
        sshagent(credentials: ['production-server-ssh-key']) {
          sh '''
            ssh root@35.154.86.157 '
              DEPLOY_BACKUP="${DEPLOY_PATH}-backup-$(date +%Y%m%d%H%M%S)"
              sudo mkdir -p $DEPLOY_BACKUP
              sudo cp -r ${DEPLOY_PATH}/* $DEPLOY_BACKUP/ || true
            '
            scp -r out/* root@35.154.86.157:/tmp/next_static/
            ssh root@35.154.86.157 '
              sudo mkdir -p ${DEPLOY_PATH}
              sudo rsync -a --delete /tmp/next_static/ ${DEPLOY_PATH}/
              sudo rm -rf /tmp/next_static
            '
          '''
        }
      }
    }

    stage('Cleanup Workspace') {
      steps {
        sh 'rm -rf node_modules/'
        sh 'rm -rf out/'
      }
    }
  }

  post {
    failure {
      slackSend channel: '#build-notifications',
                color: 'danger',
                message: "🚨 Static Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
    success {
      slackSend channel: '#build-notifications',
                color: 'good',
                message: "✅ Static Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
  }
}
