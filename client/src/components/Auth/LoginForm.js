import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loadingLogIn, setLoadingLogIn] = useState(false);
  const [loadingDisney, setLoadingDisney] = useState(false);
  const [loadingRome, setLoadingRome] = useState(false);
  const [loadingGym, setLoadingGym] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingLogIn(true);
    setError('');
    
    try {
      await login(formData);
      // Redirect will happen automatically via AuthProvider
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoadingLogIn(false);
    }
  };

  const handleDemoLogin = async (area) => {
    
    setError('');
    console.log(area);
    if (area === 'disney') {
      setLoadingDisney(true);
      try {
        await login({
          email: 'disney@demo.gems.app',
          password: 'demo123'
        });
      } catch (error) {
        setError('Demo login failed');
      } finally {
        setLoadingDisney(false);
      }
    } else if (area === 'rome') {
      try {
        setLoadingRome(true);
        await login({
          email: 'rome@demo.gems.app',
          password: 'demo123'
        });
      } catch (error) {
        setError('Demo login failed');
      } finally {
        setLoadingRome(false);
      }
    } else if (area === 'gym') {
      setLoadingGym(true);
      try {
        await login({
          email: 'gym@demo.gems.app',
          password: 'demo123'
        });
      } catch (error) {
        setError('Demo login failed');
      } finally {
        setLoadingGym(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center items-stretch">
      <div className="card w-full max-w-md ">
        
        <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">
          Welcome!
        </h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="input-field"
            />
          </div>

          <button 
            type="submit" 
            disabled={loadingLogIn} 
            className="btn-primary w-full"
          >
            {loadingLogIn ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={onSwitchToRegister} 
            className="text-orange-600 hover:text-primary-700 font-bold"
          >
            Sign up
          </button>
        </p>
      </div>

        {/* Enhanced Demo Section */}
      <div className="card w-full max-w-md">
          <h2 className="text-2xl font-bold text-orange-600 text-center mb-5">
            Demo
          </h2>

          <p className="text-xs text-blue-600 mt-2 text-center mb-6">
            No signup required • Instant access • Pre-loaded data
          </p>

          <div className="space-y-7 align-center">

            <div>
              <button 
                onClick={() => {     
                    handleDemoLogin('disney'); 
                }}
                disabled={loadingDisney}
                className="btn-secondary w-full text-md"
                >
                  {loadingDisney ? 'Loading Demo...' : 'Send me to Disneyland 🏰'}
              </button>
            </div>
            <div>
              <button 
                onClick={() => {
                  handleDemoLogin('rome');
                }}
                disabled={loadingRome}
                className="btn-secondary w-full text-md"
                >
                  {loadingRome ? 'Loading Demo...' : 'Send me to Rome 🇮🇹'}
              </button>
            </div>

            <div>
              <button 
                onClick={() => {
                  handleDemoLogin('gym');
                }}
                disabled={loadingGym}
                className="btn-secondary w-full text-md"
                >
                  {loadingGym ? 'Loading Demo...' : 'Send me to the gym 💪'}
              </button>
            </div>
        
        </div>
        
        
        
      </div>
      
    </div>
  );
};

export default LoginForm;