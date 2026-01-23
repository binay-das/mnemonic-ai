'use client'

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button, Input, Link, Divider } from "@nextui-org/react";

export default function SignUp() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/api/signup', data);

            if (response.status === 200) {
                await signIn(undefined, { callbackUrl: '/' });
                router.push('/signin')
            } else {
                console.error("Registration failed");
            }
        } catch (error) {
            console.error("Registration error", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex h-screen w-full">
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gradient-to-tr from-blue-600 to-violet-600 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 rounded-full bg-white/20 p-4 backdrop-blur-md">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Join Mnemonic AI</h1>
                    <p className="text-lg text-white/80 max-w-md">
                        Start your journey with us today and unlock the power of AI-driven memory.
                    </p>
                </div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/30 blur-3xl"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-500/30 blur-3xl"></div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center bg-background px-8">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
                        <p className="text-small text-default-500 mt-2">Sign up for a new account to get started</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={registerUser}>
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
                        <Button
                            type="submit"
                            color="primary"
                            variant="shadow"
                            isLoading={isLoading}
                            fullWidth
                            className="mt-2 font-medium bg-gradient-to-tr from-blue-600 to-violet-600"
                        >
                            Sign Up
                        </Button>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <Divider className="flex-1" />
                        <p className="text-tiny text-default-400 uppercase">OR</p>
                        <Divider className="flex-1" />
                    </div>

                    <p className="mt-8 text-center text-small text-default-500">
                        Already have an account?{' '}
                        <Link href="/signin" size="sm" className="font-semibold text-primary cursor-pointer">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
