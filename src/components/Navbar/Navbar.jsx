import React from "react";
import { useNavigate } from "react-router-dom";
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
        <IoMdArrowBack />
        Назад
      </button>
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
