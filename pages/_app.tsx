import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ModalProvider } from '../components/modal/modalProvider';
import '../styles/index.scss';
import { hashPassword } from '../util/baseUtils';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </SessionProvider>
  );
}
