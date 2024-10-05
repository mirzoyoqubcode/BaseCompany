import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import DatabasePage from "./components/DatabasePage/DatabasePage";
import ClientsPage from "./components/ClientsPage/ClientsPage";
import SalesPage from "./components/SalesPage/SalesPage";
import CoursesPage from "./components/CoursesPage/CoursesPage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/database" element={<DatabasePage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/courses" element={<CoursesPage />} />
    </Routes>
  );
};

export default App;
