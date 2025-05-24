'use client';
import { useState } from 'react';
import {
  Dog,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
  UserPlus,
  CheckCircle,
  Heart
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [userData, setUserData] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setServerMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLoginSuccess(true);
        setUserData(data.user);
        setServerMessage(`Welcome back, ${data.user.fullName}!`);
        console.log('User logged in:', data.user);
        
        // Store user data in sessionStorage (you can also use localStorage)
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        // Optionally redirect after a delay
        setTimeout(() => {
          // window.location.href = '/dashboard'; // Uncomment if you have a dashboard
          console.log('Would redirect to dashboard');
        }, 2000);
      } else {
        setServerMessage(data.message || 'Login failed');
        if (data.message?.includes('email') || data.message?.includes('password')) {
          setErrors({ 
            email: data.message.includes('email') ? data.message : '',
            password: data.message.includes('password') ? data.message : ''
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerMessage('Network error. Please check if the server is running on http://localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (loginSuccess && userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="p-4 flex items-center justify-center bg-white border-b border-gray-100">
          <div className="flex items-center">
            <Dog className="text-pink-500" size={28} />
            <h1 className="text-2xl font-bold ml-2 bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text">
              Petfectly
            </h1>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
              <p className="text-gray-600 mb-4">{serverMessage}</p>
              
              {/* User Info Card */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                    {userData.petInfo?.photo ? (
                      <img 
                        src={`http://localhost:5000/uploads/${userData.petInfo.photo}`}
                        alt={userData.petInfo.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Dog className="text-white" size={24} />
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800">{userData.fullName}</h3>
                <p className="text-sm text-gray-600">& {userData.petInfo?.name || 'Pet'}</p>
                <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                  <Heart size={12} className="mr-1 text-pink-500" />
                  {userData.petInfo?.breed || 'Pet'} • {userData.petInfo?.age || 'Age unknown'}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => console.log('Navigate to dashboard')}
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-red-600 transition-colors"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => console.log('Find pet playdates')}
                className="w-full px-6 py-3 border border-pink-300 text-pink-600 rounded-xl font-medium hover:bg-pink-50 transition-colors"
              >
                Visite Profile
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-center bg-white border-b border-gray-100">
        <div className="flex items-center">
          <Dog className="text-pink-500" size={28} />
          <h1 className="text-2xl font-bold ml-2 bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text">
            Petfectly
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to find perfect playdates for your pet</p>
          </div>

          {/* Server Message */}
          {serverMessage && (
            <div className={`mb-6 p-3 rounded-lg text-sm ${
              loginSuccess 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {serverMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? 'focus:ring-red-400 border border-red-400'
                      : 'focus:ring-pink-400'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? 'focus:ring-red-400 border border-red-400'
                      : 'focus:ring-pink-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-pink-500 focus:ring-pink-400 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-pink-500 hover:text-pink-600 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium flex items-center justify-center
                ${
                  isLoading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:from-pink-600 hover:to-red-600'
                } 
                transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <LogIn size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/auth/register"
              className="font-medium text-pink-500 hover:text-pink-600 inline-flex items-center transition-colors"
            >
              Create Account <UserPlus size={14} className="ml-1" />
            </a>
          </p>
        </div>
      </main>

      {/* Footer with paw print pattern */}
      <footer className="bg-white py-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Petfectly. All rights reserved.</p>
          <p className="mt-1">Find the perfect playdate for your furry friend.</p>
        </div>

        {/* Decorative paw prints */}
        <div className="absolute left-4 bottom-12 opacity-10">
          <div className="w-6 h-6 rounded-full bg-pink-500"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute -right-1 -top-4"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute right-2 -top-3"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute left-2 -top-3"></div>
        </div>
        <div className="absolute right-12 bottom-8 opacity-10">
          <div className="w-6 h-6 rounded-full bg-pink-500"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute -right-1 -top-4"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute right-2 -top-3"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute left-2 -top-3"></div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;