# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## description

Lambda Url 을 CF 의 Origin 으로 설정하였습니다.(Lambda Url 을 공식적으로 지원 - OAC 도 설정할 수 있음)
Origin Request Event 타입을 확인하기 위해 event 로그를 찍는 origin 을 구성하였습니다.
queryString 과 Accept header 를 확인합니다(rn 환경의 모바일 애플리케이션에서의 request 파악 필요).
