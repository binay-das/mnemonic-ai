'use client'

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthFormData, AuthLayout } from "@/components/AuthLayout";

export default function SignUp() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const registerUser = async (e: React.FormEvent, data: AuthFormData) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/api/signup', data);

            if (response.status === 200) {
                await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });
                router.push('/');
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
        <AuthLayout
            mode="signup"
            onSubmit={registerUser}
            isLoading={isLoading}
        />
    )
}
