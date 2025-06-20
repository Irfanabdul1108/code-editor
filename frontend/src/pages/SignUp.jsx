import React, { useState } from 'react';
import logo from "../images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import image from "../images/authPageSide.png";
import { api_base_url } from '../helper';
import { BiUser, BiEnvelope, BiLock, BiShow, BiHide, BiLoader } from 'react-icons/bi';
import { HiOutlineCode } from 'react-icons/hi';
import { MdArrowForward, MdCheckCircle } from 'react-icons/md';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPwd(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(api_base_url + "/signUp", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          name: name,
          email: email,
          password: pwd
        })
      });

      const data = await response.json();
      
      if (data.success === true) {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed z-50 flex items-center px-6 py-3 space-x-2 text-white bg-green-500 rounded-lg shadow-lg top-4 right-4';
        successMessage.innerHTML = `
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>Account created successfully!</span>
        `;
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          document.body.removeChild(successMessage);
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error or server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-6 space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <HiOutlineCode className="text-xl text-white" />
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                CodeIDE
              </h1>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400">Join thousands of developers coding online</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={submitForm} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="relative">
                <BiUser className="absolute text-xl text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Choose a unique username"
                  className="w-full py-3 pl-12 pr-4 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <BiUser className="absolute text-xl text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full py-3 pl-12 pr-4 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <BiEnvelope className="absolute text-xl text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-3 pl-12 pr-4 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <BiLock className="absolute text-xl text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  required
                  onChange={handlePasswordChange}
                  value={pwd}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full py-3 pl-12 pr-12 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 transition-colors duration-200 transform -translate-y-1/2 right-3 top-1/2 hover:text-white"
                >
                  {showPassword ? <BiHide className="text-xl" /> : <BiShow className="text-xl" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {pwd && (
                <div className="mt-2">
                  <div className="flex items-center mb-1 space-x-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength <= 2 ? 'text-red-400' : 
                      passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Use 8+ characters with uppercase, lowercase, numbers, and symbols
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 border bg-red-500/10 border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <BiLoader className="text-xl animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <MdArrowForward className="text-xl" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="items-center justify-center hidden p-8 lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="max-w-lg text-center">
          <div className="mb-8">
            <img 
              src={image} 
              alt="Coding illustration" 
              className="w-full h-auto max-w-md mx-auto shadow-2xl rounded-2xl"
            />
          </div>
          <h3 className="mb-4 text-3xl font-bold text-white">
            Start Your Coding Journey
          </h3>
          <p className="text-lg leading-relaxed text-blue-100">
            Join our community of developers and start building amazing projects with our powerful online IDE.
          </p>
          
          {/* Feature highlights */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3 text-blue-100">
              <MdCheckCircle className="text-xl text-green-400" />
              <span>Real-time collaboration</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-100">
              <MdCheckCircle className="text-xl text-green-400" />
              <span>Multiple language support</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-100">
              <MdCheckCircle className="text-xl text-green-400" />
              <span>Cloud-based development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;