import Navbar from '../navbar'
import Sidebar from "../sidebar";

export default function BaseLayout({ children }: any) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={'container'}>
        {children}
      </div>
    </>
  )
}