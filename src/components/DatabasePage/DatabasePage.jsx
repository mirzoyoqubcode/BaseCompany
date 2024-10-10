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

  // Fetch products only on initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://46.101.131.127:8090/api/v1/products"
      );
      setBazaData(response.data);
    } catch (err) {
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
    const data = { ...formData, currency: "USD" };

    try {
      let product;
      if (editMode) {
        await axios.put(
          `http://46.101.131.127:8090/api/v1/products/${currentProductId}`,
          data
        );
        toast.success("Product updated successfully!");

        // Update the product in the state without re-fetching
        product = { ...data, productId: currentProductId };
        setBazaData((prevData) =>
          prevData.map((item) =>
            item.productId === currentProductId ? product : item
          )
        );
      } else {
        const response = await axios.post(
          "http://46.101.131.127:8090/api/v1/products",
          data
        );
        toast.success("Product added successfully!");
        product = response.data;

        // Add new product to the state without re-fetching
        setBazaData((prevData) => [...prevData, product]);
      }

      if (formData.images.length > 0) {
        const formDataImage = new FormData();
        formData.images.forEach((file) => {
          formDataImage.append("image", file);
        });
        const uploadUrl = editMode
          ? `http://46.101.131.127:8090/api/v1/products/${currentProductId}/upload-image`
          : `http://46.101.131.127:8090/api/v1/products/${product.productId}/upload-image`;
        await axios.post(uploadUrl, formDataImage);
      }

      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save product.");
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
      toast.error("Failed to fetch product for editing.");
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `http://46.101.131.127:8090/api/v1/products/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Remove the deleted product from the state without re-fetching
        setBazaData((prevData) =>
          prevData.filter((product) => product.productId !== productId)
        );
        toast.success("Product deleted successfully!");
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (err) {
      toast.error("Failed to delete product.");
    }
  };

  const getImageUrl = (imageUrl) => {
    return `http://46.101.131.127:8090/api/v1/files/image?imageUrl=${encodeURIComponent(
      imageUrl
    )}`;
  };

  const ProductImage = ({ imageUrl, name }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div className={styles.imageWrapper}>
        {!imageLoaded && (
          <div className={styles.imageLoader}>
            <ThreeDots color="#00BFFF" height={40} width={40} />
          </div>
        )}
        <img
          loading="lazy"
          src={getImageUrl(imageUrl)}
          alt={name}
          className={styles.image}
          style={{ display: imageLoaded ? "block" : "none" }}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
    );
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
                        {product.images && product.images.length > 0 ? (
                          <ProductImage
                            imageUrl={product.images[0]}
                            name={product.name}
                          />
                        ) : (
                          <img
                            src="static/images/tshirt.png"
                            alt={product.name}
                            className={styles.image}
                          />
                        )}
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
                  ></textarea>
                </div>
                <button type="submit">
                  {editMode ? "Сохранить изменения" : "Добавить продукт"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DatabasePage;
