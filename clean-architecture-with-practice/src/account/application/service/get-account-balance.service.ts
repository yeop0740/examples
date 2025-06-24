import { AccountId } from "src/account/domain/account-id";
import { GetAccountBalanceQuery } from "../port/in/get-account-balance.query";
import { LoadAccountPort } from "../port/out/load-account.port";

export class GetAccountBalanceService implements GetAccountBalanceQuery {
    constructor(private readonly loadAccountPort: LoadAccountPort) { }

    public getAccountBalance(accountId: AccountId) {
        return this.loadAccountPort.loadAccount(accountId, new Date())
            .calculateBalance();
    }
}
