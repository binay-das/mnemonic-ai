'use client';

import Link from 'next/link';
import { Button, Divider } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { Footer } from '@/components/footer';

const features = [
  {
    title: 'Meaning-first retrieval',
    body: 'Search by the idea you remember, even when the saved title used different words.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    title: 'Fast capture',
    body: 'Save the URL, add the useful context, and keep moving without turning your library into chores.',
    icon: 'M12 4v16m8-8H4',
  },
  {
    title: 'Private library',
    body: 'A focused space for your links, notes, and references without social feeds or visual noise.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
];

const steps = ['Save a useful page', 'Add the context you care about', 'Ask for it naturally later'];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1c1c] dark:bg-[#0a0a0a] dark:text-[#e8e8e6]">
      <section className="border-b border-[#e7e7e7] dark:border-[#2a2a2a]">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-[#0d7a6b] dark:text-[#2dccc0]">
              <span className="h-px w-6 bg-current"></span>
              Semantic bookmark memory
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Find the link by remembering the thought.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-foreground/60 dark:text-foreground/60">
              Mnemonic AI turns a messy bookmark pile into a clean, searchable reference system for the things you actually want to revisit.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {session ? (
                <>
                  <Button as={Link} href="/bookmarks" size="md" color="primary" radius="none" className="font-medium h-10 px-5 text-sm">
                    Open Library
                  </Button>
                  <Button as={Link} href="/search" size="md" variant="bordered" radius="none" className="font-medium h-10 px-5 text-sm border-[#e7e7e7] dark:border-[#2a2a2a]">
                    Search Bookmarks
                  </Button>
                </>
              ) : (
                <>
                  <Button as={Link} href="/auth/signin" size="md" color="primary" radius="none" className="font-medium h-10 px-5 text-sm">
                    Get Started
                  </Button>
                  <Button as={Link} href="/auth/signup" size="md" variant="bordered" radius="none" className="font-medium h-10 px-5 text-sm border-[#e7e7e7] dark:border-[#2a2a2a]">
                    Create Account
                  </Button>
                </>
              )}
            </div>

            <div className="mt-12 flex max-w-md gap-8 border-t border-[#e7e7e7] py-5 dark:border-[#2a2a2a]">
              <div>
                <div className="text-xl font-semibold tracking-tight">10K+</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-foreground/40">Users</div>
              </div>
              <div>
                <div className="text-xl font-semibold tracking-tight">500K+</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-foreground/40">Links</div>
              </div>
              <div>
                <div className="text-xl font-semibold tracking-tight">99.9%</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-foreground/40">Recall</div>
              </div>
            </div>
          </div>

          <div className="border border-[#e7e7e7] dark:border-[#2a2a2a] p-5 dark:bg-[#121212]">
            <div className="mb-4 flex items-center justify-between border-b border-[#e7e7e7] pb-4 dark:border-[#2a2a2a]">
              <div>
                <p className="text-sm font-medium">Library search</p>
                <p className="text-xs text-foreground/40">Natural language query</p>
              </div>
              <div className="rounded-sm bg-[#0d7a6b] px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-[#2dccc0] dark:text-[#0a0a0a]">
                Live
              </div>
            </div>
            <div className="border border-[#e7e7e7] bg-[#fafaf9] p-3 dark:border-[#2a2a2a] dark:bg-[#0a0a0a]">
              <p className="text-xs text-foreground/40">Query</p>
              <p className="mt-1 text-sm font-medium">papers about durable note systems</p>
            </div>
            <div className="mt-3 space-y-2">
              {['Vector search notes', 'Knowledge base architecture', 'Personal memory systems'].map((item, index) => (
                <div key={item} className="border border-[#e7e7e7] p-3 dark:border-[#2a2a2a]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">{item}</p>
                    <span className="text-[11px] font-semibold text-[#0d7a6b] dark:text-[#2dccc0]">{95 - index * 8}%</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-foreground/45 dark:text-foreground/45">
                    Saved reference with enough context to recover why it mattered.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d7a6b] dark:text-[#2dccc0]">Core tools</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Built for retrieval, not hoarding.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-foreground/55">
              Minimal surfaces, explicit actions, and search that respects how memory actually works.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="border border-[#e7e7e7] p-5 dark:border-[#2a2a2a] dark:bg-[#121212]">
                <div className="mb-4 flex h-9 w-9 items-center justify-center border border-[#e7e7e7] bg-[#fafaf9] text-[#0d7a6b] dark:border-[#2a2a2a] dark:bg-[#0a0a0a] dark:text-[#2dccc0]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/55">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider className="bg-[#e7e7e7] dark:bg-[#2a2a2a]" />

      <section className="bg-[#ffffff] py-20 dark:bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d7a6b] dark:text-[#2dccc0]">Workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A quiet loop for better recall.</h2>
            </div>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step} className="grid grid-cols-[auto_1fr] gap-4 border border-[#e7e7e7] p-4 dark:border-[#2a2a2a]">
                  <div className="flex h-7 w-7 items-center justify-center bg-[#1c1c1c] text-xs font-semibold text-white dark:bg-[#e8e8e6] dark:text-[#1c1c1c]">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{step}</h3>
                    <p className="mt-1 text-xs leading-5 text-foreground/50">
                      Keep the capture small, searchable, and easy to trust when you return to it.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
