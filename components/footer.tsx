import styles from '../styles/Home.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Deutscher Bundestags (-scraper). All rights reserved.</p>
      
    </footer>
  );
}
