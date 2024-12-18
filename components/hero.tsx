import styles from '../styles/Home.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Welcome to Our Curated Data Portal</h1>
        <p>Explore the most important data and resources carefully curated for you.</p>
      </div>
    </section>
  );
}
