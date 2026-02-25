import { useNavigate } from 'react-router-dom';

export default function LoginFailed() {
      const navigate = useNavigate();

      return (
            <div className="auth-container">
                  <div className="glass-panel">
                        <div style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #ef4444, #f87171)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 1.5rem',
                              boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)'
                        }}>
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                        </div>
                        <h1 style={{
                              background: 'linear-gradient(to right, #ef4444, #f87171)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                        }}>
                              로그인 실패
                        </h1>
                        <p>로그인 중 오류가 발생했습니다.<br />다시 시도해 주세요.</p>

                        <button
                              className="btn-primary"
                              onClick={() => navigate('/login')}
                              style={{ width: '100%', marginTop: '1rem' }}
                        >
                              로그인 화면으로 돌아가기
                        </button>
                  </div>
            </div>
      );
}
