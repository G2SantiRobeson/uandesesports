export function getSlugFromHash(hashValue = window.location.hash) {
  if (!hashValue.startsWith('#/')) {
    return null;
  }

  const normalizedHash = hashValue.replace(/^#\/?/, '').trim();
  return normalizedHash || '';
}

export function setHashSlug(slug) {
  window.location.hash = `#/${slug}`;
}
