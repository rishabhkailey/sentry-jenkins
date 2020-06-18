pipeline {
    agent {
        docker {
            image 'node' 
            args '-p 5000:5000' 
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install' 
            }
        }
        stage('run') {
            sh 'npm start'
        }
        stage('Notify Sentry of deployment') {
            environment {
                SENTRY_AUTH_TOKEN = credentials('sentry-sample')
                SENTRY_ORG = 'sample-organization-slug'
                SENTRY_PROJECT = 'sample-project-slug'
                SENTRY_ENVIRONMENT = 'production'
            } 
            steps {
                sh 'curl -sL https://sentry.io/get-cli/ | bash'

                sh '''
                    export SENTRY_RELEASE=$(sentry-cli releases propose-version)
                    sentry-cli releases new -p $SENTRY_PROJECT $SENTRY_RELEASE
                    sentry-cli releases set-commits $SENTRY_RELEASE --auto
                    sentry-cli releases files $SENTRY_RELEASE upload-sourcemaps path-to-sourcemaps-if-applicable
                    sentry-cli releases finalize $SENTRY_RELEASE
                    sentry-cli releases deploys $SENTRY_RELEASE new -e $SENTRY_ENVIRONMENT
                '''
            }
        }
        stage('test sentry') {
            sh 'curl http://localhost:5000/getError'
        }
        stage('stop') {
            sh 'killall node'
        }
    }
}
