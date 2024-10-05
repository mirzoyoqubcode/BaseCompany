import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ClientsPage.module.scss";
import Navbar from "../Navbar/Navbar";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newClient, setNewClient] = useState({
    name: "",
    phoneNumber: "",
    telegramUsername: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://46.101.131.127:8090/api/v1/clients"
        );
        setClients(response.data);
      } catch (err) {
        console.error("Error fetching clients", err);
        setError("Не удалось загрузить клиентов. Попробуйте снова.");
        toast.error("Не удалось загрузить клиентов. Попробуйте снова.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        await axios.put(
          `http://46.101.131.127:8090/api/v1/clients/${editingClientId}`,
          newClient
        );
        setClients(
          clients.map((client) =>
            client.id === editingClientId ? { ...client, ...newClient } : client
          )
        );
        toast.success("Клиент успешно обновлён!");
      } else {
        const response = await axios.post(
          "http://46.101.131.127:8090/api/v1/clients",
          newClient
        );
        setClients([...clients, response.data]);
        toast.success("Клиент успешно добавлен!");
      }
      setNewClient({ name: "", phoneNumber: "", telegramUsername: "" });
      setEditMode(false);
      setEditingClientId(null);
    } catch (err) {
      console.error("Error saving client", err);
      toast.error("Не удалось сохранить клиента. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const editClient = (client) => {
    setNewClient(client);
    setEditMode(true);
    setEditingClientId(client.id);
  };

  const deleteClient = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://46.101.131.127:8090/api/v1/clients/${id}`);
      setClients(clients.filter((client) => client.id !== id));
      toast.success("Клиент успешно удалён!");
    } catch (err) {
      console.error("Error deleting client", err);
      toast.error("Не удалось удалить клиента. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <ThreeDots
          height={100}
          width={100}
          color="#4CAF50"
          ariaLabel="loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h2 className={styles.heading}>Клиенты</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          id="clientName"
          name="clientName"
          placeholder="Имя"
          value={newClient.name}
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          required
        />
        <input
          type="tel"
          id="clientPhone"
          name="clientPhone"
          placeholder="Телефон"
          value={newClient.phoneNumber}
          onChange={(e) =>
            setNewClient({ ...newClient, phoneNumber: e.target.value })
          }
          required
        />
        <input
          type="text"
          id="clientTelegram"
          name="clientTelegram"
          placeholder="Telegram"
          value={newClient.telegramUsername}
          onChange={(e) =>
            setNewClient({ ...newClient, telegramUsername: e.target.value })
          }
          required
        />
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn}>
            {editMode ? "Сохранить" : "Добавить"}
          </button>
          {editMode && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setEditMode(false)}
            >
              Отмена
            </button>
          )}
        </div>
      </form>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>№</th>
              <th>Имя</th>
              <th>Телефон</th>
              <th>Telegram</th>
              <th>Заказы</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client, index) => (
                <tr key={client.id}>
                  <td>{index + 1}</td>
                  <td>{client.name}</td>
                  <td>{client.phoneNumber}</td>
                  <td>@{client.telegramUsername}</td>
                  <td>
                    {client.orderIds && client.orderIds.length > 0
                      ? client.orderIds.join(", ")
                      : "Нет заказов"}
                  </td>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => editClient(client)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteClient(client.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Нет данных клиентов.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;
