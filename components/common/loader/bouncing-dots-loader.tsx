import styles from './bouncing-dots-loader.module.css';

const BouncingDotsLoader = ({onPage}:{onPage?: boolean}) => (
  <div className={`${styles.loader} ${onPage && "fixed flex gap-1 h-screen w-screen items-center justify-center"}`}>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>
  </div>
);

export default BouncingDotsLoader;