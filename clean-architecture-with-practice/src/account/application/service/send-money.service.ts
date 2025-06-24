import { AccountLock } from "../../domain/account-lock";
import { SendMoneyCommand } from "../port/in/send-money.command";
import { SendMoneyUseCase } from "../port/in/send-money.usecase";
import { LoadAccountPort } from "../port/out/load-account.port";
import { UpdateAccountStatePort } from "../port/out/update-account-state.port";

export class SendMoneyService implements SendMoneyUseCase {
    constructor(private readonly loadAccountPort: LoadAccountPort, private readonly accountLock: AccountLock, private readonly updateAccountStatePort: UpdateAccountStatePort) { }

    public sendMoney(command: SendMoneyCommand): boolean {
        // TODO: 비즈니스 규칙 검증
        // requiredAccountExists(command.getSourceAccountId());
        // requiredAccountExists(command.getTargetAccountId());
        // ...
        // TODO: 모델 상태 조작
        // TODO: 출력 값 반환

        return true;
    }
}
