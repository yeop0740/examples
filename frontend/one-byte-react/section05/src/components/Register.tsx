import {useRef, useState} from "react";

/**
 * 간단한 회원가입 폼
 * 1. 이름
 * 2. 생년월일
 * 3. 국적
 * 4. 자기소개
 */
const Register = () => {
    const [input, setInput] = useState({
        name: "",
        birth: "",
        country: "",
        bio: "",
    })
    const countRef = useRef(0);

    const onChange = (e) => {
        countRef.current++;
        console.log(countRef.current);
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    }

    return <div>
        <div>
            <input
                // value={name} 초기 값을 설정하고자 할 때
                name="name"
                onChange={onChange}
                placeholder={"이름"}/>
        </div>
        <div>
            <input
                name="birth"
                value={input.birth}
                onChange={onChange}
                type="date"/>
        </div>
        <div>
            <select
                name="country"
                value={input.country}
                onChange={onChange}
            >
                <option></option>
                <option>한국</option>
                <option>미국</option>
                <option>영국</option>
            </select>
        </div>
        <div>
            <textarea
                name="bio"
                value={input.bio}
                onChange={onChange}/>
        </div>
    </div>;
}

export default Register;
