'use client';

import React, { useState } from "react";
import Footer from "@/app/Home/footer";
import Header from "@/app/Login/headerLogin";
import RegisterForm from "@/app/Login/registerForm";
import SigningForm from "@/app/Login/signingForm";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex items-center justify-center py-8">
        <div className="bg-white shadow-lg rounded-lg py-2 w-full max-w-xl">
          {/* Toggle Buttons */}
          <div className="flex justify-center py-5 space-x-6 mb-6">
            <button
              className={`px-6 py-4 rounded-lg ${
                !isSignUp ? "bg-black text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button
              className={`px-6 py-3 rounded-lg ${
                isSignUp ? "bg-black text-white" : "bg-gray-200 text-gray-800"
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
                <h2 className="text-5xl font-semibold text-center">Sign Up</h2>
                <RegisterForm />
              </>
            ) : (
              <>
                <h2 className="text-5xl font-semibold text-center">Sign In</h2>
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
