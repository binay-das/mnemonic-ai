"use client";

import React from "react";
import { Button, Input, Link } from "@nextui-org/react";

export interface AuthFormData {
    name: string;
    email: string;
    password: string;
}

interface AuthLayoutProps {
    mode: "signin" | "signup";
    onSubmit: (e: React.FormEvent, data: AuthFormData) => Promise<void>;
    isLoading?: boolean;
    greetingTitle?: string;
    greetingDescription?: string;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    errorMessage?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    mode,
    onSubmit,
    isLoading = false,
    greetingTitle,
    greetingDescription,
    title,
    description,
    icon,
    errorMessage,
}) => {
    const [data, setData] = React.useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        onSubmit(e, data);
    };

    const isSignin = mode === "signin";

    const defaultGreetingTitle = isSignin
        ? "Welcome to Mnemonic AI"
        : "Join Mnemonic AI";
    const defaultGreetingDesc = isSignin
        ? "Securely access your intelligent dashboard and manage your data with ease."
        : "Start your journey with us today and unlock the power of AI-driven memory.";
    const defaultTitle = isSignin ? "Sign In" : "Create Account";
    const defaultDesc = isSignin
        ? "Enter your email and password to continue"
        : "Sign up for a new account to get started";

    return (
        <div className="flex min-h-screen w-full bg-[#fafaf9] dark:bg-[#0a0a0a]">
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-[#e7e7e7] bg-[#fafaf9] p-12 dark:border-[#2a2a2a] dark:bg-[#0a0a0a] lg:flex">
                <div className="flex items-center justify-between text-xs text-foreground/40 uppercase tracking-[0.15em] dark:text-white/40">
                    <span className="font-semibold text-foreground dark:text-white">Mnemonic AI</span>
                    <span>Private bookmark memory</span>
                </div>
                <div className="relative z-10 flex flex-col">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center border border-foreground/10 dark:border-white/10">
                        {icon || (
                            <svg
                                className="h-5 w-5 text-foreground/70 dark:text-white/70"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                            >
                                {isSignin ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                )}
                            </svg>
                        )}
                    </div>
                    <h1 className="mb-4 max-w-lg text-4xl font-semibold tracking-tight text-foreground dark:text-white">{greetingTitle || defaultGreetingTitle}</h1>
                    <p className="max-w-md text-sm leading-7 text-foreground/50 dark:text-white/50">
                        {greetingDescription || defaultGreetingDesc}
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-[11px] text-foreground/30 dark:text-white/30">
                    <div className="border-t border-foreground/10 pt-3 dark:border-white/10">Semantic recall</div>
                    <div className="border-t border-foreground/10 pt-3 dark:border-white/10">Fast capture</div>
                    <div className="border-t border-foreground/10 pt-3 dark:border-white/10">Clean library</div>
                </div>
            </div>

            <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-sm border border-[#e7e7e7] p-6 dark:border-[#2a2a2a] dark:bg-[#121212]">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title || defaultTitle}</h2>
                        <p className="mt-1.5 text-sm text-foreground/50">{description || defaultDesc}</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {!isSignin && (
                            <Input
                                label="Name"
                                placeholder="Enter your name"
                                type="text"
                                variant="bordered"
                                labelPlacement="outside"
                                isRequired
                                value={data.name}
                                onValueChange={(value) => setData({ ...data, name: value })}
                                classNames={{
                                    label: "text-foreground/50 text-xs uppercase tracking-[0.1em] font-medium",
                                    input: "text-foreground text-sm",
                                    inputWrapper: "border-[#e7e7e7] hover:border-foreground/20 focus-within:!border-[#0d7a6b] dark:border-[#2a2a2a] bg-transparent",
                                }}
                            />
                        )}
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            variant="bordered"
                            labelPlacement="outside"
                            isRequired
                            value={data.email}
                            onValueChange={(value) => setData({ ...data, email: value })}
                            classNames={{
                                label: "text-foreground/50 text-xs uppercase tracking-[0.1em] font-medium",
                                input: "text-foreground text-sm",
                                inputWrapper: "border-[#e7e7e7] hover:border-foreground/20 focus-within:!border-[#0d7a6b] dark:border-[#2a2a2a] bg-transparent",
                            }}
                        />
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            variant="bordered"
                            labelPlacement="outside"
                            isRequired
                            value={data.password}
                            onValueChange={(value) => setData({ ...data, password: value })}
                            classNames={{
                                label: "text-foreground/50 text-xs uppercase tracking-[0.1em] font-medium",
                                input: "text-foreground text-sm",
                                inputWrapper: "border-[#e7e7e7] hover:border-foreground/20 focus-within:!border-[#0d7a6b] dark:border-[#2a2a2a] bg-transparent",
                            }}
                        />

                        <Button
                            type="submit"
                            color="primary"
                            isLoading={isLoading}
                            fullWidth
                            radius="none"
                            className="mt-2 font-medium text-sm h-10"
                        >
                            {isSignin ? "Sign In" : "Sign Up"}
                        </Button>

                        {errorMessage && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errorMessage}
                            </p>
                        )}
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-[#e7e7e7] dark:bg-[#2a2a2a]"></div>
                        <p className="text-[11px] text-foreground/30 uppercase tracking-[0.15em]">OR</p>
                        <div className="flex-1 h-px bg-[#e7e7e7] dark:bg-[#2a2a2a]"></div>
                    </div>

                    <p className="mt-6 text-center text-sm text-foreground/50">
                        {isSignin ? "Don't have an account? " : "Already have an account? "}
                        <Link
                            href={isSignin ? "/auth/signup" : "/auth/signin"}
                            size="sm"
                            className="font-medium text-[#0d7a6b] dark:text-[#2dccc0] cursor-pointer"
                        >
                            {isSignin ? "Create account" : "Sign in"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
