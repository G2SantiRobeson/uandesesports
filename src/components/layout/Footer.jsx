import styles from './Footer.module.css';

function Footer({ footer }) {
  return (
    <footer id="contacto" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <p className={styles.eyebrow}>{footer.eyebrow}</p>
          <h2>{footer.title}</h2>
          <p className={styles.copy}>{footer.description}</p>
        </div>

        <div className={styles.columns}>
          <div>
            <h3>Contacto</h3>
            <a href={`mailto:${footer.contactEmail}`}>{footer.contactEmail}</a>
            <p>{footer.location}</p>
          </div>

          <div>
            <h3>Redes</h3>
            <div className={styles.links}>
              {footer.socialLinks
                ?.filter((link) => link.visible)
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir ${link.label}`}
                  >
                    {link.label}
                  </a>
                ))}
            </div>
          </div>
        </div>

        <p className={styles.bottomLine}>{footer.copyright}</p>
      </div>
    </footer>
  );
}

export default Footer;
