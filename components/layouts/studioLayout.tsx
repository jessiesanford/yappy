import BaseLayout from './baseLayout';
import Header from '../header/header';
import StudioSidebar from '../studio/studioSidebar';
import Head from 'next/head';
import { StudioToolbar } from '../studio/studioToolbar';
import { StudioHeader } from '../studio/studioHeader';

export default function StudioLayout({ children, title }: any) {
  return (
    <BaseLayout title={'Studio'}>
      <StudioHeader/>
      <div>
        <StudioSidebar/>
        <div className={'studio-container'}>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}