/**
 * react hooks
 * 1. 함수 컴포넌트, 커스텀 훅 내부에서만 호출 가능
 * 2. 조건부로 호출될 수 없다 -> 서로 다른 훅들의 호출 순서가 꼬일 수 있으므로 내부적인 오류가 발생할 수 있음
 * 3. 나만의 훅을 만들 수 있다
 */
import useInput from "../hooks/userInput.tsx";

const HookExam = () => {
    const [input, onChange] = useInput();
    const [input2, onChange2] = useInput();

    return (
        <div>
            <input
                value={input}
                onChange={onChange}
            />
            <input
                value={input2}
                onChange={onChange2}
            />
        </div>
    );
}

export default HookExam;
