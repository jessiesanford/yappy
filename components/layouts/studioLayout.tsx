import BaseLayout from './baseLayout';
import { StudioSidebar } from '../studio/studioSidebar';
import { StudioHeader } from '../studio/studioHeader';

export default function StudioLayout({ children, title }: any) {
  return (
    <BaseLayout title={title || 'Studio'}>
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

