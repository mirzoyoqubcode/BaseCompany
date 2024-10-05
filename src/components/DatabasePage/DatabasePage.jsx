import React, { useEffect, useState } from "react";
import styles from "./DatabasePage.module.scss";
import { FaTrash } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import { toast } from "react-toastify"; // Importing toast
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://46.101.131.127:8090/api/v1/products";
const IMAGE_UPLOAD_URL = "http://46.101.131.127:8090/api/v1/products";

const DatabasePage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productId: 0,
    name: "",
    description: "",
    type: "",
    purchasedPrice: 0,
    deliveryPrice: 0,
    benefit: 0,
    sellingPrice: 0,
    currency: "USD",
    quantity: 0,
    store: "",
    images: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Не удалось получить продукты.");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Ошибка при получении продуктов:", error);
      toast.error("Ошибка при получении продуктов.");
    }
  };

  const handleInputChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, reader.result],
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setNewProduct((prev) => {
      const images = [...prev.images];
      images.splice(index, 1);
      return { ...prev, images };
    });
  };

  const uploadImage = async (id, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch(`${IMAGE_UPLOAD_URL}/${id}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Не удалось загрузить изображение: ${errorMessage}`);
      }

      fetchProducts();
      toast.success("Изображение загружено успешно.");
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      toast.error(`Ошибка при загрузке изображения: ${error.message}`);
    }
  };

  const addProduct = async () => {
    const {
      name,
      description,
      type,
      purchasedPrice,
      deliveryPrice,
      benefit,
      sellingPrice,
      quantity,
      store,
      images,
    } = newProduct;

    if (
      !name ||
      !purchasedPrice ||
      !type ||
      !store ||
      quantity <= 0 ||
      images.length === 0
    ) {
      toast.error(
        "Пожалуйста, заполните все обязательные поля и добавьте хотя бы одно изображение."
      );
      return;
    }

    const jsonData = JSON.stringify({
      productId: 0,
      name,
      description,
      type,
      purchasedPrice,
      deliveryPrice,
      benefit,
      sellingPrice,
      currency: "USD",
      quantity,
      store,
      images,
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Не удалось добавить продукт: ${errorMessage}`);
      }

      const product = await response.json();

      for (const image of newProduct.images) {
        const response = await fetch(image);
        const blob = await response.blob();
        await uploadImage(product.productId, blob);
      }

      fetchProducts();
      resetForm();
      toast.success("Продукт добавлен успешно.");
    } catch (error) {
      console.error("Ошибка при добавлении продукта:", error);
      toast.error(`Ошибка при добавлении продукта: ${error.message}`);
    }
  };

  const resetForm = () => {
    setNewProduct({
      productId: 0,
      name: "",
      description: "",
      type: "",
      purchasedPrice: 0,
      deliveryPrice: 0,
      benefit: 0,
      sellingPrice: 0,
      currency: "USD",
      quantity: 0,
      store: "",
      images: [],
    });
  };

  const removeProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Не удалось удалить продукт: ${errorMessage}`);
      }

      fetchProducts();
      toast.success("Продукт удален успешно.");
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
      toast.error(`Ошибка при удалении продукта: ${error.message}`);
    }
  };

  return (
    <div className={styles.wrapper_product_database}>
      <Navbar />
      <div className={styles.databasePage}>
        <h1 className={styles.title}>База данных продуктов</h1>

        <div className={styles.formContainer}>
          <h2>Добавить новый продукт</h2>
          <div className={styles.imageUpload}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
            <div className={styles.imagePreviewContainer}>
              {newProduct.images.length > 0 &&
                newProduct.images.map((image, index) => (
                  <div key={index} className={styles.imagePreviewWrapper}>
                    <img
                      src={image}
                      alt="Предпросмотр"
                      className={styles.imagePreview}
                    />
                    <button
                      className={styles.removeImageButton}
                      onClick={() => removeImage(index)}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
            </div>
          </div>
          {[
            "name",
            "description",
            "type",
            "purchasedPrice",
            "deliveryPrice",
            "benefit",
            "sellingPrice",
            "quantity",
            "store",
          ].map((field, index) => (
            <input
              key={index}
              type={
                field === "quantity" || field.includes("Price")
                  ? "number"
                  : "text"
              }
              placeholder={
                field === "purchasedPrice"
                  ? "Закупочная цена"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={newProduct[field]}
              onChange={(e) =>
                handleInputChange(
                  field,
                  field.includes("Price") || field === "quantity"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
              className={styles.inputField}
            />
          ))}

          <button onClick={addProduct} className={styles.submitButton}>
            Добавить продукт
          </button>
        </div>

        <h2>Существующие продукты</h2>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Изображения</th>
              <th>Описание</th>
              <th>Тип</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.name}</td>
                <td>
                  <div className={styles.imageContainer}>
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt="Product"
                        className={styles.productImage}
                      />
                    ))}
                  </div>
                </td>
                <td>{product.description}</td>
                <td>{product.type}</td>
                <td>
                  {product.sellingPrice} {product.currency}
                </td>
                <td>
                  <button
                    onClick={() => removeProduct(product.productId)}
                    className={styles.removeButton}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatabasePage;
