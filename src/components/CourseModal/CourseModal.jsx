import React, { useState, useEffect, useRef } from "react";
import styles from "./CourseModal.module.scss";

const CourseModal = ({ isOpen, onClose }) => {
  const [dollarAmount, setDollarAmount] = useState(0);
  const modalRef = useRef(null);

  const handleSave = () => {
    localStorage.setItem("dollarAmount", dollarAmount);
    onClose();
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <h2>Введите сумму в долларах</h2>
        <input
          type="number"
          placeholder="Сумма в долларах"
          value={dollarAmount}
          onChange={(e) => setDollarAmount(e.target.value)}
          required
        />
        <div className={styles.modalActions}>
          <button onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
