import "./Main.css"

const Main = () => {
    const user = {
        name: 'david',
        isLogin: true,
    }

    if (user.isLogin) {
        return <div className="logout">로그아웃</div>;
    } else {
        return <div>로그인</div>;
    }
};

export default Main
