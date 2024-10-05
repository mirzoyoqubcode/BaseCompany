import React from "react";
import {
  FaSearch,
  FaDatabase,
  FaUserFriends,
  FaMoneyBillWave,
  FaBookOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.scss";
import Navbar from "../Navbar/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboardContainer}>
      <Navbar />
      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Поиск..."
        />
        <button
          className={styles.searchButton}
          onClick={() => console.log("Search clicked")}
        >
          <FaSearch style={{ marginRight: "5px" }} /> Search
        </button>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/database")}
        >
          <FaDatabase style={{ marginRight: "5px" }} /> База
        </button>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/clients")}
        >
          <FaUserFriends style={{ marginRight: "5px" }} /> Клиенты
        </button>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/sales")}
        >
          <FaMoneyBillWave style={{ marginRight: "5px" }} /> Продажа
        </button>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/courses")}
        >
          <FaBookOpen style={{ marginRight: "5px" }} /> Курс
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
