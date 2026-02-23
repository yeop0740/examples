import { OrderView } from '../presentation/dto/order-view.dto';

export interface OrderViewDao {
	selectByOrderer(ordererId: number): OrderView[];
}
