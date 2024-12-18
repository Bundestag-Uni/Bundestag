import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Navbar() {
  return (
      <nav className={styles.navbar}>
        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/Jucktz">Wen Jucktz</Link></li>
          <li><Link href="/Yap">Yap-o-Meter</Link></li>
          <li><Link href="/Zwischenrufe">Zwischenrufe</Link></li>
          <li><Link href="/Methodik">Methodik</Link></li>
        </ul>
      </nav>
    
  );
}
