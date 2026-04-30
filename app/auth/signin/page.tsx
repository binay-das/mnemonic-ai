'use client'

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthFormData, AuthLayout } from "@/components/AuthLayout";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loginUser = async (e: React.FormEvent, data: AuthFormData) => {
        e.preventDefault();
        const email = data.email.trim().toLowerCase();

        if (!email || !data.password) {
            setError("Email and password are required");
            return;
        }

        if (!EMAIL_PATTERN.test(email)) {
            setError("Enter a valid email address");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const callback = await signIn("credentials", {
                email,
                password: data.password,
                redirect: false,
            });

            if (callback?.error) {
                setError("Invalid email or password");
                toast.error("Invalid email or password");
                return;
            }

            if (callback?.ok) {
                toast.success("Signed in successfully");
                router.push('/');
            }
        } catch {
            setError("Sign in failed. Please try again.");
            toast.error("Sign in failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            mode="signin"
            onSubmit={loginUser}
            isLoading={isLoading}
            errorMessage={error}
        />
    )
}
