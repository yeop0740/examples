import { OrderViewDao } from '../application/order-view.dao';
import { OrderView } from '../presentation/dto/order-view.dto';

export class PrismaOrderViewDao implements OrderViewDao {
	selectByOrderer(ordererId: number): OrderView[] {
		// raw query 를 이용해서 조인한 데이터를 조회한다.
		// order 애그리거트, member 애그리거트, product 애그리거트를 조인으로 조회하여 한 번의 쿼리로 로딩한다.
		return new Array<OrderView>();
	}
}
