pipeline {

agent any

stages {

    stage('Clone Repo') {
        steps {
            git branch: 'main', url: 'https://github.com/aravindnarsinga/aws-serverless-app.git'
        }
    }

    stage('Package Backend') {
        steps {
            sh '''
            cd backend
            zip backend.zip lambda.js
            '''
        }
    }

    stage('Deploy Lambda') {
        steps {
            sh '''
            aws lambda update-function-code \
            --function-name FullStackBackend \
            --zip-file fileb://backend/backend.zip
            '''
        }
    }

    stage('Deploy Frontend to S3') {
        steps {
            sh 'aws s3 sync frontend/ s3://fullstackapp-frontend-aravind'
        }
    }

    stage('Invalidate CloudFront Cache') {
        steps {
            sh '''
            aws cloudfront create-invalidation \
            --distribution-id E2DZ0TF5DT2A99 \
            --paths "/*"
            '''
        }
    }

}

}
