"use client";

import React, { useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import Link from "next/link";

export default function RegisterPage() {
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [authErrors, setAuthErrors] = useState<Record<string, string | null>>({
    username: null, email: null, password: null, confirm: null,
  });
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [authShake, setAuthShake] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const d = {
    authSignUp: "CREATE ACCOUNT",
    authUsernamePlaceholder: "USERNAME",
    authEmailPlaceholder: "EMAIL ADDRESS",
    authPasswordPlaceholder: "PASSWORD",
    authConfirmPlaceholder: "CONFIRM PASSWORD",
    authSignUpBtn: "CREATE ACCOUNT \u2192",
    authGoogleBtn: "CONTINUE WITH GOOGLE",
    authErrUsername: "USERNAME IS REQUIRED.",
    authErrEmail: "ENTER A VALID EMAIL ADDRESS.",
    authErrPassword: "PASSWORD MUST BE AT LEAST 6 CHARACTERS.",
    authErrConfirm: "PASSWORDS DO NOT MATCH.",
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrorMessage(null);
    setSuccessMessage(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors: Record<string, string | null> = { username: null, email: null, password: null, confirm: null };
    let hasError = false;

    if (!authUsername.trim()) { newErrors.username = d.authErrUsername; hasError = true; }
    if (!authEmail.trim() || !emailRegex.test(authEmail)) {
      newErrors.email = d.authErrEmail; hasError = true;
    }
    if (authPassword.length < 6) { newErrors.password = d.authErrPassword; hasError = true; }
    if (authPassword !== authConfirmPassword) { newErrors.confirm = d.authErrConfirm; hasError = true; }

    setAuthErrors(newErrors);
    if (hasError) { 
      setAuthShake(true);
      setTimeout(() => setAuthShake(false), 600);
      return; 
    }

    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
      options: {
        data: { username: authUsername.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) {
      setAuthErrorMessage(error.message);
      setAuthShake(true);
      setTimeout(() => setAuthShake(false), 600);
    } else {
      setSuccessMessage("Registration successful! Please check your email to verify or log in.");
      setAuthUsername("");
      setAuthEmail("");
      setAuthPassword("");
      setAuthConfirmPassword("");
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'openid email profile',
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      }
    });
    if (error) console.error("Supabase Google Auth Error:", error);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div
        className={`relative w-full max-w-md p-8 md:p-12 shadow-2xl transition-all duration-300 bg-white ${authShake ? 'shake-brutal' : ''}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl text-black font-bold tracking-tight uppercase">
            {d.authSignUp}
          </h2>
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-60 transition-opacity"
          >
            LOGIN
          </Link>
        </div>

        {/* Clean Form */}
        <form onSubmit={handleAuth} noValidate className="space-y-8 text-black">
          
          {/* USERNAME */}
          <div className="relative">
            <label htmlFor="auth-username" className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
              {d.authUsernamePlaceholder}
            </label>
            <input
              id="auth-username"
              type="text"
              value={authUsername}
              onChange={(e) => { setAuthUsername(e.target.value); setAuthErrors(prev => ({ ...prev, username: null })); }}
              className={`w-full bg-transparent border-b py-2 text-lg focus:outline-none transition-colors ${authErrors.username ? 'border-red-500 text-red-500' : 'border-gray-300 focus:border-black'}`}
            />
            {authErrors.username && <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-widest">{authErrors.username}</p>}
          </div>

          {/* EMAIL */}
          <div className="relative">
            <label htmlFor="auth-email" className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
              {d.authEmailPlaceholder}
            </label>
            <input
              id="auth-email"
              type="email"
              value={authEmail}
              onChange={(e) => { setAuthEmail(e.target.value); setAuthErrors(prev => ({ ...prev, email: null })); }}
              className={`w-full bg-transparent border-b py-2 text-lg focus:outline-none transition-colors ${authErrors.email ? 'border-red-500 text-red-500' : 'border-gray-300 focus:border-black'}`}
            />
            {authErrors.email && <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-widest">{authErrors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label htmlFor="auth-password" className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
              {d.authPasswordPlaceholder}
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={authPassword}
                onChange={(e) => { setAuthPassword(e.target.value); setAuthErrors(prev => ({ ...prev, password: null })); }}
                className={`w-full bg-transparent border-b py-2 text-lg pr-16 focus:outline-none transition-colors ${authErrors.password ? 'border-red-500 text-red-500' : 'border-gray-300 focus:border-black'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {authErrors.password && <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-widest">{authErrors.password}</p>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <label htmlFor="auth-confirm" className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
              {d.authConfirmPlaceholder}
            </label>
            <div className="relative">
              <input
                id="auth-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                value={authConfirmPassword}
                onChange={(e) => { setAuthConfirmPassword(e.target.value); setAuthErrors(prev => ({ ...prev, confirm: null })); }}
                className={`w-full bg-transparent border-b py-2 text-lg pr-16 focus:outline-none transition-colors ${authErrors.confirm ? 'border-red-500 text-red-500' : 'border-gray-300 focus:border-black'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 bottom-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {authErrors.confirm && <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-widest">{authErrors.confirm}</p>}
          </div>

          {/* Global Messages */}
          {(authErrorMessage || successMessage) && (
            <div className="pt-2">
              {authErrorMessage && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">{authErrorMessage}</p>}
              {successMessage && <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest text-center">{successMessage}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 bg-[#111] text-white hover:bg-black"
          >
            {d.authSignUpBtn}
          </button>
        </form>

        {/* Footer Links & Google */}
        <div className="mt-10 flex flex-col gap-4">
          <Link
            href="/"
            className="text-center text-[10px] font-bold uppercase tracking-widest transition-colors text-gray-500 hover:text-black"
          >
            ALREADY HAVE AN ACCOUNT? SIGN IN.
          </Link>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-3 mt-2 flex items-center justify-center gap-3 border text-[10px] font-bold uppercase tracking-widest transition-colors border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {d.authGoogleBtn}
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes shake-brutal-anim {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .shake-brutal { animation: shake-brutal-anim 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
