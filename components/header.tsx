import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.logoandtext}>
        <div className={styles.logo}>
          <Image src='/logo.png' alt='Site Logo' width='75' height='75'></Image>
          <Link href="/" className={styles.logotext}>Deutscher Bundestag (-scraper)</Link>
        </div>
      </nav>
    </header>
  );
}
