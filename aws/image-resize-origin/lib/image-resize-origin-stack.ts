import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {BlockPublicAccess, Bucket} from "aws-cdk-lib/aws-s3";
import {Code, Runtime, Function, LayerVersion} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";
import {
    CachePolicy,
    CacheQueryStringBehavior,
    Distribution, OriginRequestHeaderBehavior,
    OriginRequestPolicy,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import {FunctionUrlOrigin} from "aws-cdk-lib/aws-cloudfront-origins";
import {PolicyStatement, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {REGION} from "../config";

export class ImageResizeOriginStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const imageBucket = new Bucket(this, 'ImageBucket', {
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL
        });

        const lambda = new Function(this, 'ResizeLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'imageProcessing.handler',
            code: Code.fromAsset('dist/functions'),
            timeout: Duration.seconds(10),
            memorySize: 1024,
            environment: {
                IMAGE_BUCKET: imageBucket.bucketName,
                REGION: REGION,
            },
            layers: [
                new LayerVersion(this, "layer", {
                    code: Code.fromAsset('resizeLayer.zip'),
                    compatibleRuntimes: [Runtime.NODEJS_18_X],
                })
            ],
        })
        const lambdaFunctionUrl = lambda.addFunctionUrl();

        const distribution = new Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: FunctionUrlOrigin.withOriginAccessControl(lambdaFunctionUrl),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: new CachePolicy(this, 'CachePolicy', {
                    defaultTtl: Duration.hours(24),
                    maxTtl: Duration.days(31),
                    minTtl: Duration.seconds(0),
                    queryStringBehavior: CacheQueryStringBehavior.allowList('w', 'h', 'q'),
                }),
                originRequestPolicy: new OriginRequestPolicy(this, 'OriginRequestPolicy', {
                    headerBehavior: OriginRequestHeaderBehavior.allowList('Accept'),
                }),
            },
        });

        const grantLambda = lambda.grantInvokeUrl(new ServicePrincipal('cloudfront.amazonaws.com'));
        imageBucket.grantRead(lambda, '/*'); // 람다 전체에게 권한을 부여하는건지, 하나에게 부여하는건지 확인 필요
        const getS3Policy = new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [imageBucket.arnForObjects('*')],
        });
        lambda.addToRolePolicy(getS3Policy);
    }
}
