import styles from './bouncing-dots-loader.module.css';

interface BouncingDotsLoaderProps {
  onPage?: boolean;
}

const BouncingDotsLoader = ({ onPage = false }: BouncingDotsLoaderProps) => {
  const loaderContent = <div className={styles.loader}></div>;
  
  if (onPage) {
    return <div className={styles.overlay}>{loaderContent}</div>;
  }
  
  return loaderContent;
};

export default BouncingDotsLoader;