import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import styles from "./SalesPage.module.scss";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import jsPDF from "jspdf"; // Use jsPDF imported from CDN
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import autoTable from "jspdf-autotable"; // Use AutoTable imported from CDN

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
    // Checkout logic to save order goes here
  };

  // Function to handle PDF download
  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");

    // Title
    doc.setFontSize(20);
    doc.text("Инвойс", 20, 20);

    // Add invoice date
    doc.setFontSize(12);
    doc.text(`Дата: ${new Date().toLocaleDateString()}`, 20, 30);

    // Column headers
    const headers = [
      "№",
      "Наименование",
      "КОД",
      "Цена",
      "Тип",
      "Склад",
      "Доступно",
      "Кол-во",
      "Итого",
    ];

    // Prepare data for the table
    const tableData = products.map((product, index) => [
      (index + 1).toString(),
      product.name,
      product.productId.toString(),
      product.sellingPrice.toFixed(2),
      product.type,
      product.store,
      product.quantity.toString(),
      product.localQuantity.toString(),
      (product.sellingPrice * product.localQuantity).toFixed(2),
    ]);

    // Use jsPDF-AutoTable to create a table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 50,
      styles: { cellPadding: 5, fontSize: 10 },
    });

    // Total amount at the end of the invoice
    const totalAmount = calculateTotal();
    doc.setFont("Helvetica", "bold");
    doc.text(
      `Общая сумма: ${totalAmount.toFixed(2)} сум`,
      20,
      doc.autoTable.previous.finalY + 10
    );

    // Save the PDF
    doc.save("invoice.pdf");
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
        <button className={styles.checkoutBtn} onClick={handleDownloadInvoice}>
          <AiOutlineShoppingCart size={24} />
        </button>
      </footer>
    </div>
  );
};

export default SalesPage;
