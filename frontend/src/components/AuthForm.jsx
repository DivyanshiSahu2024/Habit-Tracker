// frontend/src/components/AuthForm.jsx
import { useState } from 'react';
import axios from 'axios';

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear old errors

    try {
      // If registering, hit the register route first
      if (!isLogin) {
        await axios.post('http://localhost:5000/api/auth/register', { email, password });
        // Automatically switch to login mode after successful registration
        setIsLogin(true);
        alert("Account created! Please log in.");
        return;
      }

      // If logging in, hit the login route
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Pass the user data (token, userId, email) up to App.jsx
      onLogin(response.data);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-center text-sm font-semibold">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
          </div>
          
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
          </div>

          <button type="submit" className="mt-4 p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline">
            {isLogin ? 'Sign up here' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
}