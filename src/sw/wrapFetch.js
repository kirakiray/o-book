async function wrapFetch(url, type) {
  if (type) {
    return fetch(url).then((e) => e[type]());
  }

  return fetch(url);
}
