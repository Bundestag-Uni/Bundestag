import { useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Dropdown({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Effizientester Redner");

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickMenuItem = (queryType, label) => {
    setSelectedLabel(label);
    if (onSelect) {
      onSelect(queryType);
    }

    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button onClick={toggleDropdown} className={styles.dropdownButton}>
        {selectedLabel} {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div
            className={styles.dropdownItem}
            onClick={() =>
              handleClickMenuItem("getEfficiencyTop5Person", "Effizientester Redner")
            }
          >
            Effizientester Redner
          </div>
          <div
            className={styles.dropdownItem}
            onClick={() =>
              handleClickMenuItem("getEfficiencyWorst5Person", "Top Yapper")
            }
          >
            Top Yapper
          </div>
          <div
            className={styles.dropdownItem}
            onClick={() =>
              handleClickMenuItem("getLongestRedenTop5Person", "Längste Reden")
            }
          >
            Längste Reden
          </div>
          <div
            className={styles.dropdownItem}
            onClick={() =>
              handleClickMenuItem("getLongestRedenWorst5Person", "Kürzeste Reden")
            }
          >
            Kürzeste Reden
          </div>
        </div>
      )}
    </div>
  );
}
