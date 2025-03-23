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


## 배포

```shell
npm run deploy
```

1. dist 디렉토리 제거
2. 트랜스파일(dist 하위 디렉토리)
3. dev 에서 사용하는 라이브러리를 제외한 npm install + 코드가 linux 환경에서 동작하므로 해당 플랫폼에 호환되는 패키지 설치
4. 람다 레이어를 이용하여 라이브러리 사용할 수 있도록 설정(nodejs/node_modules 디렉토리를 생성, 해당 디렉토리를 zip 파일로 압축)
5. 배포를 위해 프로젝트의 전체 라이브러리 설치
6. cdk deploy 실행
