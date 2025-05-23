import { Order } from './order';
import { Canceller } from './canceller';

export interface CancelPolicy {
	hasCancellationPermission(order: Order, canceller: Canceller): boolean;
}
