import React, { useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import styles from "./Login.module.scss";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      if (username === "mirzoyoqub" && password === "mirzoyoqub2004") {
        login();
        const redirectPath = location.state?.from || "/dashboard";
        navigate(redirectPath);
      } else {
        setError("Неверные учетные данные");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h2 className={styles.title}>Логин</h2>
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}
        <div className={styles.inputGroup}>
          <label>Имя пользователя</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className={styles.loginButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <BallTriangle color="#fff" height={20} width={20} />
          ) : (
            "Логин"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
