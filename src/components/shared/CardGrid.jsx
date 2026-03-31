import styles from './CardGrid.module.css';

function CardGrid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}

export default CardGrid;
