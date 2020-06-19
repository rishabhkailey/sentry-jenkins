pipeline {
    agent any
    stages {
        // stage('Build') {
        //     steps {
        //         sh 'npm install' 
        //     }
        // }
        // stage('run') {
        //     steps {
        //         sh 'npm start'
        //     }
        // }
        stage('start_docker') {
            steps {
                sh 'cat /etc/os-release'
                sh 'docker build -t node_image .'
                sh 'docker run --name node_container -d -p 5000:5000 node_image'
                sh 'export '
            }
        }
        stage('Notify_Sentry') {
            agent {
                docker { 
                    image 'ubuntu' 
                }
            }
            environment {
                SENTRY_AUTH_TOKEN = credentials('sentry-sample')
                SENTRY_ORG = 'not-a-number'
                SENTRY_PROJECT = 'nodejs'
                SENTRY_ENVIRONMENT = 'production'
            } 
            steps {
                sh 'apt install curl'
                sh 'curl -sL https://sentry.io/get-cli/'
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
        stage('generate_error') {
            steps {
                sh 'curl http://localhost:5000/getError'            
            }
        }
        stage('done') {
            steps {
                sh 'echo "done"'
            }
        }
    }
    post {
        always {
            sh 'echo "stoping and removing container"'
            sh 'docker stop node_container'
            sh 'docker rm node_container'
            sh 'echo "container stoped and removed"'
        }
    }
}
