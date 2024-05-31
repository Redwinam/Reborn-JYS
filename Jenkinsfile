pipeline {
  agent any
  stages {
    stage('Check Out') {
      steps {
        checkout([$class: 'GitSCM',
        branches: [[name: GIT_BUILD_REF]],
        userRemoteConfigs: [[
          url: GIT_REPO_URL,
          credentialsId: CREDENTIALS_ID
        ]]])
      }
    }

    stage('构建镜像并推送到 CODING Docker 制品库') {
      steps {
        sh "docker build -t ${CODING_DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -t ${CODING_DOCKER_IMAGE_NAME}:latest -f ${DOCKERFILE_PATH} ${DOCKER_BUILD_CONTEXT}"
        useCustomStepPlugin(key: 'SYSTEM:artifact_docker_push', version: 'latest', params: [image:"${CODING_DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}",repo:"${DOCKER_REPO_NAME}",properties:'[]',project:'jysx',username:'${PROJECT_TOKEN_GK}',password:'${PROJECT_TOKEN}'])
        useCustomStepPlugin(key: 'SYSTEM:artifact_docker_push', version: 'latest', params: [image:"${CODING_DOCKER_IMAGE_NAME}:latest",repo:"${DOCKER_REPO_NAME}",properties:'[]',project:'jysx',username:'${PROJECT_TOKEN_GK}',password:'${PROJECT_TOKEN}'])
      }
    }

  }
  environment {
    CODING_DOCKER_REG_HOST = "${CCI_CURRENT_TEAM}-docker.pkg.${CCI_CURRENT_DOMAIN}"
    CODING_DOCKER_IMAGE_NAME = "${PROJECT_NAME.toLowerCase()}/${DOCKER_REPO_NAME}/${DOCKER_IMAGE_NAME}"
  }
}