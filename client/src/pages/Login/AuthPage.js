import { useState } from 'react';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import authBackground from '../../assets/auth.png'; // adjust path as needed
import logo_white from '../../assets/logo_white.png';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen font-gentium flex flex-col bg-center bg-cover items-center justify-center overflow-hidden p-4" style={{ backgroundImage: `url(${authBackground})` }}>
      <div className = "flex justify-center items-baseline gap-2">
        <img src={logo_white} alt="Logo" className="h-12 w-auto" />
        <h2 className="text-8xl text-white text-center mb-6">
          ande
        </h2>
      </div>
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;