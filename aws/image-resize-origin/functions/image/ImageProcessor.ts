import * as sharp from "sharp";
import {ImageProcessResult} from "./ImageProcessResult";

export interface ImageProcessor {
    resize(image: Uint8Array, width?: number, height?: number, quality?: number): Promise<ImageProcessResult>;
}

export class JpegProcessor implements ImageProcessor {
    async resize(image: Uint8Array, width?: number, height?: number, quality?: number) {
        const imageBuffer = await sharp(image)
            .resize({ width, height })
            .jpeg({ quality: quality ?? 80 })
            .toBuffer();

        return {
            contentType: 'image/jpeg',
            image: imageBuffer.toString('base64'),
        };
    }
}

export class PngProcessor implements ImageProcessor {
    async resize(image: Uint8Array, width?: number, height?: number, quality?: number){
        const imageBuffer = await sharp(image)
            .resize({ width, height })
            .png({ quality: quality ?? 80 })
            .toBuffer();

        return{
            contentType: 'image/png',
            image: imageBuffer.toString('base64'),
        };
    }
}

export class WebpProcessor implements ImageProcessor {
    async resize(image: Uint8Array, width?: number, height?: number, quality?: number) {
        const imageBuffer = await sharp(image)
            .resize({ width, height })
            .webp({ quality: quality ?? 80 })
            .toBuffer();

        return{
            contentType: 'image/webp',
            image: imageBuffer.toString('base64'),
        };
    }
}

export class GifProcessor implements ImageProcessor {
    async resize(image: Uint8Array, width?: number, height?: number, quality?: number) {
        const imageBuffer = await sharp(image)
            .resize({ width, height })
            .gif()
            .toBuffer();

        return {
            contentType: 'image/gif',
            image: imageBuffer.toString('base64'),
        };
    }
}

export class DefaultProcessor implements ImageProcessor {
    async resize(image: Uint8Array, width?: number, height?: number, quality?: number) {
        const imageBuffer = await sharp(image)
            .resize({ width, height })
            .png({ quality: quality ?? 80 })
            .toBuffer();

        return {
            contentType: 'image/png',
            image: imageBuffer.toString('base64'),
        };
    }
}
