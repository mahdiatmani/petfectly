'use client';
import { useState } from 'react';
import {
  Dog,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  ArrowRight,
  UserPlus,
  Camera,
  CheckCircle,
} from 'lucide-react';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petPhoto, setPetPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const validateStep1 = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Name is required';

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!petName.trim()) newErrors.petName = 'Pet name is required';
    if (!petBreed.trim()) newErrors.petBreed = 'Pet breed is required';
    if (!petAge.trim()) newErrors.petAge = 'Pet age is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});
    setServerMessage('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('petName', petName);
      formData.append('petBreed', petBreed);
      formData.append('petAge', petAge);
      
      if (petPhoto) {
        formData.append('petPhoto', petPhoto);
      }

      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setRegistrationSuccess(true);
        setServerMessage('Registration successful! Welcome to Petfectly!');
        console.log('User registered:', data.user);
        
        // Optionally redirect after a delay
        setTimeout(() => {
          // window.location.href = '/login'; // Uncomment if you have a login page
          console.log('Would redirect to login page');
        }, 2000);
      } else {
        setServerMessage(data.message || 'Registration failed');
        if (data.errors) {
          const errorObj = {};
          data.errors.forEach(error => {
            // Map server errors to form fields
            if (error.includes('email') || error.includes('Email')) {
              errorObj.email = error;
            } else if (error.includes('password') || error.includes('Password')) {
              errorObj.password = error;
            } else if (error.includes('name') || error.includes('Name')) {
              errorObj.fullName = error;
            }
          });
          setErrors(errorObj);
        }
        
        // If it's an email error, go back to step 1
        if (data.message?.includes('email') || data.message?.includes('Email')) {
          setStep(1);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setServerMessage('Network error. Please check if the server is running on http://localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (registrationSuccess) {
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Petfectly!</h2>
              <p className="text-gray-600">{serverMessage}</p>
            </div>
            
            <div className="space-y-4">
              <button 
                //onClick={() => console.log('Navigate to dashboard')}
                 onClick={() => window.location.href = '/Tuto'}
                
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-red-600 transition-colors"
              >
                Get Started
              </button>
              <button 
                onClick={() => console.log('Navigate to login')}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Login Instead
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
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 1 ? 'Create an Account' : 'Pet Information'}
            </h2>
            <p className="text-gray-500 mt-2">
              {step === 1
                ? 'Join our pet community to find perfect playdates'
                : 'Tell us about your furry friend'}
            </p>
          </div>

          {/* Server Message */}
          {serverMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              registrationSuccess 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {serverMessage}
            </div>
          )}

          {/* Progress steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  step >= 1 ? 'bg-pink-500' : 'bg-gray-300'
                }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 ${
                  step >= 2 ? 'bg-pink-500' : 'bg-gray-300'
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-300 text-white'
                }`}
              >
                2
              </div>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? 'focus:ring-red-400 border border-red-400'
                        : 'focus:ring-pink-400'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

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
                    className={`w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 ${
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
                    className={`w-full pl-10 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 ${
                      errors.password
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
                {errors.password && (
                  <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
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
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? 'focus:ring-red-400 border border-red-400'
                        : 'focus:ring-pink-400'
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-pink-500 focus:ring-pink-400 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{' '}
                  <a href="#" className="text-pink-500 hover:text-pink-600">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-pink-500 hover:text-pink-600">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mb-6 flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mb-3 relative">
                  {petPhoto ? (
                    <img
                      src={URL.createObjectURL(petPhoto)}
                      alt="Pet preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Dog size={48} className="text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 hover:opacity-100">
                    <button className="bg-white p-2 rounded-full">
                      <Camera size={18} className="text-gray-700" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() =>
                    document.getElementById('pet-photo-upload').click()
                  }
                  className="text-sm font-medium text-pink-500 hover:text-pink-600"
                >
                  Upload Pet Photo
                </button>
                <input
                  id="pet-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPetPhoto(e.target.files[0])}
                  className="hidden"
                />
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pet Name"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 ${
                      errors.petName
                        ? 'focus:ring-red-400 border border-red-400'
                        : 'focus:ring-pink-400'
                    }`}
                  />
                </div>
                {errors.petName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.petName}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <select
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 appearance-none ${
                      errors.petBreed
                        ? 'focus:ring-red-400 border border-red-400'
                        : 'focus:ring-pink-400'
                    }`}
                  >
                    <option value="">Select Pet Breed</option>
                    <option value="Golden Retriever">Golden Retriever</option>
                    <option value="Labrador">Labrador</option>
                    <option value="French Bulldog">French Bulldog</option>
                    <option value="German Shepherd">German Shepherd</option>
                    <option value="Siamese Cat">Siamese Cat</option>
                    <option value="Maine Coon">Maine Coon</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.petBreed && (
                  <p className="mt-1 text-red-500 text-sm">{errors.petBreed}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pet Age (e.g., 2 years)"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 ${
                      errors.petAge
                        ? 'focus:ring-red-400 border border-red-400'
                        : 'focus:ring-pink-400'
                    }`}
                  />
                </div>
                {errors.petAge && (
                  <p className="mt-1 text-red-500 text-sm">{errors.petAge}</p>
                )}
              </div>
            </div>
          )}

          <div
            className={`flex ${
              step === 1 ? 'justify-end' : 'justify-between'
            } mt-8`}
          >
            {step === 2 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center transition-colors"
              >
                <ChevronLeft size={18} className="mr-1" /> Back
              </button>
            )}
            <button
              onClick={handleNextStep}
              disabled={isLoading}
              className={`px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium flex items-center 
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
                  Processing...
                </>
              ) : step === 1 ? (
                <>
                  Continue <ArrowRight size={18} className="ml-2" />
                </>
              ) : (
                <>
                  Register <UserPlus size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>

          {step === 1 && (
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/auth/login"
                className="font-medium text-pink-500 hover:text-pink-600 inline-flex items-center"
              >
                Login <ArrowRight size={14} className="ml-1" />
              </a>
            </p>
          )}
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

export default RegisterPage;