export type CloudFrontOriginRequestEvent = {
    "version": string;
    "routeKey": string;
    "rawPath": string;
    "rawQueryString": string;
    "headers": {
        [name: string]: string;
    };
    "queryStringParameters": {
        [name: string]: string;
    };
    "requestContext": {
        "accountId": string;
        "apiId": string;
        "authorizer": {
            "iam": {
                "accessKey": string;
                "accountId": string;
                "callerId": string;
                "cognitoIdentity": string | null;
                "principalOrgId": string | null;
                "userArn": string;
                "userId": string;
            };
        };
        "domainName": string;
        "domainPrefix": string;
        "http": {
            "method": string;
            "path": string;
            "protocol": string;
            "sourceIp": string;
            "userAgent": string;
        };
        "requestId": string;
        "routeKey": string;
        "stage": string;
        "time": string;
        "timeEpoch": number;
    };
    "isBase64Encoded": boolean;
}
