'use client'

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input, Link, Divider } from "@nextui-org/react";

export default function SignIn() {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        signIn("credentials", { ...data, redirect: false })
            .then((callback) => {
                setIsLoading(false);
                if (callback?.error) {
                    console.error("Invalid credentials");
                }

                if (callback?.ok && !callback?.error) {
                    router.push('/');
                }
            })
            .catch(() => setIsLoading(false));
    }

    return (
        <div className="flex h-screen w-full">
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gradient-to-tr from-blue-600 to-violet-600 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 rounded-full bg-white/20 p-4 backdrop-blur-md">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Welcome to Mnemonic AI</h1>
                    <p className="text-lg text-white/80 max-w-md">
                        Securely access your intelligent dashboard and manage your data with ease.
                    </p>
                </div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/30 blur-3xl"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-500/30 blur-3xl"></div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center bg-background px-8">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
                        <p className="text-small text-default-500 mt-2">Enter your email and password to continue</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={loginUser}>
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
                        <div className="flex justify-between items-center px-1 py-2">
                            <Link href="#" size="sm" className="text-default-500">
                                Forgot password?
                            </Link>
                        </div>
                        <Button
                            type="submit"
                            color="primary"
                            variant="shadow"
                            isLoading={isLoading}
                            fullWidth
                            className="font-medium bg-gradient-to-tr from-blue-600 to-violet-600"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <Divider className="flex-1" />
                        <p className="text-tiny text-default-400 uppercase">OR</p>
                        <Divider className="flex-1" />
                    </div>

                    <p className="mt-8 text-center text-small text-default-500">
                        Don't have an account?{' '}
                        <Link href="/signup" size="sm" className="font-semibold text-primary cursor-pointer">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
