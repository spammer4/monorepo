pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                dir("003-landing-page")
                sh "yarn install"     
            }
        }
        /*stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }*/
    }
}