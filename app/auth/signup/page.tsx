'use client'

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { AuthFormData, AuthLayout } from "@/components/AuthLayout";

type SignupErrorResponse = {
    error: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignupForm(data: AuthFormData) {
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();

    if (!name || !email || !data.password) {
        return "Name, email, and password are required";
    }

    if (name.length < 2 || name.length > 80) {
        return "Name must be between 2 and 80 characters";
    }

    if (!EMAIL_PATTERN.test(email)) {
        return "Enter a valid email address";
    }

    if (
        data.password.length < 8 ||
        !/[A-Z]/.test(data.password) ||
        !/[a-z]/.test(data.password) ||
        !/[0-9]/.test(data.password)
    ) {
        return "Password must be at least 8 characters and include uppercase, lowercase, and number";
    }

    return "";
}

export default function SignUp() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const registerUser = async (e: React.FormEvent, data: AuthFormData) => {
        e.preventDefault();
        const validationError = validateSignupForm(data);

        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const email = data.email.trim().toLowerCase();
            const name = data.name.trim();
            const response = await axios.post('/api/signup', {
                ...data,
                email,
                name,
            });

            if (response.status === 201) {
                await signIn("credentials", {
                    email,
                    password: data.password,
                    redirect: false,
                });
                toast.success("Account created successfully");
                router.push('/');
            } else {
                setError("Registration failed");
                toast.error("Registration failed");
            }
        } catch (error) {
            const axiosError = error as AxiosError<SignupErrorResponse>;
            const message = axiosError.response?.data?.error || "Registration failed";
            setError(message);
            toast.error(message);
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
