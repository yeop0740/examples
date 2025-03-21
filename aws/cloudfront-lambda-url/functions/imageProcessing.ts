import {CloudFrontEvent} from "aws-lambda";

export const handler = async (event: CloudFrontEvent) => {
    console.log(JSON.stringify(event));
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'ok'})
    }
}
