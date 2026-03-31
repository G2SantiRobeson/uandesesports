import styles from './SectionHeading.module.css';

function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`${styles.heading} ${align === 'center' ? styles.center : ''}`}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}

export default SectionHeading;
