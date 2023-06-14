import Head from 'next/head';
import Header from '../header/header';

export default function BaseLayout({ children, title }: any) {
  return (
    <>
      <Head>
        <link rel="icon" href="/img/favicon/favicon.ico" />
        <title>{title}</title>
      </Head>
      <div className={'wrapper'}>
        {children}
      </div>
    </>
  );
}