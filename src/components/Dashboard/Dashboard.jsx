import React, { useState } from "react";
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
import CourseModal from "../CourseModal/CourseModal"; // Import the CourseModal

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

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
          <FaSearch /> Search
        </button>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/database")}
        >
          <FaDatabase /> База
        </button>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/clients")}
        >
          <FaUserFriends /> Клиенты
        </button>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/sales")}
        >
          <FaMoneyBillWave /> Продажа
        </button>
        <button
          className={styles.actionButton}
          onClick={() => setModalOpen(true)} // Open the modal when the button is clicked
        >
          <FaBookOpen /> Курс
        </button>
      </div>

      {/* Render the CourseModal and pass props */}
      <CourseModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
