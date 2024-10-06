import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import styles from "./SalesPage.module.scss";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";

const API_URL = "http://46.101.131.127:8090/api/v1/products";
const ORDER_API_URL = "http://46.101.131.127:8090/api/v1/orders";

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCode, setSearchCode] = useState("");

  const handleSearch = useCallback(async () => {
    if (!searchCode) {
      toast.error("Пожалуйста, введите код продукта.");
      return;
    }

    setIsLoading(true);
    try {
      const id = Number(searchCode);
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Продукт не найден.");

      const data = await response.json();
      setProducts((prevProducts) => {
        const existingProductIndex = prevProducts.findIndex(
          (p) => p.productId === data.productId
        );

        if (existingProductIndex !== -1) {
          const updatedProducts = [...prevProducts];
          updatedProducts[existingProductIndex].localQuantity += 1;
          return updatedProducts;
        } else {
          return [...prevProducts, { ...data, localQuantity: 1 }];
        }
      });
    } catch (error) {
      console.error("Ошибка при поиске продукта:", error);
      toast.error("Продукт не найден.");
    } finally {
      setIsLoading(false);
    }
  }, [searchCode]);

  const handleQuantityChange = useCallback(
    (productId, quantity) => {
      const product = products.find((p) => p.productId === productId);

      if (product) {
        const newQuantity = Math.max(0, quantity);
        if (newQuantity > product.quantity) {
          toast.error("Количество не может превышать доступное количество.");
          return;
        }

        const updatedProducts = products.map((product) =>
          product.productId === productId
            ? {
                ...product,
                localQuantity: newQuantity,
              }
            : product
        );
        setProducts(updatedProducts);
      }
    },
    [products]
  );

  const calculateTotal = () => {
    return products.reduce(
      (acc, product) => acc + product.sellingPrice * product.localQuantity,
      0
    );
  };

  const handleCheckout = async () => {
    if (products.length === 0) {
      toast.error("Нет товаров для оформления покупки.");
      return;
    }

    const currencyRate = localStorage.getItem("dollarAmount");

    const orderItems = products
      .filter((product) => product.localQuantity > 0)
      .map((product) => ({
        productId: product.productId,
        productName: product.name,
        quantity: product.localQuantity,
        price: product.sellingPrice,
        totalAmount: (product.sellingPrice * product.localQuantity).toFixed(2),
        currency: "USD",
        totalInUZS: (
          product.sellingPrice *
          product.localQuantity *
          currencyRate
        ).toFixed(2),
        currencyRate: currencyRate,
      }));

    if (orderItems.length === 0) {
      toast.error("Нет действительных товаров для оформления покупки.");
      return;
    }

    const client = {
      id: 1,
      name: "Client Name",
      phoneNumber: "Client Phone Number",
      telegramUsername: "Client Telegram Username",
    };

    const orderData = {
      client,
      orderItems,
      totalAmount: calculateTotal(),
      currencyRate: currencyRate,
    };

    console.log("Данные заказа: ", orderData);

    try {
      const response = await fetch(ORDER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ответ об ошибке: ", errorData);
        // throw new Error(errorData.message);
      }

      setProducts([]);
      toast.success("Покупка успешно оформлена!");
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      toast.error("Ошибка оформления покупки: " + error.message);
    }
  };

  return (
    <div className={styles.salesPageContainer}>
      <Navbar />
      <header className={styles.navbar}>
        <h1>Продажа</h1>
      </header>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="Поиск по коду..."
        />
        <button className={styles.searchBtn} onClick={handleSearch}>
          <AiOutlineSearch size={24} />
        </button>
      </div>
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loader}>
            <ThreeDots height="80" width="80" />
          </div>
        ) : products.length > 0 ? (
          <table className={styles.salesTable}>
            <thead>
              <tr>
                <th>№</th>
                <th>Изображение</th>
                <th>КОД</th>
                <th>Цена</th>
                <th>Тип</th>
                <th>Склад</th>
                <th>Доступно</th>
                <th>Кол-во</th>
                <th>Итого</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.productId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={product.images[0] || "static/images/tshirt.png"}
                      alt={product.name}
                      className={styles.productImg}
                    />
                  </td>
                  <td>{product.productId}</td>
                  <td>{product.sellingPrice.toFixed(2)}</td>
                  <td>{product.type}</td>
                  <td>{product.store}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <input
                      type="number"
                      value={product.localQuantity}
                      min="0"
                      onChange={(e) =>
                        handleQuantityChange(
                          product.productId,
                          Math.max(0, parseInt(e.target.value, 10))
                        )
                      }
                      className={styles.quantityInput}
                    />
                  </td>
                  <td>
                    {(product.sellingPrice * product.localQuantity).toFixed(2)}{" "}
                    сум
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.noResults}>Товар не найден.</div>
        )}
      </div>
      <footer className={styles.summary}>
        <span className={styles.totalPrice}>
          {calculateTotal().toFixed(2)} сум
        </span>
        <button className={styles.checkoutBtn} onClick={handleCheckout}>
          <AiOutlineShoppingCart size={24} />
        </button>
      </footer>
    </div>
  );
};

export default SalesPage;
