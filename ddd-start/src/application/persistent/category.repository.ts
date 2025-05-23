import { Category } from '../../category';

export interface CategoryRepository {
	findById(id: number): Category;
}
