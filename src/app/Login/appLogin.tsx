'use client';

import React, { useState } from "react";
import Footer from "@/app/Home/footer";
import HeaderLogin from "@/app/Login/headerLogin";
import RegisterForm from "@/app/Login/registerForm";
import SigningForm from "@/app/Login/signingForm";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLogin />

      <div className="flex flex-grow py-5 items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-lg py-2 w-full max-w-xl">
          {/* Toggle Buttons */}
          <div className="flex justify-center py-5 space-x-6 mb-6">
            <button
              className={`px-6 py-4 rounded-lg ${
                !isSignUp ? "bg-black text-white" : "hover:bg-gray-500 hover:text-white bg-gray-200 text-gray-800"
              }`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button
              className={`px-6 py-3 rounded-lg ${
                isSignUp ? "bg-black text-white" : "hover:bg-gray-500 hover:text-white bg-gray-200 text-gray-800"
              }`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          {/* Content */}
          <div>
            {isSignUp ? (
              <>
                <h2 className="text-5xl font-semibold text-center mt-2">Regístrate</h2>
                <RegisterForm />
              </>
            ) : (
              <>
                <h2 className="text-5xl font-semibold text-center">Inicia sesión</h2>
                <SigningForm />
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
