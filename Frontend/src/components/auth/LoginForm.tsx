
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { FormValues } from "@/types/auth";

const LoginForm = () => {
    const { login, loading, googleLogin } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            await login(data);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="title">Login</h2>
            <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                    type="email"
                    placeholder="Email"
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
                    placeholder="Password"
                    {...register("password", { required: "Password is required" })}
                />
            </div>
            {errors.password && (
                <span className="error-message">{errors.password.message}</span>
            )}

            <input type="submit" value={loading ? "Loading..." : "Login"} className="btn solid" disabled={loading} />

            <p className="social-text">Or login with</p>
            <div className="social-media">
                <a href="#" className="social-icon" onClick={e => { e.preventDefault(); googleLogin(); }}>
                    <i className="fab fa-google"></i>
                </a>
            </div>
        </form>
    );
};

export default LoginForm;
