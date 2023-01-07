import styles from '../styles/Navbar.module.css'

export default function Navbar({ user }: any) {
  const generateUserPanel = () => {
    return (
      <div className={styles.navbar__panel}>
        User
      </div>
    )
  }

  const generateGuestPanel = () => {
    return (
      <div className={styles.navbar__panel}>
        Guest
      </div>
    )
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.navbar__content}>
        <div className={styles.logo}> Celtx Gem</div>
        {user ? generateUserPanel() : generateGuestPanel()}
      </div>
    </div>
  )
}