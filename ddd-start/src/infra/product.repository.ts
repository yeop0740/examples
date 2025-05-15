import {Product} from "../product";

export interface ProductRepository {
    save(product: Product): Product;
    findById(productId: number): Product;
    findAllCategoryId(categoryId: number, page: number, size: number): Product[];
    countsByCategoryId(categoryId: number): number;
    nextId(): number;
}
