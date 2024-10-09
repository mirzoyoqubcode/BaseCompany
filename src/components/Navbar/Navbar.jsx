import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { IoMdArrowBack } from "react-icons/io";
const Navbar = () => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate("/dashboard");
  };

  return (
    <nav className={styles.navbar}>
      <button className={styles.backButton} onClick={handleBackButtonClick}>
        <Link className={styles.link} to="/">
          <IoMdArrowBack />
        </Link>
        Назад
      </button>
      <h1 className={styles.title}>Добро пожаловать!</h1>
      <button className={styles.historyButton}>
        <Link to={"/historyofcheck"} className={styles.link}>
          История
        </Link>
      </button>
    </nav>
  );
};

export default Navbar;
