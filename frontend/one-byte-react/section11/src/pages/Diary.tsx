import {useParams} from "react-router";

const Diary = () => {
    const {id} = useParams();

    return <div>Diary: {id}</div>;
}

export default Diary;
