import {useSearchParams} from "react-router";

const Home = () => {
    const [params, setParams] = useSearchParams();
    // domain.example?value=123 -> 123 출력
    console.log(params.get("value"));

    return <div>Home</div>;
}

export default Home;
