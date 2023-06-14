import { Session } from 'next-auth';
import type { AppProps } from 'next/app';
import { AppProvider } from '../components/appProvider';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from '../components/modal/modalProvider';
import { ContextMenu } from '../components/contextMenu/contextMenu';
import '../styles/index.scss';
import { ProtectedLayout } from '../components/layouts/protectedLayout';

type AppPropsWithAuth = AppProps & {
  Component: {
    requireAuth?: boolean;
  };
  session: Session;
};

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithAuth) {
  return (
    <AppProvider>
      <SessionProvider session={session}>
        <ContextMenu/>
        <ModalProvider>
          {Component.requireAuth ?
            <ProtectedLayout>
              <Component {...pageProps} />
            </ProtectedLayout>
          :
            <Component {...pageProps} />
          }
        </ModalProvider>
      </SessionProvider>
    </AppProvider>
  );
}
