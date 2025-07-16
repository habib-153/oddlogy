
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
                    placeholder="Username"
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

            <input type="submit" className="btn" value={loading ? "Loading..." : "Sign up"} disabled={loading} />
        </form>
    );
};

export default RegisterForm;
