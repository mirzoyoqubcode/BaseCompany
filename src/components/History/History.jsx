import React, { useEffect, useState } from "react";
import styles from "./History.module.scss";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ORDER_API_URL = "http://46.101.131.127:8090/api/v1/orders";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(ORDER_API_URL);
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data); // Initially show all orders
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Ошибка загрузки истории заказов: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to handle filtering when the Search button is clicked
  const handleSearch = () => {
    if (!selectedDate) {
      setFilteredOrders(orders); // Show all if no date is selected
    } else {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdDate);
        return (
          orderDate.getFullYear() === selectedDate.getFullYear() &&
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getDate() === selectedDate.getDate()
        );
      });
      setFilteredOrders(filtered); // Update filtered orders
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.historyContainer}>
        <h1>История заказов</h1>

        {/* Date filter */}
        <div className={styles.filterContainer}>
          <label htmlFor="selectedDate">Выберите дату:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className={styles.datePicker}
            placeholderText="Выберите дату"
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Поиск
          </button>
        </div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>Loading...</div>
          </motion.div>
        ) : (
          <motion.table
            className={styles.historyTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead>
              <tr>
                <th>Номер заказа</th>
                <th>Клиент</th>
                <th>Список товаров</th>
                <th>Общая сумма</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5">Нет заказов</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <motion.tr
                    key={order.orderId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <td>{order.orderId}</td>
                    <td>
                      {order.client.name} <br />
                      Телефон: {order.client.phoneNumber} <br />
                      Telegram: {order.client.telegramUsername}
                    </td>
                    <td>
                      <ul>
                        {order.orderItems.map((item) => (
                          <li key={item.productId}>
                            {item.productName} (x{item.quantity}) - {item.price}{" "}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{order.totalAmount.toFixed(2)}</td>
                    <td>{new Date(order.createdDate).toLocaleDateString()}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </motion.table>
        )}
      </div>
    </div>
  );
};

export default History;
