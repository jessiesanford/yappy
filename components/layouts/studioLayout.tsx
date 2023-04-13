import BaseLayout from './baseLayout';
import Header from '../header/header';
import StudioSidebar from '../studio/studioSidebar';
import Head from 'next/head';
import { StudioToolbar } from '../studio/studioToolbar';

export default function StudioLayout({ children, title }: any) {
  return (
    <BaseLayout title={'Studio'}>
      <StudioSidebar/>
      <div className={'studio-container'}>
        <StudioToolbar/>
        {children}
      </div>
    </BaseLayout>
  );
}