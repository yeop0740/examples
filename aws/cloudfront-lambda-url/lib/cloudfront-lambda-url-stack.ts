import * as cdk from 'aws-cdk-lib';
import {Duration} from 'aws-cdk-lib';
import {BlockPublicAccess, Bucket} from 'aws-cdk-lib/aws-s3';
import {Construct} from 'constructs';
import {FunctionUrlOrigin} from "aws-cdk-lib/aws-cloudfront-origins";
import {
    CachePolicy,
    CacheQueryStringBehavior,
    Distribution, OriginRequestHeaderBehavior, OriginRequestPolicy,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import {ServicePrincipal} from "aws-cdk-lib/aws-iam";

export class CloudfrontLambdaUrlStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const imageBucket = new Bucket(this, 'LambdaOrigin', {
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL
        });

        const lambda = new Function(this, 'ImageProcessing', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'imageProcessing.handler',
            code: Code.fromAsset('dist/functions'),
            timeout: Duration.seconds(10),
            memorySize: 1024,
            environment: {
                IMAGE_BUCKET: imageBucket.bucketName,
            },
        })
        const lambdaUrl = lambda.addFunctionUrl();


        const distribution = new Distribution(this, 'LambdaEdgeImageResizeDistribution', {
            defaultBehavior: {
                origin: FunctionUrlOrigin.withOriginAccessControl(lambdaUrl),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: new CachePolicy(this, 'ImageProcessingCachePolicy', {
                    defaultTtl: Duration.hours(24),
                    maxTtl: Duration.days(31),
                    minTtl: Duration.seconds(0),
                    queryStringBehavior: CacheQueryStringBehavior.allowList('w', 'h', 'q'),
                }),
                originRequestPolicy: new OriginRequestPolicy(this, 'AcceptHeaderPolicy', {
                    headerBehavior: OriginRequestHeaderBehavior.allowList('Accept'),
                }),
            },
        });

        const grantLambda = lambda.grantInvokeUrl(new ServicePrincipal('cloudfront.amazonaws.com'));
        imageBucket.grantRead(lambda, '/*'); // 람다 전체에게 권한을 부여하는건지, 하나에게 부여하는건지 확인 필요
    }
}
