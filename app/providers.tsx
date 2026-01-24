'use client';

import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <SessionProvider>
            <NextUIProvider navigate={router.push}>
                <NextThemesProvider attribute="class" defaultTheme="system">
                    {children}
                    <Toaster richColors />
                </NextThemesProvider>
            </NextUIProvider>
        </SessionProvider>
    );
}
