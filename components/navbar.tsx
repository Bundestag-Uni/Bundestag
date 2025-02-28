import Link from 'next/link';
import { useRouter } from 'next/router'; // useRouter importieren
import styles from '../styles/Home.module.css';

export default function Navbar() {
  const router = useRouter(); // Router-Objekt erhalten

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        {[
          { href: "/", label: "Home" },
          { href: "/Personensuche", label: "Personensuche" },          
          { href: "/Yap", label: "Yap-o-Meter" },
          { href: "/Zwischenrufe", label: "Zwischenrufe" },
          { href: "/Methodik", label: "Methodik" },
        ].map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={router.pathname === href ? styles.activeLink : ""}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
