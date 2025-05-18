import styles from './bouncing-dots-loader.module.css';

const BouncingDotsLoader = ({onPage}:{onPage?: boolean}) => (
  <div className={styles.loader}></div>
);

export default BouncingDotsLoader;