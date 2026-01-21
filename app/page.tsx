import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
              Mnemonic AI
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              Never lose track of important content again. AI-powered semantic search makes finding your saved bookmarks effortless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <>
                  <Link
                    href="/bookmarks"
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg text-lg"
                  >
                    Go to Library
                  </Link>
                  <Link
                    href="/search"
                    className="px-8 py-4 bg-white dark:bg-zinc-900 border-2 border-gray-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors text-lg"
                  >
                    Search Bookmarks
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg text-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-white dark:bg-zinc-900 border-2 border-gray-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors text-lg"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
            {session && (
              <p className="mt-6 text-gray-500 dark:text-gray-400">
                Welcome back, <span className="font-medium text-gray-900 dark:text-white">{session.user?.name || session.user?.email}</span>
                {' • '}
                <form action="/api/auth/signout" method="post" className="inline">
                  <button type="submit" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Sign Out
                  </button>
                </form>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to organize, search, and rediscover your saved content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Semantic Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find bookmarks using natural language. Our AI understands context and meaning, not just keywords.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Vector Embeddings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced AI models create rich representations of your content for highly accurate similarity matching.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Rich Metadata
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Save URLs with titles and descriptions. Organize your knowledge base with meaningful context.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to supercharge your bookmark management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white font-bold text-2xl mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Save Bookmarks
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add URLs with optional titles and descriptions. Our AI processes and indexes your content automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-600 text-white font-bold text-2xl mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                AI Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vector embeddings are created for intelligent similarity matching and semantic understanding.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-600 text-white font-bold text-2xl mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Search & Discover
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Type natural queries and find exactly what you're looking for based on meaning, not just keywords.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 dark:bg-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users organizing their bookmarks with AI.
          </p>
          {session ? (
            <Link
              href="/add"
              className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-lg transition-colors shadow-lg text-lg"
            >
              Add Your First Bookmark
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-lg transition-colors shadow-lg text-lg"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
