import { useRouter } from 'next/router';

export const HeaderNavItem = ({ name, link }: { name: string, link: string }) => {
  const router = useRouter();

  return (
    <div className={'header-nav__item'}
         onClick={() => {
           router.push(link);
         }}
    >
      {name}
    </div>
  );
};