"use client";
import { registerUser } from "@/utils/registerUser";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { UserData } from "@/types/auth";

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserData>();
    const router = useRouter();

    const onSubmit = async (data: UserData) => {
        console.log(data);

        try {
            const res = await registerUser(data);
            console.log(res);
            if (res.success) {
                alert(res.message);
                router.push("/login");
            }
        } catch (err: any) {
            console.error(err.message);
            throw new Error(err.message);
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

            <input type="submit" className="btn" value="Sign up" />

            <p className="social-text">Or sign in with</p>
            <div className="social-media">
                <a href="#" className="social-icon">
                    <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="social-icon">
                    <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                    <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="social-icon">
                    <i className="fab fa-google"></i>
                </a>
            </div>
        </form>
    );
};

export default RegisterForm;
