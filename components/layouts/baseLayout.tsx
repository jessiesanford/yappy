import Head from 'next/head';

export default function BaseLayout({ children, title }: any) {
  return (
    <>
      <Head>
        <link rel="icon" href="/Users/Jessie/Desktop/dev/sc/janje/public/img/favicon/favicon.ico"/>
        <title>{title} | Neptune</title>
      </Head>
      <div className={'wrapper'}>
        {children}
      </div>
    </>
  );
}