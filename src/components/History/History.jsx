import React, { useEffect, useState } from "react";
import styles from "./History.module.scss";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";

const ORDER_API_URL = "http://46.101.131.127:8090/api/v1/orders";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(ORDER_API_URL);
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Ошибка загрузки истории заказов: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.historyContainer}>
        <h1>История заказов</h1>
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
                <th>Список товаров</th>
                <th>Общая сумма</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4">Нет заказов</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <td>{order.id}</td>
                    <td>
                      <ul>
                        {order.orderItems.map((item) => (
                          <li key={item.productId}>
                            {item.productId} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{order.totalPrice.toFixed(2)} сум</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
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
