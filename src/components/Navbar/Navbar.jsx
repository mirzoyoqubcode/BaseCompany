import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { IoMdArrowBack } from "react-icons/io";
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link className={styles.link} to="/">
        <button className={styles.backButton}>
          <IoMdArrowBack />
          Назад
        </button>
      </Link>
      <h1 className={styles.title}>Добро пожаловать!</h1>
      <Link to={"/historyofcheck"} className={styles.link}>
        <button className={styles.historyButton}>История</button>
      </Link>
    </nav>
  );
};

export default Navbar;
