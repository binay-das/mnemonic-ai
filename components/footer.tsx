import Link from 'next/link';
import { Button, Divider } from '@nextui-org/react';

export function Footer() {
    return (
        <footer className="w-full border-t border-divider">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/features" className="text-sm text-default-500 hover:text-foreground transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/search" className="text-sm text-default-500 hover:text-foreground transition-colors">
                                    Search
                                </Link>
                            </li>
                            <li>
                                <Link href="/bookmarks" className="text-sm text-default-500 hover:text-foreground transition-colors">
                                    Library
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/docs" className="text-sm text-default-500 hover:text-foreground transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/api" className="text-sm text-default-500 hover:text-foreground transition-colors">
                                    API Reference
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-sm text-default-500 hover:text-foreground transition-colors">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Community</h3>
                        <div className="flex flex-col gap-3">
                            <Button
                                as={Link}
                                href="https://github.com/binay-das/mnemonic-ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="bordered"
                                size="sm"
                                fullWidth
                                startContent={
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                }
                            >
                                Star on GitHub
                            </Button>
                            <Button
                                as={Link}
                                href="https://github.com/binay-das"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="flat"
                                color="primary"
                                size="sm"
                                fullWidth
                            >
                                Developer
                            </Button>
                        </div>
                    </div>
                </div>

                <Divider className="my-6" />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-default-400">
                        © {new Date().getFullYear()} Mnemonic AI. All rights reserved.
                    </p>
                    <p className="text-sm text-default-400 flex items-center gap-1">
                        Built with{' '}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                        by
                        <Link
                            href="https://github.com/binay-das"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                        >
                            Binay
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
