'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Button,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export function Header() {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const menuItems = session ? [
        { label: 'Library', href: '/bookmarks' },
        { label: 'Search', href: '/search' },
        { label: 'Profile', href: '/profile' },
    ] : [];

    return (
        <Navbar
            maxWidth="full"
            isBlurred
            isBordered={false}
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            classNames={{
                wrapper: "px-4 sm:px-6 lg:px-8 max-w-7xl"
            }}
            className='bg-white dark:bg-black'
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link href="/" className="font-bold text-foreground text-lg">
                        Mnemonic AI
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {session && (
                <NavbarContent className="hidden sm:flex gap-6" justify="center">
                    {menuItems.map((item) => (
                        <NavbarItem key={item.href}>
                            <Link
                                href={item.href}
                                className="text-foreground/60 hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            )}

            <NavbarContent justify="end">
                <NavbarItem>
                    {mounted && (
                        <Button
                            isIconOnly
                            variant="light"
                            aria-label="Toggle theme"
                            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="text-default-500"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </Button>
                    )}
                </NavbarItem>

                <NavbarItem>
                    {session ? (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    as="button"
                                    className="transition-transform"
                                    color="primary"
                                    name={(session.user?.name || session.user?.email || 'U').charAt(0).toUpperCase()}
                                    size="sm"
                                    isBordered
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold text-default-500">{session.user?.name || 'User'}</p>
                                    <p className="text-sm text-default-500">{session.user?.email}</p>
                                </DropdownItem>
                                <DropdownItem key="signout" color="danger" className='text-default-500' onClick={() => signOut()}>
                                    Sign Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <Button
                            as={Link}
                            href="/signin"
                            color="primary"
                            size="sm"
                            radius="full"
                        >
                            Sign In
                        </Button>
                    )}
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item.href}-${index}`}>
                        <Link
                            className="w-full text-foreground"
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
