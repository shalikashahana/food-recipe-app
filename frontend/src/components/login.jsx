import { loginWithGoogle } from '../firebase';

function Login() {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Food Recipe Suggestion</h1>
        <p className="login-subtitle">Discover dishes from around the world</p>
        <button className="google-btn" onClick={handleLogin}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="google-icon"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;