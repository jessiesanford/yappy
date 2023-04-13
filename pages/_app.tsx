import { Session } from 'next-auth';
import type { AppProps } from 'next/app';
import { AppProvider } from '../components/appProvider';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from '../components/modal/modalProvider';
import { ContextMenu } from '../components/contextMenu/contextMenu';
import '../styles/index.scss';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  return (
    <AppProvider>
      <SessionProvider session={session}>
        <ContextMenu/>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </SessionProvider>
    </AppProvider>
  );
}
