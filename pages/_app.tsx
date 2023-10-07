import { Session } from 'next-auth';
import type { AppProps } from 'next/app';
import { Router } from 'next/router';
import { useEffect, useState } from 'react';
import { AppProvider } from '../components/appProvider';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from '../components/modal/modalProvider';
import { ContextMenu } from '../components/contextMenu/contextMenu';
import { ProtectedLayout } from '../components/layouts/';
import { ProcessingIndicator } from '../components/processingIndicator/processingIndicator';
import '../styles/index.scss';

type AppPropsWithAuth = AppProps & {
  Component: {
    requireAuth?: boolean;
  };
  session: Session;
};

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithAuth) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return (
    <>
      {
        // loading ? (<LoadingSplash/>) :
          <AppProvider>
            <SessionProvider session={session}>
              <ContextMenu/>
              <ProcessingIndicator/>
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
      }
    </>
  );
}
