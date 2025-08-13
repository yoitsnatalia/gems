import { useState } from 'react';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import bg from '../../assets/pics.png'; 
import logo from '../../assets/crystal_white.png';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen font-gentium flex flex-col bg-center bg-cover items-center justify-center overflow-hidden p-4" style={{ backgroundImage: `url(${bg})` }}>
      <div className = "flex justify-center items-baseline gap-2">
        <img src={logo} alt="Logo" className="h-16 w-auto" />
        <h2 className="text-8xl text-white text-center mb-6">
          Gems
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