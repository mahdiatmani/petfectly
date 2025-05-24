"use client";
import { useState, useEffect } from 'react';
import { Dog, Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react';
//import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/check`);
        if (response.data.isAuthenticated) {
          router.push('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuthStatus();
  }, [router]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!re.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setLoginError('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);

      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        if (response.data.success) {
          // Redirect to dashboard
          router.push('/');
        } else {
          setLoginError(response.data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError(
          error.response?.data?.message ||
            'Unable to login. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Google login handler
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // Facebook login handler
  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/auth/facebook`;
  };

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
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">
              Login to find the perfect playmate for your pet
            </p>
          </div>

          {/* Show login error if any */}
          {loginError && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-500 text-sm">
              {loginError}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateEmail(email)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 ${
                    emailError
                      ? 'focus:ring-red-400 border border-red-400'
                      : 'focus:ring-pink-400'
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-red-500 text-sm">{emailError}</p>
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
                  onBlur={() => validatePassword(password)}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 ${
                    passwordError
                      ? 'focus:ring-red-400 border border-red-400'
                      : 'focus:ring-pink-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-red-500 text-sm">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-pink-500 focus:ring-pink-400 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-pink-500 hover:text-pink-600"
              >
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-medium flex items-center justify-center 
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
                  Logging in...
                </>
              ) : (
                <>
                  Login <LogIn size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path
                      fill="#4285F4"
                      d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    />
                  </g>
                </svg>
                Google
              </button>
              <button
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/auth/register"
              className="font-medium text-pink-500 hover:text-pink-600 inline-flex items-center"
            >
              Register now <ArrowRight size={14} className="ml-1" />
            </a>
          </p>
        </div>
      </main>

      {/* Footer with paw print pattern */}
      <footer className="bg-white py-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Petfectly. All rights reserved.</p>
          <p className="mt-1">
            Find the perfect playdate for your furry friend.
          </p>
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
