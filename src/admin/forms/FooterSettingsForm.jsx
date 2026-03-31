import { createId } from '../../utils/siteConfigUtils';
import styles from './AdminForms.module.css';

function FooterSettingsForm({
  footer,
  onUpdateFooter,
  onReplaceFooterLinks,
}) {
  function updateLink(linkId, updates) {
    onReplaceFooterLinks(
      (footer.socialLinks || []).map((link) =>
        link.id === linkId ? { ...link, ...updates } : link,
      ),
    );
  }

  function removeLink(linkId) {
    onReplaceFooterLinks(
      (footer.socialLinks || []).filter((link) => link.id !== linkId),
    );
  }

  function addLink() {
    onReplaceFooterLinks([
      ...(footer.socialLinks || []),
      {
        id: createId('social'),
        label: 'Nueva red',
        href: 'https://example.com',
        visible: true,
      },
    ]);
  }

  return (
    <div className={styles.stack}>
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label>Eyebrow</label>
            <input
              className={styles.input}
              value={footer.eyebrow || ''}
              onChange={(event) =>
                onUpdateFooter({
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div className={styles.fieldGroup}>
            <label>Titulo</label>
            <input
              className={styles.input}
              value={footer.title || ''}
              onChange={(event) =>
                onUpdateFooter({
                  title: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label>Descripcion</label>
          <textarea
            className={styles.textarea}
            value={footer.description || ''}
            onChange={(event) =>
              onUpdateFooter({
                description: event.target.value,
              })
            }
          />
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label>Email</label>
            <input
              className={styles.input}
              value={footer.contactEmail || ''}
              onChange={(event) =>
                onUpdateFooter({
                  contactEmail: event.target.value,
                })
              }
            />
          </div>
          <div className={styles.fieldGroup}>
            <label>Ubicacion</label>
            <input
              className={styles.input}
              value={footer.location || ''}
              onChange={(event) =>
                onUpdateFooter({
                  location: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label>Copyright</label>
          <input
            className={styles.input}
            value={footer.copyright || ''}
            onChange={(event) =>
              onUpdateFooter({
                copyright: event.target.value,
              })
            }
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Redes sociales</h3>
          <button type="button" className={styles.ghostButton} onClick={addLink}>
            Agregar red
          </button>
        </div>

        {(footer.socialLinks || []).map((link) => (
          <div key={link.id} className={styles.itemCard}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Label</label>
                <input
                  className={styles.input}
                  value={link.label || ''}
                  onChange={(event) =>
                    updateLink(link.id, {
                      label: event.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>URL</label>
                <input
                  className={styles.input}
                  value={link.href || ''}
                  onChange={(event) =>
                    updateLink(link.id, {
                      href: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={link.visible !== false}
                onChange={(event) =>
                  updateLink(link.id, {
                    visible: event.target.checked,
                  })
                }
              />
              Visible
            </label>

            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => removeLink(link.id)}
            >
              Eliminar red
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FooterSettingsForm;
