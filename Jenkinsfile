// This is a simple pipeline script - that will build

pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                dir("003-landing-page") {
                    sh "yarn install"
                    sh "yarn run build"
                } 
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