
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { UserData } from "@/types/auth";

const RegisterForm = () => {
  const { register: registerUserFunc, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>();

  const onSubmit = async (data: UserData) => {
    try {
      await registerUserFunc(data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form className="sign-up-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="title">Sign Up</h2>
      <div className="input-field">
        <i className="fas fa-user"></i>
        <input
          type="text"
          placeholder="username"
          {...register("name", { required: "Name is required" })}
        />
      </div>
      {errors.name && (
        <span className="error-message">{errors.name.message}</span>
      )}

      <div className="input-field">
        <i className="fas fa-envelope"></i>
        <input
          type="email"
          placeholder="email"
          {...register("email", { required: "Email is required" })}
        />
      </div>
      {errors.email && (
        <span className="error-message">{errors.email.message}</span>
      )}

      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          type="password"
          placeholder="password"
          {...register("password", { required: "Password is required" })}
        />
      </div>
      {errors.password && (
        <span className="error-message">{errors.password.message}</span>
      )}

      <input type="submit" className="btn" value={loading ? "Loading..." : "Sign up"} disabled={loading} />
      <p className="social-text">Or sign in with</p>
      <div className="social-media">
        <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
        <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
        <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
        <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
      </div>
    </form>
  );
};

export default RegisterForm;
