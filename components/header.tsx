export default function Header({ title } : any) {
  return (
    <div className={'header'}>
      <div className={'logo'}>HelloWorld!</div>
      <div className={'title'}>{title}</div>
    </div>
  )
}