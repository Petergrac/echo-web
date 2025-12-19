"use client";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/api/axios";
import axios from "axios";
import {
  SmartphoneChargingIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const LoginPage = () => {
  //* Page States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //* Use router instead of redirect
  const router = useRouter();

  //* Zustand usage - add initialization check
  const [isClient, setIsClient] = useState(false);

  //* Response Errors
  const [emError, setEmError] = useState("");
  const [passError, setPassError] = useState("");

  const [errorStatus, setStatus] = useState({
    emailError: false,
    passwordError: false,
  });

  // Ensure client-side only for Zustand
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async () => {
    if (email.trim().length === 0) {
      setStatus({ ...errorStatus, emailError: true });
      return;
    }
    if (password.trim().length < 8) {
      setStatus({ ...errorStatus, passwordError: true });
      return;
    }
    setIsLoading(true);
    try {
      let isEmail = false;
      if (email.includes("@")) {
        isEmail = true;
      }
      await axios.post(
        "api/backend/auth/login",
        isEmail
          ? {
              email,
              password,
            }
          : { username: email, password }
      );

      router.push("/feed");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message instanceof Array) {
        setStatus({ ...errorStatus, emailError: true });
        setEmError(error.response.data.message[0]);
      } else {
        setStatus({ ...errorStatus, passwordError: true });
        setPassError(error.response?.data?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-linear-to-r from-cyan-500 to-purple-500 rounded-xl animate-pulse"></div>
          <h1 className="text-4xl font-bold mt-4 bg-linear-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Echo
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header with animation */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Echo
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
          <p className="text-slate-300 mt-2">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            {/* Username/Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Username or Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your email or username"
                  value={email} // ← Add value binding
                  className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  // Remove required attribute
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus({ ...errorStatus, emailError: false });
                    setEmError("");
                  }}
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              </div>
              {errorStatus.emailError && (
                <p className="text-sm text-red-500">
                  {emError ? emError : "Username/Email cannot be empty"}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  href="/forgot-password" // Use actual route
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password} // ← Add value binding
                  className="w-full px-4 py-3 pl-11 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  // Remove required attribute
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setStatus({ ...errorStatus, passwordError: false });
                    setPassError("");
                  }}
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errorStatus.passwordError && (
                <p className="text-sm text-red-500">
                  {passError ? passError : "Password must be 8 characters long"}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <Switch id="remember" />
              <label htmlFor="remember" className="text-sm text-slate-300">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="button" // Change from "submit" to "button"
              disabled={isLoading}
              onClick={handleLogin}
              className="w-full bg-linear-to-r from-cyan-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-cyan-600 hover:to-purple-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-slate-300">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register`}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Sign up now
            </Link>
          </p>

          {/* Get App Button */}
          <button className="group bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3 mx-auto">
            <SmartphoneChargingIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Get the mobile app</span>
          </button>

          {/* Footer */}
          <p className="text-sm text-slate-400 pt-4">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-slate-300 transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
