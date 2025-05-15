import {OrderLine} from "./order-line";
import {Money} from "./money";

// order 에서 orderlines 를 얻으면 애그리거트 루트의 외부에서도 orderlines 관련 기능을 실항할 수 있게 된다.
// 만약 애그리거트 루트 외부에서 changeOrderLines 를 호출하면 orderLines 는 변경되는데 totalAmounts 는 변경되지 않는다.
// 이런 버그를 방지하려면 orderlines 를 불변으로 만들면 된다.
//
// 팀 표준이나 구현 기술의 제약으로 불변으로 만들 수 없다면 orderlines 의 변경 기능의 접근 제한을 걸 수 있도록 하여 외부에서 실행될 수 없도록 한다.
// 최대한 외부에서 실행될 수 있는 가능성을 줄일 수 있도록 해야한다.
export class OrderLines {
    #lines: OrderLine[];

    constructor(lines: OrderLine[]) {
        this.#lines = lines;
    }

    getOrderLine(index: number) {
        return this.#lines[index];
    }

    getTotalAmounts() {
        return this.#lines.reduce((acc, line) => {
            return acc.add(line.amount)
        }, new Money(0))
    }

    changeOrderLines(newLines: OrderLine[]) {
        this.#lines = newLines;
    }
}
