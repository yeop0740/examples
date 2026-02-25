import { useLocation } from 'react-router-dom';

export default function Welcome() {
      const location = useLocation();
      // 로그인 페이지에서 넘겨준 state를 받습니다.
      const user = location.state?.user || { name: '게스트' };

      const handleLogout = () => {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
            window.location.href = `${baseUrl}/logout`;
      };

      return (
            <div className="auth-container">
                  <div className="glass-panel">
                        <div className="welcome-avatar">
                              {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h1>환영합니다!</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                              {user.name}님, 성공적으로 로그인되었습니다.
                        </p>
                        <p>
                              이제 서비스를 자유롭게 이용하실 수 있습니다.
                        </p>

                        <button className="btn-primary" onClick={handleLogout}>
                              로그아웃
                        </button>
                  </div>
            </div>
      );
}
