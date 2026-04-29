'use client'

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthFormData, AuthLayout } from "@/components/AuthLayout";

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loginUser = async (e: React.FormEvent, data: AuthFormData) => {
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
        <AuthLayout
            mode="signin"
            onSubmit={loginUser}
            isLoading={isLoading}
        />
    )
}
