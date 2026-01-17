import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Mnemonic AI</h1>

      {session ? (
        <div>
          <p>Logged in as {session.user?.name || session.user?.email}</p>

          <nav>
            <ul>
              <li><Link href="/bookmarks">Library</Link></li>
              <li><Link href="/search">Search</Link></li>
              <li><Link href="/add">Add Bookmark</Link></li>
            </ul>
          </nav>

          <form action="/api/auth/signout" method="post">
            <button type="submit">Sign Out</button>
          </form>
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
          <Link href="/signin">
            <button>Sign In</button>
          </Link>
        </div>
      )}
    </div>
  );
}
