import {CategoryRepository} from "../infra/category.repository";
import {Category} from "../category";
import {ProductRepository} from "../infra/product.repository";

export class ProductListService {
    #categoryRepository: CategoryRepository
    #productRepository: ProductRepository

    constructor(categoryRepository: CategoryRepository, productRepository: ProductRepository) {
        this.#categoryRepository = categoryRepository;
        this.#productRepository = productRepository;
    }

    getProductOfCategory(categoryId: number, page: number, size: number) {
        const category = this.#categoryRepository.findById(categoryId);
        this.#checkCategory(category);
        const products = this.#productRepository.findAllCategoryId(category.id, page, size);
        const totalCount = this.#productRepository.countsByCategoryId(category.id);
        return new Page(page, size, totalCount, products)
    }

    #checkCategory(category: Category) {
        if (!category) {
            throw new Error("category not found");
        }
    }
}