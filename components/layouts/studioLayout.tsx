import BaseLayout from './baseLayout';
import Navbar from '../navbar';
import Sidebar from '../sidebar';

export default function StudioLayout({ children }: any) {
  return (
    <BaseLayout>
      <Navbar/>
      <Sidebar/>
      <div className={'studio-container'}>
        {children}
      </div>
    </BaseLayout>
  );
}