withCredentials([
  string(credentialsId: 'GitHub-Personal-TokenAccess-JlccX', variable: 'GITHUB_TOKEN')
]) {
  env.GITHUB_TOKEN="$GITHUB_TOKEN"
  env.SOURCE_CODE_FOLDER="git-testing-jenkins-pipeline"
}

node('master') {

      sh '''
        set +x
        printf "The NODE_NAME parameter is: ${NODE_NAME}\n"
        printf "The GIT_URL value is: ${GIT_URL}\n"
        printf "The GIT_BRANCH value is: ${GIT_BRANCH}\n"
        printf "\nThe system properties are:\n"
        uname -a
      '''

    stage('pre-deploy'){

      docker.withRegistry("https://hub.docker.com"){
      docker.image("jlccxincontact/nodejs:alpine").inside("-u root:root"){

        sh '''
            set +x
            printf "executing the pre-deploy stage.\n"
        '''

            checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'GitHub-Credentials-Username-Password-NoToken', url: 'https://github.com/jlccx-incontact/control-system.git']]])

        sh '''
            set +x
            printf "The downloaded code is:\n"
            ls
            printf 'The unit tests executed are:\n';
            npm install
            npm run unit-tests
        '''

      }
    }
  }

    stage("upload-code-to-s3-bucket"){
    docker.withRegistry("http://incontact-docker-snapshot-local.jfrog.io","ARTIFACTORY-CREDENTIALS"){
        docker.image("cicd-awscli-toolbox").inside("-u root:root"){
          dir("$SOURCE_CODE_FOLDER") {
              unstash "$SOURCE_CODE_FOLDER"
              sh 'printf "The stashed s3 files are:\n"'
              sh 'ls $SOURCE_CODE_FOLDER'
          }
          sh '''
            set +x
            chmod +x $SOURCE_CODE_FOLDER/scripts/configure.aws-cli.sh
            $SOURCE_CODE_FOLDER/scripts/configure.aws-cli.sh $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY $AWS_REGION

            chmod +x $SOURCE_CODE_FOLDER/scripts/s3-sync.bucket.sh
            $SOURCE_CODE_FOLDER/scripts/s3-sync.bucket.sh $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY $AWS_REGION $SOURCE_CODE_FOLDER $DEV_BUCKET
          '''
        }
    }
  }

}
  

