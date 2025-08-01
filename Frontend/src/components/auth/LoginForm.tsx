"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock } from "lucide-react";

export type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { login, loading, googleLogin } = useAuth();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description:
          error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await googleLogin();
      console.log("Google Login Response:", res);
      // if (res) {
      //   toast({
      //     title: "Welcome!",
      //     description: "You have successfully logged in with Google.",
      //     variant: "default",
      //   });
      // }
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message || "Google login failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-2 px-4 md:px-6">
        <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
          Welcome Back
        </CardTitle>
        <p className="text-sm md:text-base text-gray-600">
          Sign in to your account
        </p>
      </CardHeader>
      <CardContent className="space-y-4 px-4 md:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-gray-700 font-medium text-sm md:text-base"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`pl-10 border-gray-200 focus:border-brand-primary/70 focus:ring-brand-primary/70 text-sm md:text-base ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <span className="text-xs md:text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-gray-700 font-medium text-sm md:text-base"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`pl-10 border-gray-200 focus:border-brand-primary/70 focus:ring-brand-primary/70 text-sm md:text-base ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password", { required: "Password is required" })}
              />
            </div>
            {errors.password && (
              <span className="text-xs md:text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs md:text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-brand-primary/70 focus:ring-brand-primary/70"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-gray-600 hover:text-black font-medium">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#D2DD27] hover:bg-[#A8B823] text-black font-medium py-2.5 transition-all duration-200 transform hover:scale-[1.02] text-sm md:text-base"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="relative my-4 md:my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 transition-all duration-200 text-sm md:text-base"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
