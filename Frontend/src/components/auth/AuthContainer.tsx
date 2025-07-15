"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import '../../styles/auth.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthContainer = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isSignUpMode, setIsSignUpMode] = useState(pathname === '/register');

    // Update state when pathname changes (for browser back/forward)
    useEffect(() => {
        setIsSignUpMode(pathname === '/register');
    }, [pathname]);

    const toggleToSignUp = () => {
        setIsSignUpMode(true);
        // Wait for the main transition to complete before navigating
        // Main transition is now 2.3s (1.5s + 0.8s delay), background is 2.2s
        // We'll wait 1500ms to let the transition be visible and smooth
        setTimeout(() => {
            if (pathname !== '/register') {
                router.replace('/register');
            }
        }, 1500);
    };

    const toggleToSignIn = () => {
        setIsSignUpMode(false);
        // Wait for the main transition to complete before navigating
        // Same timing for consistency in both directions
        setTimeout(() => {
            if (pathname !== '/login') {
                router.replace('/login');
            }
        }, 1500);
    };

    return (
        <div className="auth-page">
            <section id="magnetMultiForm" className="magnet login magnetMultiForm">
                <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
                    <div className="forms-container">
                        <div className="signin-signup">
                            <LoginForm />
                            <RegisterForm />
                        </div>
                    </div>

                    <div className="panels-container">
                        <div className="panel left-panel">
                            <div className="content">
                                <h3>Are you New here ?</h3>
                                <p>
                                    Join us for great deals, don&apos;t miss any chance to grab them
                                </p>
                                <button className="btn transparent" onClick={toggleToSignUp}>
                                    Sign up
                                </button>
                            </div>
                            <Image src="/assets/img/others/login-two.svg" className="image" alt="" width={300} height={300} />
                        </div>
                        <div className="panel right-panel">
                            <div className="content">
                                <h3>Are you one of us ?</h3>
                                <p>
                                    Quickly login so you don&apos;t miss great deals, don&apos;t miss any chance to grab them
                                </p>
                                <button className="btn transparent" onClick={toggleToSignIn}>
                                    Login
                                </button>
                            </div>
                            <Image src="/assets/img/others/sign-up.svg" className="image" alt="" width={300} height={300} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AuthContainer;
