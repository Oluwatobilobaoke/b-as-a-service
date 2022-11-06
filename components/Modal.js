import styles from "../styles/modal.module.css";

export const Modal = ({ component, isOpen, close }) => {
  return isOpen ? (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={close}></div>
      <div className={styles.component}> {component}</div>
    </div>
  ) : null;
};
