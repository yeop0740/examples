import { ProductRepository } from '../application/persistent/product.repository';
import { PrismaService } from './prisma/prisma.service';
import { Product } from '../product';

export class PrismaProductRepository implements ProductRepository {
	constructor(private prisma: PrismaService) {}

	save(product: Product) {
		return new Product(0, new Set<number>(), 0);
	}

	findById(id: number) {
		return new Product(0, new Set<number>(), 0);
	}

	// categoryId 에 해당하는 모든 product 중 page 와 size 에 맞는 만큼 조회는 쿼리를 작성한다.
	findAllCategoryId(categoryId: number, page: number, size: number) {
		return new Array<Product>();
	}

	countsByCategoryId(categoryId: number) {
		return 0;
	}

	nextId() {
		return 0;
	}
}
