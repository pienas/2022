import Head from 'next/head';
import { useAuth } from '../../lib/auth';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

export default function ManageLogin() {
  const auth = useAuth();
  return (
    <div>
      <Head>
        <title>Prisijungti - 2022</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                if (document.cookie && document.cookie.includes('auth')) {
                  window.location.href = "/manage"
                }
              `
          }}
        />
      </Head>

      <main>
        {!auth?.user && (
          <button onClick={() => auth.signinWithGoogle()}>Prisijungti</button>
        )}
        {auth?.user && (
          <div>
            <NextLink href="/manage" passHref>
              <Link color="teal.500" fontWeight="medium">
                Valdymas
              </Link>
            </NextLink>
            <br />
            <button onClick={() => auth.signout()}>Atsijungti</button>
          </div>
        )}
      </main>
    </div>
  );
}
