import { createId, getBlockAdminTone } from '../../utils/siteConfigUtils';
import styles from './AdminForms.module.css';

const collectionTypes = new Set(['cards', 'news-list', 'events-list', 'team-list']);

function listToText(list = []) {
  return list.join('\n');
}

function textToList(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function BlockEditorForm({
  block,
  onUpdate,
  onMove,
  onRemove,
  canMoveUp,
  canMoveDown,
  positionLabel,
}) {
  const content = block.content || {};
  const tone = getBlockAdminTone(block.type);

  function updateContentField(field, value) {
    onUpdate({
      content: {
        [field]: value,
      },
    });
  }

  function updateArrayItem(field, itemId, updates) {
    updateContentField(
      field,
      (content[field] || []).map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      ),
    );
  }

  function removeArrayItem(field, itemId) {
    updateContentField(
      field,
      (content[field] || []).filter((item) => item.id !== itemId),
    );
  }

  function addAction() {
    updateContentField('actions', [
      ...(content.actions || []),
      {
        id: createId('action'),
        label: 'Nueva accion',
        href: '#/inicio',
        style: 'primary',
        visible: true,
      },
    ]);
  }

  function addStat() {
    updateContentField('stats', [
      ...(content.stats || []),
      {
        id: createId('stat'),
        value: '0',
        label: 'Nuevo dato',
      },
    ]);
  }

  function addCollectionItem() {
    updateContentField('items', [
      ...(content.items || []),
      {
        id: createId('item'),
        eyebrow: 'Etiqueta',
        title: 'Nuevo item',
        description: 'Describe este item desde el panel admin.',
        imageUrl: '',
        imageAlt: '',
        meta: [],
        footer: '',
        accent: 'steel',
      },
    ]);
  }

  function addGalleryImage() {
    updateContentField('images', [
      ...(content.images || []),
      {
        id: createId('image'),
        url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
        alt: 'Nueva imagen',
        caption: '',
      },
    ]);
  }

  function renderActionsEditor() {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Acciones</h3>
          <button type="button" className={styles.ghostButton} onClick={addAction}>
            Agregar accion
          </button>
        </div>

        {(content.actions || []).map((action) => (
          <div key={action.id} className={styles.itemCard}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Label</label>
                <input
                  className={styles.input}
                  value={action.label}
                  onChange={(event) =>
                    updateArrayItem('actions', action.id, {
                      label: event.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Link</label>
                <input
                  className={styles.input}
                  value={action.href}
                  onChange={(event) =>
                    updateArrayItem('actions', action.id, {
                      href: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Estilo</label>
                <select
                  className={styles.select}
                  value={action.style}
                  onChange={(event) =>
                    updateArrayItem('actions', action.id, {
                      style: event.target.value,
                    })
                  }
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </div>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={action.visible !== false}
                  onChange={(event) =>
                    updateArrayItem('actions', action.id, {
                      visible: event.target.checked,
                    })
                  }
                />
                Visible
              </label>
            </div>

            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => removeArrayItem('actions', action.id)}
            >
              Eliminar accion
            </button>
          </div>
        ))}
      </div>
    );
  }

  function renderStatsEditor() {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Metricas</h3>
          <button type="button" className={styles.ghostButton} onClick={addStat}>
            Agregar dato
          </button>
        </div>

        {(content.stats || []).map((stat) => (
          <div key={stat.id} className={styles.itemCard}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Valor</label>
                <input
                  className={styles.input}
                  value={stat.value}
                  onChange={(event) =>
                    updateArrayItem('stats', stat.id, {
                      value: event.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Label</label>
                <input
                  className={styles.input}
                  value={stat.label}
                  onChange={(event) =>
                    updateArrayItem('stats', stat.id, {
                      label: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => removeArrayItem('stats', stat.id)}
            >
              Eliminar dato
            </button>
          </div>
        ))}
      </div>
    );
  }

  function renderCollectionEditor() {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Items de la coleccion</h3>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={addCollectionItem}
          >
            Agregar item
          </button>
        </div>

        {(content.items || []).map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Eyebrow</label>
                <input
                  className={styles.input}
                  value={item.eyebrow || ''}
                  onChange={(event) =>
                    updateArrayItem('items', item.id, {
                      eyebrow: event.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Titulo</label>
                <input
                  className={styles.input}
                  value={item.title}
                  onChange={(event) =>
                    updateArrayItem('items', item.id, {
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
                value={item.description || ''}
                onChange={(event) =>
                  updateArrayItem('items', item.id, {
                    description: event.target.value,
                  })
                }
              />
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Meta (una por linea)</label>
                <textarea
                  className={styles.textarea}
                  value={listToText(item.meta || [])}
                  onChange={(event) =>
                    updateArrayItem('items', item.id, {
                      meta: textToList(event.target.value),
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Footer</label>
                <input
                  className={styles.input}
                  value={item.footer || ''}
                  onChange={(event) =>
                    updateArrayItem('items', item.id, {
                      footer: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Imagen del item</label>
                <input
                  className={styles.input}
                  placeholder="https://..."
                  value={item.imageUrl || ''}
                  onChange={(event) =>
                    updateArrayItem('items', item.id, {
                      imageUrl: event.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Alt de imagen</label>
                <input
                  className={styles.input}
                  value={item.imageAlt || ''}
                  onChange={(event) =>
                    updateArrayItem('items', item.id, {
                      imageAlt: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Acento</label>
                <select
                  className={styles.select}
                  value={item.accent || 'steel'}
                  onChange={(event) =>
                    updateArrayItem('items', item.id, {
                      accent: event.target.value,
                    })
                  }
                >
                  <option value="steel">Steel</option>
                  <option value="warm">Warm</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => removeArrayItem('items', item.id)}
            >
              Eliminar item
            </button>
          </div>
        ))}
      </div>
    );
  }

  function renderGalleryEditor() {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Imagenes</h3>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={addGalleryImage}
          >
            Agregar imagen
          </button>
        </div>

        {(content.images || []).map((image) => (
          <div key={image.id} className={styles.itemCard}>
            <div className={styles.fieldGroup}>
              <label>URL</label>
              <input
                className={styles.input}
                value={image.url || ''}
                onChange={(event) =>
                  updateArrayItem('images', image.id, {
                    url: event.target.value,
                  })
                }
              />
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Alt</label>
                <input
                  className={styles.input}
                  value={image.alt || ''}
                  onChange={(event) =>
                    updateArrayItem('images', image.id, {
                      alt: event.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Caption</label>
                <input
                  className={styles.input}
                  value={image.caption || ''}
                  onChange={(event) =>
                    updateArrayItem('images', image.id, {
                      caption: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => removeArrayItem('images', image.id)}
            >
              Eliminar imagen
            </button>
          </div>
        ))}
      </div>
    );
  }

  function renderBlockImageEditor() {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Imagen opcional</h3>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label>URL de imagen</label>
            <input
              className={styles.input}
              placeholder="https://..."
              value={content.imageUrl || ''}
              onChange={(event) => updateContentField('imageUrl', event.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label>Alt de imagen</label>
            <input
              className={styles.input}
              value={content.imageAlt || ''}
              onChange={(event) => updateContentField('imageAlt', event.target.value)}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label>Caption</label>
          <input
            className={styles.input}
            value={content.caption || ''}
            onChange={(event) => updateContentField('caption', event.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.stack}
      style={{
        '--block-admin-accent': tone.accent,
        '--block-admin-surface': tone.surface,
        '--block-admin-line': tone.line,
      }}
    >
      <div className={`${styles.section} ${styles.blockShell}`}>
        <div className={styles.blockHeader}>
          <div>
            <span className={styles.blockEyebrow}>Tipo de bloque</span>
            <h3 className={styles.blockTitle}>{block.type}</h3>
            {positionLabel ? <p className={styles.inlineMeta}>{positionLabel}</p> : null}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={!canMoveUp}
              onClick={() => onMove('up')}
            >
              Subir
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={!canMoveDown}
              onClick={() => onMove('down')}
            >
              Bajar
            </button>
            <button type="button" className={styles.dangerButton} onClick={onRemove}>
              Eliminar
            </button>
          </div>
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={block.visible}
            onChange={(event) =>
              onUpdate({
                visible: event.target.checked,
              })
            }
          />
          Bloque visible
        </label>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label>Eyebrow</label>
            <input
              className={styles.input}
              value={content.eyebrow || ''}
              onChange={(event) => updateContentField('eyebrow', event.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label>Titulo</label>
            <input
              className={styles.input}
              value={content.title || ''}
              onChange={(event) => updateContentField('title', event.target.value)}
            />
          </div>
        </div>
      </div>

      {block.type === 'text' ? (
        <>
          <div className={styles.section}>
            <div className={styles.fieldGroup}>
              <label>Cuerpo</label>
              <textarea
                className={styles.textarea}
                value={content.body || ''}
                onChange={(event) => updateContentField('body', event.target.value)}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Highlight label</label>
                <input
                  className={styles.input}
                  value={content.highlightLabel || ''}
                  onChange={(event) =>
                    updateContentField('highlightLabel', event.target.value)
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Highlight text</label>
                <textarea
                  className={styles.textarea}
                  value={content.highlightText || ''}
                  onChange={(event) =>
                    updateContentField('highlightText', event.target.value)
                  }
                />
              </div>
            </div>
          </div>
          {renderBlockImageEditor()}
        </>
      ) : null}

      {block.type === 'hero' ? (
        <>
          <div className={styles.section}>
            <div className={styles.fieldGroup}>
              <label>Descripcion</label>
              <textarea
                className={styles.textarea}
                value={content.description || ''}
                onChange={(event) =>
                  updateContentField('description', event.target.value)
                }
              />
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Panel label</label>
                <input
                  className={styles.input}
                  value={content.panelLabel || ''}
                  onChange={(event) =>
                    updateContentField('panelLabel', event.target.value)
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Panel status</label>
                <input
                  className={styles.input}
                  value={content.panelStatus || ''}
                  onChange={(event) =>
                    updateContentField('panelStatus', event.target.value)
                  }
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Panel text</label>
              <textarea
                className={styles.textarea}
                value={content.panelText || ''}
                onChange={(event) =>
                  updateContentField('panelText', event.target.value)
                }
              />
            </div>
          </div>

          {renderBlockImageEditor()}
          {renderActionsEditor()}
          {renderStatsEditor()}
        </>
      ) : null}

      {block.type === 'image' ? (
        <div className={styles.section}>
          <div className={styles.fieldGroup}>
            <label>Descripcion</label>
            <textarea
              className={styles.textarea}
              value={content.description || ''}
              onChange={(event) => updateContentField('description', event.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label>Image URL</label>
            <input
              className={styles.input}
              value={content.imageUrl || ''}
              onChange={(event) => updateContentField('imageUrl', event.target.value)}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label>Alt text</label>
              <input
                className={styles.input}
                value={content.imageAlt || ''}
                onChange={(event) => updateContentField('imageAlt', event.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Caption</label>
              <input
                className={styles.input}
                value={content.caption || ''}
                onChange={(event) => updateContentField('caption', event.target.value)}
              />
            </div>
          </div>
        </div>
      ) : null}

      {collectionTypes.has(block.type) ? (
        <>
          <div className={styles.section}>
            <div className={styles.fieldGroup}>
              <label>Descripcion</label>
              <textarea
                className={styles.textarea}
                value={content.description || ''}
                onChange={(event) =>
                  updateContentField('description', event.target.value)
                }
              />
            </div>
          </div>
          {renderBlockImageEditor()}
          {renderCollectionEditor()}
        </>
      ) : null}

      {block.type === 'cta' ? (
        <>
          <div className={styles.section}>
            <div className={styles.fieldGroup}>
              <label>Descripcion</label>
              <textarea
                className={styles.textarea}
                value={content.description || ''}
                onChange={(event) =>
                  updateContentField('description', event.target.value)
                }
              />
            </div>
          </div>
          {renderBlockImageEditor()}
          {renderActionsEditor()}
        </>
      ) : null}

      {block.type === 'gallery' ? (
        <>
          <div className={styles.section}>
            <div className={styles.fieldGroup}>
              <label>Descripcion</label>
              <textarea
                className={styles.textarea}
                value={content.description || ''}
                onChange={(event) =>
                  updateContentField('description', event.target.value)
                }
              />
            </div>
          </div>
          {renderGalleryEditor()}
        </>
      ) : null}
    </div>
  );
}

export default BlockEditorForm;
