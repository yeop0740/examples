export default function Login() {
      const loginWithNaver = () => {
            // VITE_API_BASE_URL이 설정되어 있지 않으면 기본값으로 http://localhost:8080을 사용합니다.
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'; // 여기를 127.0.0.1 로 설정하면(브라우저에서 접속한 url 과 다르면) 안된다.
            window.location.href = `${baseUrl}/oauth2/authorization/naver`; // axios, fetch를 하면 localhost를 사용할 수 없는 것으로 알고 있음
      };

      return (
            <div className="auth-container">
                  <div className="glass-panel">
                        <h1>Welcome Back</h1>
                        <p>로그인하여 서비스를 계속 이용해보세요</p>

                        <button
                              className="social-btn naver-btn"
                              onClick={loginWithNaver}
                              style={{
                                    backgroundColor: '#03C75A',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontWeight: 600
                              }}
                        >
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
                              </svg>
                              네이버 로그인
                        </button>

                        <div className="divider">또는</div>

                        <p>계정이 없으신가요? <b style={{ cursor: 'pointer', color: 'var(--primary)' }}>회원가입</b></p>
                  </div>
            </div>
      );
}
