/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/api/axios";
import {
  SmartphoneChargingIcon,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCircle,
  Check,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const errorMap: Record<
  string,
  { field: keyof SignupErrorsState; message: string }
> = {
  "Please provide a valid email": {
    field: "email",
    message: "Please provide valid email",
  },
  "password must be longer than or equal to 8 characters": {
    field: "password",
    message: "Password must be 8 characters long",
  },
  "Password too weak - must contain uppercase, lowercase, and number/special char":
    {
      field: "password",
      message: "Password too weak, combine numbers & special characters",
    },
  "Username can only contain letters, numbers, underscore and hyphen": {
    field: "username",
    message: "Username can only contain letters,numbers,_,-",
  },
  "username must be longer than or equal to 3 characters": {
    field: "username",
    message: "Username must be longer than 2 characters",
  },
  "Invalid first name": {
    field: "firstName",
    message: "Invalid name",
  },
  "Invalid last name": {
    field: "lastName",
    message: "Invalid name",
  },
};

interface UserDetails {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SignupErrorsState {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  //* Signup details
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  //* User Errors
  const [signupErrors, setSignupErrors] = useState<SignupErrorsState>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  //* Password and loading state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignUp = async () => {
    setIsLoading(true);
    //* 1.Validate user details
    if (userDetails.password.trim() !== confirmPassword) {
      setSignupErrors({ ...signupErrors, password: "Passwords don't match" });
      setIsLoading(false);
      return;
    }

    // Clear previous errors
    setSignupErrors({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
    });

    try {
      await api.post("/auth/signup", {
        ...userDetails,
      });
      // Redirect on success
      router.push("/login?signup=success");
    } catch (error: any) {
      if (error.response?.status === 409) {
        if (error.response.data.message === "username already exists") {
          setSignupErrors({
            ...signupErrors,
            username: "Username already exists",
          });
          setIsLoading(false);
          return;
        } else if (error.response.data.message === "email already exists") {
          setSignupErrors({ ...signupErrors, email: "Email already exists" });
          setIsLoading(false);
          return;
        }
      }

      if (error.response?.data?.message instanceof Array) {
        const verror = error.response.data.message as string[];
        const newErrors: SignupErrorsState = {
          email: "",
          password: "",
          username: "",
          firstName: "",
          lastName: "",
        };

        verror.forEach((errorMessage) => {
          // Find exact match
          for (const [key, value] of Object.entries(errorMap)) {
            if (errorMessage.includes(key)) {
              newErrors[value.field] = value.message;
              break; // Only take first match per field
            }
          }
        });

        setSignupErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render during SSR
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
            <div className="w-12 h-12 bg-linear-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Echo
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-white">
            Create Your Account
          </h2>
          <p className="text-slate-300 mt-2">
            Join Echo and start your journey
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userDetails.username}
                  onChange={(e) => {
                    setUserDetails({
                      ...userDetails,
                      username: e.target.value,
                    });
                    setSignupErrors({
                      ...signupErrors,
                      username: "",
                    });
                  }}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              </div>
              {signupErrors.username && (
                <p className="text-sm text-red-500">{signupErrors.username}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => {
                    setUserDetails({ ...userDetails, email: e.target.value });
                    setSignupErrors({
                      ...signupErrors,
                      email: "",
                    });
                  }}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              </div>
              {signupErrors.email && (
                <p className="text-sm text-red-500">{signupErrors.email}</p>
              )}
            </div>

            {/* Name Fields - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userDetails.firstName}
                    placeholder="First name"
                    onChange={(e) => {
                      setUserDetails({
                        ...userDetails,
                        firstName: e.target.value,
                      });
                      setSignupErrors({
                        ...signupErrors,
                        firstName: "",
                      });
                    }}
                    className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                  <UserCircle className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
                {signupErrors.firstName && (
                  <p className="text-sm text-red-500">
                    {signupErrors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userDetails.lastName}
                    placeholder="Last name"
                    onChange={(e) => {
                      setUserDetails({
                        ...userDetails,
                        lastName: e.target.value,
                      });
                      setSignupErrors({
                        ...signupErrors,
                        lastName: "",
                      });
                    }}
                    className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                  <UserCircle className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
                {signupErrors.lastName && (
                  <p className="text-sm text-red-500">
                    {signupErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Password Input with Strength Indicator */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={userDetails.password}
                  onChange={(e) => {
                    setUserDetails({
                      ...userDetails,
                      password: e.target.value,
                    });
                    setSignupErrors({
                      ...signupErrors,
                      password: "",
                    });
                  }}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 pl-11 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
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
              {signupErrors.password && (
                <p className="text-sm text-red-500">{signupErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setSignupErrors({
                      ...signupErrors,
                      password: "",
                    });
                  }}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 pl-11 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <Switch id="terms" />
              <label htmlFor="terms" className="text-sm text-slate-300">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Newsletter Opt-in */}
            <div className="flex items-start space-x-3">
              <Switch id="newsletter" />
              <label htmlFor="newsletter" className="text-sm text-slate-300">
                Send me product updates, tips, and announcements via email
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSignUp}
              className="w-full bg-linear-to-r from-cyan-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-cyan-600 hover:to-purple-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-slate-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Log in here
            </Link>
          </p>

          {/* Get App Button */}
          <button
            type="button"
            className="group bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <SmartphoneChargingIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Get the mobile app</span>
          </button>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-xs text-slate-300">Unlimited Storage</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xs text-slate-300">Secure & Encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
