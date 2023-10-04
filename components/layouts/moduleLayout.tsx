import BaseLayout from './baseLayout';
import { StudioHeader } from '../studio/studioHeader';
import { ModuleHeader } from '../module/moduleHeader';

export default function ModuleLayout({ children, title, moduleName }: any) {
  return (
    <BaseLayout title={title}>
      <StudioHeader/>
      <ModuleHeader name={moduleName}/>
      <div>
        <div className={'module-container'}>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}