"use client";

import React from "react";
import { Button, Input, Link, Divider } from "@nextui-org/react";

interface AuthLayoutProps {
    mode: "signin" | "signup";
    onSubmit: (e: React.FormEvent, data: any) => Promise<void>;
    isLoading?: boolean;
    greetingTitle?: string;
    greetingDescription?: string;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
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
        <div className="flex h-screen w-full">
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gradient-to-tr from-blue-600 to-violet-600 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 rounded-full bg-white/20 p-4 backdrop-blur-md">
                        {icon || (
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {isSignin ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                )}
                            </svg>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{greetingTitle || defaultGreetingTitle}</h1>
                    <p className="text-lg text-white/80 max-w-md">
                        {greetingDescription || defaultGreetingDesc}
                    </p>
                </div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/30 blur-3xl"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-500/30 blur-3xl"></div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center bg-background px-8">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground">{title || defaultTitle}</h2>
                        <p className="text-small text-default-500 mt-2">{description || defaultDesc}</p>
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
                                    label: "text-default-600 font-medium",
                                    input: "text-foreground",
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
                                label: "text-default-600 font-medium",
                                input: "text-foreground",
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
                                label: "text-default-600 font-medium",
                                input: "text-foreground",
                            }}
                        />

                        {isSignin && (
                            <div className="flex justify-between items-center px-1 py-2">
                                <Link href="#" size="sm" className="text-default-500">
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        <Button
                            type="submit"
                            color="primary"
                            variant="shadow"
                            isLoading={isLoading}
                            fullWidth
                            className="mt-2 font-medium bg-gradient-to-tr from-blue-600 to-violet-600"
                        >
                            {isSignin ? "Sign In" : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <Divider className="flex-1" />
                        <p className="text-tiny text-default-400 uppercase">OR</p>
                        <Divider className="flex-1" />
                    </div>

                    <p className="mt-8 text-center text-small text-default-500">
                        {isSignin ? "Don't have an account? " : "Already have an account? "}
                        <Link
                            href={isSignin ? "/auth/signup" : "/auth/signin"}
                            size="sm"
                            className="font-semibold text-primary cursor-pointer"
                        >
                            {isSignin ? "Create an account" : "Log in here"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
