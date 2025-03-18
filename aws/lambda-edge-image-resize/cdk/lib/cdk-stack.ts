import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {BlockPublicAccess, Bucket} from 'aws-cdk-lib/aws-s3';
import {
    Distribution,
    ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront';
import {S3BucketOrigin} from "aws-cdk-lib/aws-cloudfront-origins";

export class CdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const imageBucket = new Bucket(this, 'LambdaEdgeImageResizeBucket', {
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL
        });

        const distribution = new Distribution(this, 'LambdaEdgeImageResizeDistribution', {
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(imageBucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
            },
        });
    }
}
