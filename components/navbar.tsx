import styles from '../styles/Navbar.module.css'
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  const generateUserPanel = () => {
    return (
      <div className={styles.navbar__panel}>
        {user.name}
      </div>
    );
  };


  return (
    <div className={styles.navbar}>
      <div className={styles.navbar__content}>
        <div className={styles.logo}> Celtx Gem</div>
        {generateUserPanel()}
      </div>
    </div>
  );
}