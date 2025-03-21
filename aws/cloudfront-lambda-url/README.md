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

## problem

distribution 을 구성하던 중, originRequestPolicy 를 view request 의 헤더를 모두 포함시키려는 목적으로 
OriginRequestPolicy.ALL_VIEWER 로 설정하였습니다.
이 설정을 하면, CF 에서 403 에러가 발생하게 됩니다.
이후 해당 옵션을 없애고 Accept header 만 포함시키는 커스텀 policy 를 설정하였더니 의도대로 동작하는 것을 확인할 수 있었습니다.

## origin request event type
```json
{
    "version": "2.0",
    "routeKey": "$default",
    "rawPath": "/helloworld",
    "rawQueryString": "w=123&h=234",
    "headers": {
        "x-amz-content-sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "x-amzn-tls-version": "TLSv1.2",
        "x-amz-date": "20250321T130000Z",
        "x-forwarded-proto": "https",
        "x-amz-source-account": "<accountId>",
        "x-forwarded-port": "443",
        "x-forwarded-for": "210.107.70.211",
        "x-amz-security-token": "<token>",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "via": "2.0 <cloudfrontId>.cloudfront.net (CloudFront)",
        "x-amz-source-arn": "arn:aws:cloudfront::<accountId>:distribution/<distributionId>",
        "x-amzn-tls-cipher-suite": "ECDHE-RSA-AES128-GCM-SHA256",
        "x-amzn-trace-id": "<traceId>",
        "host": "<??>.lambda-url.ap-northeast-2.on.aws",
        "x-amz-cf-id": "<??>",
        "user-agent": "Amazon CloudFront"
    },
    "queryStringParameters": {
        "w": "123",
        "h": "234"
    },
    "requestContext": {
        "accountId": "<accountId>",
        "apiId": "<apiId>",
        "authorizer": {
            "iam": {
                "accessKey": "<accessKey>",
                "accountId": "<accountId>",
                "callerId": "<accessKey>:OriginAccessSession",
                "cognitoIdentity": null,
                "principalOrgId": null,
                "userArn": "arn:aws:sts::<accountId>:assumed-role/OriginAccessControlRole/OriginAccessSession",
                "userId": "<userId>:OriginAccessSession"
            }
        },
        "domainName": "<domainPrefix>.lambda-url.ap-northeast-2.on.aws",
        "domainPrefix": "<domainPrefix>",
        "http": {
            "method": "GET",
            "path": "/helloworld",
            "protocol": "HTTP/1.1",
            "sourceIp": "<sourceIp>",
            "userAgent": "Amazon CloudFront"
        },
        "requestId": "1ece253d-c7a5-416b-bad4-3b02f33d44c0",
        "routeKey": "$default",
        "stage": "$default",
        "time": "21/Mar/2025:13:00:00 +0000",
        "timeEpoch": 1742562000221
    },
    "isBase64Encoded": false
}
```