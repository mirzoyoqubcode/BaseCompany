import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import styles from "./DatabasePage.module.scss";
import Navbar from "../Navbar/Navbar";

const DatabasePage = () => {
  const [bazaData, setBazaData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    description: "",
    type: "",
    purchasedPrice: "",
    deliveryPrice: "",
    benefit: "",
    sellingPrice: "",
    quantity: "",
    store: "",
    images: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://46.101.131.127:8090/api/v1/products"
      );
      setBazaData(response.data);
    } catch (err) {
      console.error("Error fetching products", err);
      toast.error("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      currency: "USD",
    };

    try {
      if (editMode) {
        await axios.put(
          `http://46.101.131.127:8090/api/v1/products/${currentProductId}`,
          data
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post("http://46.101.131.127:8090/api/v1/products", data);
        toast.success("Product added successfully!");
      }

      if (formData.images.length > 0) {
        const formDataImage = new FormData();
        formData.images.forEach((file) => {
          formDataImage.append("image", file);
        });
        if (editMode) {
          await axios.post(
            `http://46.101.131.127:8090/api/v1/products/${currentProductId}/upload-image`,
            formDataImage
          );
        } else {
          await axios.post(
            "http://46.101.131.127:8090/api/v1/products/upload-image",
            formDataImage
          );
        }
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
      if (err.response) {
        toast.error("Failed to save product.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleEdit = async (productId) => {
    try {
      const response = await axios.get(
        `http://46.101.131.127:8090/api/v1/products/${productId}`
      );
      setFormData(response.data);
      setEditMode(true);
      setCurrentProductId(productId);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching product", err);
      toast.error("Failed to fetch product for editing.");
    }
  };

  const handleDelete = async (productId) => {
    // Show confirmation dialog before deleting
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return; // Exit the function if the user cancels

    try {
      await axios.delete(
        `http://46.101.131.127:8090/api/v1/products/${productId}`
      );
      fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product", err);
      toast.error("Failed to delete product.");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <Navbar />
        <div className={styles["table-container"]}>
          {loading ? (
            <div className={styles.loader}>
              <ThreeDots color="#00BFFF" height={80} width={80} />
            </div>
          ) : (
            <table className={styles["baza-table"]}>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Изображение</th>
                  <th>КОД</th>
                  <th>Наименование</th>
                  <th>Покупка</th>
                  <th>Карго</th>
                  <th>Прибыль</th>
                  <th>Цена</th>
                  <th>Тип</th>
                  <th>Кол-во</th>
                  <th>
                    <button
                      className={styles["add-btn"]}
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          productId: "",
                          name: "",
                          description: "",
                          type: "",
                          purchasedPrice: "",
                          deliveryPrice: "",
                          benefit: "",
                          sellingPrice: "",
                          quantity: "",
                          store: "",
                          images: [],
                        });
                        setShowModal(true);
                      }}
                    >
                      <FaPlus />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {bazaData.length > 0 ? (
                  bazaData.map((product, index) => (
                    <tr key={product.productId}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0]
                              : "static/images/tshirt.png"
                          }
                          alt={product.name}
                          className={styles.image}
                        />
                      </td>
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td>{product.purchasedPrice}</td>
                      <td>{product.deliveryPrice}</td>
                      <td>{product.benefit}</td>
                      <td>{product.sellingPrice}</td>
                      <td>{product.type}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <button
                          className={styles["edit-btn"]}
                          onClick={() => handleEdit(product.productId)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={styles["delete-btn"]}
                          onClick={() => handleDelete(product.productId)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">Нет данных для отображения</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {showModal && (
          <div className={styles.modal}>
            <div className={styles["modal-content"]}>
              <span
                className={styles["close-btn"]}
                onClick={() => setShowModal(false)}
              >
                &times;
              </span>
              <h2>
                {editMode ? "Редактировать элемент" : "Добавить новый элемент"}
              </h2>
              <form onSubmit={handleSubmit} className={styles["modal-form"]}>
                <div className={styles["form-row"]}>
                  <label htmlFor="image">Изображение:</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="productId">КОД:</label>
                  <input
                    type="text"
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="name">Наименование:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="description">Описание:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="type">Тип:</label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="purchasedPrice">Покупка:</label>
                  <input
                    type="number"
                    id="purchasedPrice"
                    name="purchasedPrice"
                    value={formData.purchasedPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="deliveryPrice">Карго:</label>
                  <input
                    type="number"
                    id="deliveryPrice"
                    name="deliveryPrice"
                    value={formData.deliveryPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="benefit">Прибыль:</label>
                  <input
                    type="number"
                    id="benefit"
                    name="benefit"
                    value={formData.benefit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="sellingPrice">Цена:</label>
                  <input
                    type="number"
                    id="sellingPrice"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="quantity">Количество:</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-row"]}>
                  <label htmlFor="store">Магазин:</label>
                  <input
                    type="text"
                    id="store"
                    name="store"
                    value={formData.store}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className={styles["submit-btn"]}>
                  {editMode ? "Сохранить изменения" : "Добавить продукт"}
                </button>
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default DatabasePage;
