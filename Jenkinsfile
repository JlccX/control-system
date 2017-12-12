withCredentials([
  string(credentialsId: 'GitHub-Personal-TokenAccess-JlccX', variable: 'GITHUB_TOKEN')
]) {
  env.GITHUB_TOKEN="$GITHUB_TOKEN"
}

node('master') {

      sh '''
        set +x
        printf "The NODE_NAME parameter is: ${NODE_NAME}\n"
        printf "The GIT_URL value is: ${GIT_URL}\n"
        printf "The GIT_BRANCH value is: ${GIT_BRANCH}\n"
        printf "The system properties are:"
        uname -a
      '''

    stage('pre-deploy'){

      docker.withRegistry("https://hub.docker.com"){
      docker.image("jlccxincontact/nodejs:alpine").inside("-u root:root"){

        sh '''
            set +x
            printf "executing the pre-deploy stage.\n"
        '''

        //dir("$SOURCE_CODE_FOLDER"){
            checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'JlccX-SSH-Private-Key', url: 'git@github.com:JlccX/control-system.git']]])
        //}

        sh '''
            set +x
            printf "The downloaded code is:\n"
            ls
        '''

        //stash name: "$SOURCE_CODE_FOLDER", includes: "$SOURCE_CODE_FOLDER/*"

      }
    }
  }

  stage("sonarqube"){
    docker.withRegistry("https://hub.docker.com"){
      docker.image("jlccxincontact/nodejs:alpine").inside("-u root:root"){
          sh '''
              set +x
              printf "SonarQube stage.\n"
              printf "The operating system properties are:\n"
              uname -a
          '''
        }
    }
  }

  
  stage("deploy-tests"){
    docker.withRegistry("https://hub.docker.com"){
      docker.image("jlccxincontact/nodejs:alpine").inside("-u root:root"){
          sh '''
              set +x
              printf "\nThe deploy test execution was canceled.\n"
          '''
        }
    }
  }

}
  

