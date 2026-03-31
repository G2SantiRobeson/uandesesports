import SectionHeading from './SectionHeading';
import styles from './Section.module.css';

function Section({
  id,
  eyebrow,
  title,
  description,
  muted = false,
  align = 'left',
  children,
}) {
  return (
    <section
      id={id}
      className={`${styles.section} ${muted ? styles.muted : ''}`}
    >
      <div className={styles.inner}>
        {title ? (
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            align={align}
          />
        ) : null}
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}

export default Section;
