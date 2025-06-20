import React, { useState } from 'react';
import logo from "../images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import image from "../images/authPageSide.png";
import { api_base_url } from '../helper';
import { BiEnvelope, BiLock, BiShow, BiHide, BiLoader } from 'react-icons/bi';
import { HiOutlineCode } from 'react-icons/hi';
import { MdArrowForward } from 'react-icons/md';

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(api_base_url + "/login", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pwd
        })
      });

      const data = await response.json();
      
      if (data.success === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userId", data.userId);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed z-50 px-6 py-3 text-white bg-green-500 rounded-lg shadow-lg top-4 right-4';
        successMessage.textContent = 'Login successful! Redirecting...';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error or server not reachable");
      console.error(err);
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
            <h2 className="mb-2 text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400">Sign in to continue your coding journey</p>
          </div>

          {/* Login Form */}
          <form onSubmit={submitForm} className="space-y-6">
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
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 border bg-red-500/10 border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              className="flex items-center justify-center w-full py-3 space-x-2 font-medium text-white transition-all duration-200 transform bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <BiLoader className="text-xl animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <MdArrowForward className="text-xl" />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to="/signUp" 
                  className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>

          {/* Features */}
          <div className="pt-8 mt-8 border-t border-gray-800">
            <p className="mb-4 text-sm text-center text-gray-400">Why choose CodeIDE?</p>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Real-time collaborative coding</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Built-in live preview</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Cloud project storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <img
          className="object-cover w-full h-full"
          src={image}
          alt="Coding workspace"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h3 className="mb-4 text-4xl font-bold">Start Coding Today</h3>
            <p className="mb-8 text-xl text-gray-200">
              Build amazing web applications with our powerful online IDE
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">10K+</div>
                <div className="text-sm text-gray-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">50K+</div>
                <div className="text-sm text-gray-300">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">99%</div>
                <div className="text-sm text-gray-300">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;