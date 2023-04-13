import Head from 'next/head';
import Header from '../header/header';

export default function BaseLayout({ children, title }: any) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={'wrapper'}>
        <Header/>
        {children}
      </div>
    </>
  );
}