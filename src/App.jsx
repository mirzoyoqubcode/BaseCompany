import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import DatabasePage from "./components/DatabasePage/DatabasePage";
import ClientsPage from "./components/ClientsPage/ClientsPage";
import SalesPage from "./components/SalesPage/SalesPage";
import History from "./components/History/History";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/database"
          element={<ProtectedRoute element={<DatabasePage />} />}
        />
        <Route path="/clients" element={<ClientsPage />} />
        <Route
          path="/historyofcheck"
          element={<ProtectedRoute element={<History />} />}
        />
        <Route path="/sales" element={<SalesPage />} />
      </Routes>
    </div>
  );
};

export default App;
