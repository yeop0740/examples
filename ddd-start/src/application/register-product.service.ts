import {NewProductRequest} from "../presentation/request/new-product.request";
import {StoreRepository} from "../infra/store.repository";
import {Product} from "../product";
import {ProductRepository} from "../infra/product.repository";
import {Store} from "../store";

export class RegisterProductService {
    #storeRepository: StoreRepository;
    #productRepository: ProductRepository;

    constructor(storeRepository: StoreRepository, productRepository: ProductRepository) {
        this.#storeRepository = storeRepository;
        this.#productRepository = productRepository;
    }

    registerNewProduct(request: NewProductRequest) {
        const store = this.#storeRepository.findById(request.storeId);
        this.#checkNull(store);

        // product 를 생성할 수 있는 조건이 응용 레이어에 드러났다.
        // store 가 product 를 생성할 수 있는지를 판단하고 product 를 생성하는 것은
        // 논리적으로 하나의 도메인 기능인데 이 도메인 기능을 응용 서비스에서 구현하고 있는 것이다.
        // 도메인 기능을 넣기 위해 별도의 도메인 서비스나 팩토리 클래스를 만들 수 있을 것이다. 하지만 store 애그리거트에 구현한는 방법도 잇다
        // if (store.isBlocked) {
        //     throw new Error(`Store with id ${request.storeId} is blocked`);
        // }

        const id = this.#productRepository.nextId();
        // const product = new Product(id, new Set<number>());
        // store 가 product 를 생성할 수 있는지 확인하고
        // store 가 product 를 생성한다.
        // 이로써 응용 서비스에서 store 의 blocked 여부를 확인하지 않는다. -> 이는 product 생성에 대한 조건을 변경하더라도 store 애그리거트를 변화하고 응용 레이어에는 영향을 주지 않는다.
        // 도메인의 응집도도 높아진다. 이것이 애그리거트를 팩토리로 사용할 때 얻을 수 있는 장점이다.
        const product = store.createProduct(id, new Set<number>());
        this.#productRepository.save(product);
        return id;
    }

    #checkNull(store: Store) {
        if (!store) {
            throw new Error("store not found");
        }
    }
}
