import {useState} from "react";

/**
 * react hooks
 * 1. 함수 컴포넌트, 커스텀 훅 내부에서만 호출 가능
 * 2. 조건부로 호출될 수 없다 -> 서로 다른 훅들의 호출 순서가 꼬일 수 있으므로 내부적인 오류가 발생할 수 있음
 */

const HookExam = () => {
/*
    if (true) {
        const state = useState(); // (X)
    }
*/
    return <div>hookexam</div>;
}

export default HookExam;
