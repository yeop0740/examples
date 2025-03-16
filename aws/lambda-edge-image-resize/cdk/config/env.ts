import * as dotenv from "dotenv";
dotenv.config();

export const ACCOUNT_ID =
    process.env.ACCOUNT_ID ??
    (() => {
        throw new Error("환경 변수 ACCOUNT_ID 이(가) 설정되지 않았습니다.");
    })();
export const REGION =
    process.env.REGION ??
    (() => {
        throw new Error("환경 변수 REGION 이(가) 설정되지 않았습니다.");
    })();
