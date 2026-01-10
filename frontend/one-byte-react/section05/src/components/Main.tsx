const Main = () => {
    const user = {
        name: 'david',
        isLogin: true,
    }

    if (user.isLogin) {
        return <div
            style={{
                backgroundColor: 'red',
                borderBottom: '1px solid blue',
            }}>로그아웃</div>;
    } else {
        return <div>로그인</div>;
    }
};

export default Main
