import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError('');

    try {
      await login(formData);
      // Redirect will happen automatically via AuthProvider
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      await login({
        email: 'demo@ande.app',
        password: 'demo123'
      });
    } catch (error) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
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
            disabled={loading} 
            className="btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
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
          <h2 className="text-2xl font-bold text-orange-600 text-center mb-9">
            Demo
          </h2>

          <div className="space-y-7 align-center">
            
            <div className="text-sm text-blue-700 mb-3 space-y-1">
              <div>📍 <strong>Your location:</strong> San Francisco, CA</div>
              <div>🔓 <strong>Nearby posts:</strong> 3 posts within 100m to unlock</div>
              <div>🌎 <strong>Global posts:</strong> Friends in Paris, Tokyo, NYC, London</div>
              <div>👥 <strong>Friends:</strong> 5 demo users with posts worldwide</div>
            </div>

            <div>
              <button 
                onClick={handleDemoLogin}
                disabled={loading}
                className="btn-secondary w-full text-md"
                >
                  {loading ? 'Loading Demo...' : 'Start Demo Experience'}
              </button>
            </div>
        
        </div>
        
        
        <p className="text-xs text-blue-600 mt-2 text-center">
          No signup required • Instant access • Pre-loaded data
        </p>
      </div>
      
    </div>
  );
};

export default LoginForm;