import {type ChangeEvent, useState} from "react";

function useInput(): [string, (e: ChangeEvent<HTMLInputElement>) => void] {
    const [input, setInput] = useState("");

    const onChange = (e) => {
        setInput(e.target.value);
    }

    return [input, onChange];
}

export default useInput;
