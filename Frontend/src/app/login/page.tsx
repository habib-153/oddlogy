"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export type FormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, loading, googleLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      console.log(data)
      await login(data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="container mx-auto my-10 px-4">
      <h1 className="text-center text-4xl font-bold mb-8">
        Login <span className="text-brand-primary">Here</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
        <div className="hidden md:block">
          <Image
            src="https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg"
            width={500}
            height={500}
            alt="login page"
            className="w-full object-contain"
            priority
          />
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: true })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    Email is required
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: true })}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <span className="text-sm text-red-500">
                    Password is required
                  </span>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-brand-primary hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => googleLogin()}
              disabled={loading}
            >
              <Image
                src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
                width={20}
                height={20}
                alt="google logo"
                className="mr-2"
              />
              Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;