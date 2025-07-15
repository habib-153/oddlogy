"use client";
import { loginUser } from "@/utils/loginUser";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormValues } from "@/types/auth";

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const router = useRouter();

    const onSubmit = async (data: FormValues) => {
        console.log(data);
        try {
            const res = await loginUser(data);
            console.log(res);
            if (res?.data?.accessToken) {
                alert(res.message);
                localStorage.setItem("accessToken", res.accessToken);
                router.push("/");
            }
        } catch (err: any) {
            console.error(err.message);
            throw new Error(err.message);
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

            <input type="submit" value="Login" className="btn solid" />

            <p className="social-text">Or login with</p>
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

export default LoginForm;
