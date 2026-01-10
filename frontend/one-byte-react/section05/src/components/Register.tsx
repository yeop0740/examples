import {useState} from "react";

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
    console.log(input);

    const onChangeName = (e) => {
        setInput({
            ...input,
            name: e.target.value,
        });
    }

    const onChangeBirth = (e) => {
        setInput({
            ...input,
            birth: e.target.value,
        })
    }

    const onChangeCountry = (e) => {
        setInput({
            ...input,
            country: e.target.value,
        })
    }

    const onChangeBio = (e) => {
        setInput({
            ...input,
            bio: e.target.value,
        })
    }

    return <div>
        <div>
            <input
                // value={name} 초기 값을 설정하고자 할 때
                onChange={onChangeName}
                placeholder={"이름"}/>
        </div>
        <div>
            <input
                value={input.birth}
                onChange={onChangeBirth}
                type="date"/>
        </div>
        <div>
            <select
                value={input.country}
                onChange={onChangeCountry}
            >
                <option></option>
                <option>한국</option>
                <option>미국</option>
                <option>영국</option>
            </select>
        </div>
        <div>
            <textarea value={input.bio} onChange={onChangeBio}/>
        </div>
    </div>;
}

export default Register;
