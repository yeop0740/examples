import {CloudFrontOriginRequestEvent} from "./event";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {ImageProcessorFactory} from "./image/ImageProcessorFactory";

export const handler = async (event: CloudFrontOriginRequestEvent) => {
    const path = event.rawPath.split('/').pop();
    if (path === undefined) {
        return {
            statusCode: 404,
            body: 'Image input is not valid',
        }
    }

    const fileName = decodeURI(path);
    const width: string | undefined = event.queryStringParameters !== undefined ? event.queryStringParameters['w'] : undefined;
    const height: string | undefined = event.queryStringParameters !== undefined ? event.queryStringParameters['h'] : undefined;
    const quality: string | undefined = event.queryStringParameters !== undefined ? event.queryStringParameters['q'] : undefined;
    const bucketName = process.env.IMAGE_BUCKET;
    const region = process.env.REGION;

    let imageFromOrigin;
    try {
        const s3Client = new S3Client({region: region});
        const getOriginalImageCommand = new GetObjectCommand({Bucket: bucketName, Key: fileName});
        imageFromOrigin = await s3Client.send(getOriginalImageCommand);
    } catch (e) {
        const resource = {
            path: event.rawPath,
            error: e,
        }
        console.log('[image-processing]', JSON.stringify(resource));

        return {
            statusCode: 500,
            body: 'Internal Server Error',
        }
    }

    const contentType = imageFromOrigin.Metadata !== undefined ? imageFromOrigin.Metadata['Content-Type'] : undefined;
    if (imageFromOrigin.Body === undefined) {
        console.log('[image-processing]', JSON.stringify(event));

        return {
            statusCode: 404,
            body: 'Image not found',
        }
    }

    const byteArrayImage = await imageFromOrigin.Body.transformToByteArray();
    const widthInput = width !== undefined ? parseInt(width) : undefined;
    const heightInput = height !== undefined ? parseInt(height) : undefined;
    const qualityInput = quality !== undefined ? parseInt(quality) : undefined;

    const processor = ImageProcessorFactory.getProcessor(contentType);

    try {
        const resizedImage = await processor.resize(byteArrayImage, widthInput, heightInput, qualityInput);

        return {
            statusCode: 200,
            body: resizedImage.image,
            isBase64Encoded: true,
            headers: {
                'Content-Type': resizedImage.contentType,
            }
        }
    } catch (e) {
        const resource = {
            path: event.rawPath,
            error: e,
        }
        console.log('[image-processing]', JSON.stringify(resource));

        return {
            statusCode: 400,
            body: 'invalid image',
        }
    }
}
