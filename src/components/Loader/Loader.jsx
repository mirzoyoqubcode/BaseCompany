import React from "react";
import { ThreeDots } from "react-loader-spinner";
import styles from "./Loader.module.scss";

const Loader = () => {
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
};

export default Loader;
