'use client'

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { AuthFormData, AuthLayout } from "@/components/AuthLayout";

type SignupErrorResponse = {
    error: string;
};

export default function SignUp() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const registerUser = async (e: React.FormEvent, data: AuthFormData) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const email = data.email.trim().toLowerCase();
            const response = await axios.post('/api/signup', {
                ...data,
                email,
            });

            if (response.status === 201) {
                await signIn("credentials", {
                    email,
                    password: data.password,
                    redirect: false,
                });
                router.push('/');
            } else {
                setError("Registration failed");
            }
        } catch (error) {
            const axiosError = error as AxiosError<SignupErrorResponse>;
            setError(axiosError.response?.data?.error || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            mode="signup"
            onSubmit={registerUser}
            isLoading={isLoading}
            errorMessage={error}
        />
    )
}
