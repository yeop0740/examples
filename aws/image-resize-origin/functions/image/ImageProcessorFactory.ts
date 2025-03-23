import {
    DefaultProcessor,
    GifProcessor,
    ImageProcessor,
    JpegProcessor,
    PngProcessor,
    WebpProcessor
} from "./ImageProcessor";

export class ImageProcessorFactory {
    static getProcessor(contentType?: string): ImageProcessor {
        if (contentType === 'image/jpeg') {
            return new JpegProcessor();
        }
        if (contentType === 'image/png') {
            return new PngProcessor();
        }
        if (contentType === 'image/webp') {
            return new WebpProcessor();
        }
        if (contentType === 'image/gif') {
            return new GifProcessor();
        }
        return new DefaultProcessor();
    }
}
