export class NewProductRequest {
    constructor(
        public readonly storeId: number,
        public readonly productName: string,
        public readonly productDescription: string,
        public readonly productPrice: number,
        public readonly productCategory: string,
        public readonly productImageUrl: string
    ) {
    }
}
