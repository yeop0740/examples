const Main = () => {
    const user = {
        name: 'david',
        isLogin: true,
    }

    if (user.isLogin) {
        return <div>로그아웃</div>;
    } else {
        return <div>로그인</div>;
    }
};

export default Main
