import styles from './bouncing-dots-loader.module.css';

const BouncingDotsLoader = () => (
  <div className={styles.loader}>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>
  </div>
);

export default BouncingDotsLoader;