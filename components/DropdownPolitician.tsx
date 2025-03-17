import { useState } from "react";
import styles from "../styles/Home.module.css"; 

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickMenuItem = (item) => {
    console.log("Geklicktes Menü-Item:", item);
    setIsOpen(false); 
  };

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={toggleDropdown} className={styles.dropdownButton}>
        Effizientester Redner {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div
            className={styles.dropdownItem}
            onClick={() => handleClickMenuItem("Top Yapper")}>
            Top Yapper
          </div>
          <div
            className={styles.dropdownItem}
            onClick={() => handleClickMenuItem("Längste Reden")} >
            Längste Reden
          </div>
          <div
            className={styles.dropdownItem}
            onClick={() => handleClickMenuItem("Kürzeste Reden")}>
            Kürzeste Reden
          </div>
        </div>
      )}
    </div>
  );
}
