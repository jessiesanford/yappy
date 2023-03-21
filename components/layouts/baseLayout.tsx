export default function BaseLayout({ children }: any) {
  return (
    <div className={'wrapper'}>
      <div className={'alert-root'}/>
      {children}
      <div className={'modal-root'}/>
    </div>
  );
}