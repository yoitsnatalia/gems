import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';
import logo_white from '../../assets/logo_white.png';

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

  return (
    <div className="card w-full max-w-md">
      {/* <div className = "flex justify-center items-baseline gap-4">
        <img src={logo_white} alt="Logo" className="h-12 w-auto" /> */}
        <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">
          Welcome!
        </h2>
      {/* </div> */}
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
  );
};

export default LoginForm;