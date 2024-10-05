import React from "react";
import styles from "./Navbar.module.scss";
const Navbar = () => {
  return (
    <nav>
      <h1 className={styles.title}>Добро пожаловать!</h1>
      <button
        className={styles.historyButton}
        onClick={() => console.log("История clicked")}
      >
        История
      </button>
    </nav>
  );
};

export default Navbar;
