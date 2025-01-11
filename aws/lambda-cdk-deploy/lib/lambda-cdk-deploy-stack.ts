import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from 'node:path';

export class LambdaCdkDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props)
    const fn = new lambda.Function(this, 'LambdaCdkDeployFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'hello-lambda')),
    });

    const endpoint = new apigw.LambdaRestApi(this, `LambdaCdkDeployApiGwEndpoint`, {
      handler: fn,
      restApiName: `LambdaCdkDeployApi`,
    });
  }
}
