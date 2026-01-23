'use client';

import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Chip } from '@nextui-org/react';
import { Avatar } from '@nextui-org/react';
import { Divider } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { Footer } from '@/components/footer';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-4xl mx-auto text-center">
            <Chip
              variant="flat"
              color="primary"
              size="md"
              className="mb-6"
            >
              AI-Powered Search Technology
            </Chip>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
              Never lose track of important content
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              AI-powered semantic search makes finding your saved bookmarks effortless and intelligent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {session ? (
                <>
                  <Button
                    as={Link}
                    href="/bookmarks"
                    size="lg"
                    color="primary"
                    className="font-semibold px-8"
                  >
                    Go to Library
                  </Button>
                  <Button
                    as={Link}
                    href="/search"
                    size="lg"
                    variant="bordered"
                    color="primary"
                    className="font-semibold px-8"
                  >
                    Search Bookmarks
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    href="/signin"
                    size="lg"
                    color="primary"
                    className="font-semibold px-8"
                  >
                    Get Started
                  </Button>
                  <Button
                    as={Link}
                    href="/signup"
                    size="lg"
                    variant="bordered"
                    color="primary"
                    className="font-semibold px-8"
                  >
                    Sign Up Free
                  </Button>
                </>
              )}
            </div>



            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">500K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Bookmarks Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Search Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-gray-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Chip color="primary" variant="flat" className="mb-4">Features</Chip>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Search Technology
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enterprise-grade features designed for effortless bookmark management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-gray-200 dark:border-zinc-800" shadow="sm">
              <CardHeader className="pb-0 pt-6 px-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Semantic Search
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Find bookmarks using natural language. Our AI understands context and meaning, not just keywords.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-gray-200 dark:border-zinc-800" shadow="sm">
              <CardHeader className="pb-0 pt-6 px-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced vector embeddings create rich representations for instant, highly accurate search results.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-gray-200 dark:border-zinc-800" shadow="sm">
              <CardHeader className="pb-0 pt-6 px-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Private & Secure
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data is encrypted and stored securely. We never share your bookmarks with third parties.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <Divider />

      <div className="py-24 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Chip color="primary" variant="flat" className="mb-4">How It Works</Chip>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Three Simple Steps
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Start organizing your bookmarks in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Avatar
                  className="w-16 h-16 text-xl font-bold bg-blue-600"
                  name="1"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Save Bookmarks
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add URLs with titles and descriptions. Our AI automatically processes and indexes your content.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Avatar
                  className="w-16 h-16 text-xl font-bold bg-green-600"
                  name="2"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                AI Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vector embeddings are created for intelligent similarity matching and semantic understanding.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Avatar
                  className="w-16 h-16 text-xl font-bold bg-gray-700"
                  name="3"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Search & Discover
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Type natural queries and find exactly what you're looking for based on meaning, not just keywords.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
