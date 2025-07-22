"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSignUpMode, setIsSignUpMode] = useState(pathname === "/register");

  // Update state when pathname changes (for browser back/forward)
  useEffect(() => {
    setIsSignUpMode(pathname === "/register");
  }, [pathname]);

  const toggleToSignUp = () => {
    setIsSignUpMode(true);
    router.push("/register"); // Changed from replace to push
  };

  const toggleToSignIn = () => {
    setIsSignUpMode(false);
    router.push("/login"); // Changed from replace to push
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Back to Home Button */}
      <button
        onClick={handleGoHome}
        type="button"
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-200 group text-sm md:text-base cursor-pointer"
        style={{ pointerEvents: "auto" }}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium">Home</span>
      </button>

      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Image and Content */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-brand-primary/70 to-brand-accent/70 relative overflow-hidden order-2 lg:order-1">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 flex flex-col justify-center items-center p-6 md:p-12 text-white text-center min-h-[300px] lg:min-h-full">
            <div className="mb-6 md:mb-8 transform hover:scale-105 transition-transform duration-300">
              <Image
                src={
                  isSignUpMode
                    ? "/assets/img/others/sign-up.svg"
                    : "/assets/img/others/login-two.svg"
                }
                alt={isSignUpMode ? "Sign Up" : "Login"}
                width={200}
                height={200}
                className="drop-shadow-2xl w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
              />
            </div>

            <div className="space-y-4 md:space-y-6 max-w-md">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-black">
                {isSignUpMode ? "Join Our Community" : "Welcome Back"}
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-black/90 leading-relaxed">
                {isSignUpMode
                  ? "Create an account and discover amazing deals and opportunities waiting for you."
                  : "Sign in to your account and continue your journey with us."}
              </p>

              {/* Toggle Button - Hidden on mobile, shown on desktop */}
              <div className="pt-4 hidden lg:block">
                <p className="text-black/80 mb-3 text-sm">
                  {isSignUpMode
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </p>
                <button
                  onClick={isSignUpMode ? toggleToSignIn : toggleToSignUp}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-black font-medium hover:bg-white/30 hover:scale-105 transition-all duration-200"
                >
                  {isSignUpMode ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 order-1 lg:order-2 min-h-screen lg:min-h-auto">
          <div className="w-full max-w-md space-y-6 md:space-y-8">
            {/* Mobile Toggle Buttons */}
            <div className="lg:hidden flex bg-gray-100 rounded-lg p-1 mb-6 md:mb-8">
              <button
                onClick={toggleToSignIn}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isSignUpMode
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Login
              </button>
              <button
                onClick={toggleToSignUp}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  isSignUpMode
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Container - No animation for simplicity */}
            <div className="relative">
              {isSignUpMode ? <RegisterForm /> : <LoginForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;