#!groovy

def REPOSITORY_NAME = "robokingmaster"
def REPOSITORY_SERVER = "https://registry.hub.docker.com" 

def dockerImageName = ''
def dockerFilePath = ''
def dockerFileName = ''

def emailrecipient = "robokingmaster@gmail.com"

pipeline {
    agent any
    
    parameters {        
        choice(
            name: 'DOCKER_IMAGE', 
            choices: ['utils'], 
            description: 'Select Docker Image To be Built'
        )
        string(name: 'TAG_VERSION', defaultValue: 'v1.0', description: 'Docker Image Version Tag')         
    }

    environment { 
        DOCKER_HOST="unix:///var/run/docker.sock"        
    } 

    stages { 
        stage ("Process Build Input Parameters"){
            steps{
                script {
                    print "Processing Input Parameters"

                    if(params.DOCKER_IMAGE == 'utils'){
                        dockerImageName = "/utils:${params.TAG_VERSION}"                        
                    }else{
                        currentBuild.result = 'ABORTED'
                        error("Invalid DOCKER_IMAGE")
                    }
                    
                    dockerFilePath = "docker-files/${params.DOCKER_IMAGE}"
                    dockerFileName = "Dockerfile.${params.TAG_VERSION}"

                    print "Below Parameter Will Be Used By This Pipeline"
                    print "-------------------------------------------------------"
                    print "REPOSITORY_SERVER = ${REPOSITORY_SERVER}"
                    print "REPOSITORY_NAME = ${REPOSITORY_NAME}"
                    print "DOCKER_IMAGE = ${params.DOCKER_IMAGE}" 
                    print "DOCKER_IMAGE_NAME = ${REPOSITORY_NAME}/${dockerImageName}"
                    print "DOCKER_FILE = ${dockerFilePath}"
                    print "-------------------------------------------------------"                                                  
                }   
            }   
        }

        stage ('Copying EntryPoint Script') {
            steps {
                print "Copying Docker Resources To Current Directory"
                sh """
                    cp ${dockerFilePath}/*.sh . 
                    chmod 777 *.sh 
                """
            }
        }           

        stage ('Build Docker Image') {
            steps {
                script {
                    print "Building Docker Image"
                    app = docker.build("${REPOSITORY_NAME}" + "${dockerImageName}", "--build-arg SSH_USER=sshuser --build-arg SSH_PWD=sshuserpwd -f ${dockerFilePath}/${dockerFileName} .")
                }
            }
        }

        stage ('Test Docker Image') {
            steps {
                script {
                    app.inside {
                        sh 'echo "Tests passed"'
                    }
                }
            }
        }        
        
        stage ('Push Built Image To Docker Hub') {
            steps {
                script {
                    print "Pushing Docker Image To Docker Hub"
                    docker.withRegistry("${REPOSITORY_SERVER}", 'dockerHubCredentialsId') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("${params.TAG_VERSION}")
                    }
                }
            }
        }
    }

    post{
        failure {
            script{
                emailext (
                    body: '''${SCRIPT, template="groovy-html.template"}''',
                    attachLog: true,
                    mimeType: 'text/html',
                    subject: "Build failed in Jenkins: ${env.JOB_NAME} - ${currentBuild.number}",
                    to: "${emailrecipient}",
                    replyTo: "${emailrecipient}",
                    recipientProviders: [[$class: 'RequesterRecipientProvider'], [$class: 'DevelopersRecipientProvider']]
                )              
            }
        }
    }    
}